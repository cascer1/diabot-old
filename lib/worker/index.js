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

const fs = require("fs");
const Clapp = require("./../modules/clapp-discord");
const cfg = require("../../config.js");
const pkg = require("../../package.json");
const Discord = require("discord.js");
let mysql = require("mysql");
let Q = require("q"); // v2.11.1
let functions = require("./../global/functions.js");
let rabbit = require('rabbot');
let settings = require("../rabbitconfig.js");

let pool = mysql.createPool({
    host: process.env.DIABOT_DB_HOST,
    user: process.env.DIABOT_DB_USER,
    password: process.env.DIABOT_DB_PASS,
    database: process.env.DIABOT_DB_NAME,

    connectionLimit: process.env.DIABOT_DB_LIMIT, // Default value is 10.
    waitForConnections: true, // Default value.
    queueLimit: 0 // Unlimited - default value.
});

const bot = new Discord.Client();

let handler;

module.exports.Q = Q;
module.exports.promises = [];
module.exports.pool = pool;

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
    name: cfg.name,
    desc: pkg.description,
    prefix: cfg.prefix,
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
            rabbit.startSubscription("local.messages");
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
        guildId: message.properties.headers.guild,
        channelId: message.properties.headers.channel,
        messageId: message.properties.headers.message,
        memberId: message.properties.headers.member,
        userId: message.properties.headers.user
    };

    bot.channels.get(metadata.channelId).fetchMessage(metadata.messageId).then((msg) => {
        if (app.isCliSentence(msg.content)) {
            app.parseInput(msg.content, {
                msg: msg,
                q: Q,
                bot: bot,
                message: message
            });
        }
    });


}


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (err) {
        console.log(err.stack);
    }

    if (options.crash) {
        console.log("Crashed, starting shutdown");
    }

    if (options.cleanup) {
        try {
            console.log("cleaning up before stopping");
            // module.exports.bot.user.setGame("Shutting down")
            console.log(JSON.stringify(promises));

            Q.allSettled(promises)
                .then((snapshots) => {
                    console.log("Closing connection pool");
                    pool.end();
                });
        } finally {
            console.log("All done, shutting down");
            bot.destroy();
        }
    }

    if (options.exit) {
        console.log("starting shutdown procedure");
        process.exit();
    }
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, {cleanup: true}));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {exit: true}));

//catches a Heroku dyno shutdown event
process.on("SIGTERM", exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {exit: true, crash: true}));


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
