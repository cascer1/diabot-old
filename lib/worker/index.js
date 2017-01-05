/*
 * diabot
 * Copyright (C) 2016  Cas Eliëns
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

"use strict";

const fs      = require("fs");
const Clapp   = require("./../modules/clapp-discord");
const cfg     = require("../../config.js");
const pkg     = require("../../package.json");
const Discord = require("discord.js");
let mysql     = require("mysql");
let Q         = require("q");
let functions = require("./../global/functions.js");
const rabbit  = require('rabbot');
let settings  = require("../rabbitconfig.js");

let pool = mysql.createPool({
    host    : process.env.DIABOT_DB_HOST,
    user    : process.env.DIABOT_DB_USER,
    password: process.env.DIABOT_DB_PASS,
    database: process.env.DIABOT_DB_NAME,

    connectionLimit   : process.env.DIABOT_DB_LIMIT, // Default value is 10.
    waitForConnections: true, // Default value.
    queueLimit        : 0 // Unlimited - default value.
});

const bot = new Discord.Client();

let handler;

module.exports.Q        = Q;
module.exports.promises = [];
module.exports.pool     = pool;

// Let's create a simple database API that exposes a promise-based query method. This
// way, we can wait for responses to come back before we teardown the connection pool.
module.exports.db = {
    query: (sql, params) => {

        let deferred = module.exports.Q.defer();

        // CAUTION: When using the node-resolver, the records and fields get passed into
        // the resolution handler as an array.
        module.exports.pool.query(sql, params, deferred.makeNodeResolver());

        module.exports.promises.push(deferred.promise);

        return ( deferred.promise );
    }
};

let app = new Clapp.App({
    name   : cfg.name,
    desc   : pkg.description,
    prefix : cfg.prefix,
    version: pkg.version,
    onReply: (msg, context) => {
        context.message.reply(msg);
    }
});


rabbit.configure(settings).done(function () {
    console.log("Loading commands");

    // Load every command in the commands folder
    fs.readdirSync("./lib/worker/commands/").forEach((file) => {
        app.addCommand(require("./commands/" + file));
    });

    console.log("Connected to message queue");
    console.log("Connecting to Discord");

    handler = rabbit.handle("diabot.discord.message", handleDiscordMessage);

    handler.catch(handleException);

    bot.login(process.env.TOKEN)
        .then(() => {
            console.log("Logged in to Discord");
            console.log("Subscribing to messages queue");
            rabbit.startSubscription(process.env.DIABOT_QUEUE_NAME);
        });
});

function handleException(err, msg) {
    functions.showError(err);
    msg.nack();
}

function handleDiscordMessage(message) {
    console.log("Received message at " + +new Date());
    message.ack();

    let metadata = {
        guildId  : message.properties.headers.guild,
        channelId: message.properties.headers.channel,
        messageId: message.properties.headers.message,
        memberId : message.properties.headers.member,
        userId   : message.properties.headers.user
    };

    bot.channels.get(metadata.channelId).fetchMessage(metadata.messageId).then((msg) => {
        if (app.isCliSentence(msg.content)) {
            app.parseInput(msg.content, {
                msg    : msg,
                q      : Q,
                bot    : bot,
                message: message
            });
        }
    });


}

function disconnectRabbit() {
    let deferred = Q.defer();
    console.log("Disconnecting from message queue");

    rabbit.shutdown()
        .then(() => {
            console.log("Disconnected from message queue");
            deferred.resolve();
        });

    return deferred.promise;
}

function disconnectPool() {
    let deferred = Q.defer();
    console.log("Closing database connection pool");

    Q.allSettled(module.exports.promises)
        .then((snapshots) => {
            pool.end(() => {
                console.log("Closed database connection pool");
                deferred.resolve();
            });
        });

    return deferred.promise;
}

function disconnectBot() {
    let deferred = Q.defer();
    console.log("Disconnecting from Discord");

    bot.destroy()
        .then(() => {
            console.log("Disconnected from Discord");
            deferred.resolve();
        });

    return deferred.promise;
}


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, error) {
    if (error) {
        console.log(error.stack);
    }

    if (options.crash) {
        console.log("Crashed, starting shutdown");
    }

    if (options.cleanup) {
        console.log("starting shutdown procedure");
        try {
            // These promises must be resolved in order
            Promise.resolve()
                .then(() => {
                    return disconnectRabbit();
                })
                .then(() => {
                    return disconnectPool();
                })
                .then(() => {
                    return disconnectBot();
                })
                .then(() => {
                    console.log("Good Bye");
                    process.exit(0);
                });
        }
        catch (error) {
            console.error(error);
        }
    }

    if (options.exit) {
        process.exit(0);
    }
}

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {cleanup: true}));

//catches a Heroku dyno shutdown event
process.on("SIGTERM", exitHandler.bind(null, {cleanup: true}));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {cleanup: true, crash: true}));


// Connections, within the pool, are created in a lazy manner. When a connection is
// established, the connection event is fired. This does not happen each time a
// connection is obtained from the pool - only when the connection is first created.
pool.on("connection", () => {
    //console.log(chalk.bgYellow.white("Pooled connection established."));
});

// When we submit a query before a pooled connection is available, the driver will
// queue the query until a pooled connection becomes available.
pool.on("enqueue", () => {
    //console.log(chalk.bgYellow.white("Waiting for connection slot."));
});
