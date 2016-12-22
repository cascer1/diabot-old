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

'use strict';

const fs = require('fs');
const Clapp = require('./modules/clapp-discord');
const cfg = require('../config.js');
const pkg = require('../package.json');
const Discord = require('discord.js');
let mysql = require('mysql');
module.exports.Q = require("q"); // v2.11.1
let chalk = require("chalk");

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


module.exports.bot = bot;
module.exports.pool = pool;
module.exports.promises = [];

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
        // Fired when input is needed to be shown to the user.

        context.msg.reply('\n' + msg).then(bot_response => {
            if (cfg.deleteAfterReply.enabled) {
                context.msg.delete(cfg.deleteAfterReply.time)
                    .then(msg => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
                bot_response.delete(cfg.deleteAfterReply.time)
                    .then(msg => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
            }
        });
    }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
    app.addCommand(require("./commands/" + file));
});

bot.on('message', msg => {
    // Fired when someone sends a message

    if (app.isCliSentence(msg.content)) {
        /*
         TODO: Check if bot has permission to send messages
         let canSpeak = msg.guild.member(bot.user).hasPermission("SEND_MESSAGES");

         if(!canSpeak) {
         // msg.author.sendMessage("I cannot respond to your query because I do not have the SEND_MESSAGES permission");
         msg.member.sendMessage("I cannot respond to your query because I do not have the SEND_MESSAGES permission");
         }
         */

        app.parseInput(msg.content, {
            msg: msg
            // Keep adding properties to the context as you need them
        });
    }
});

fs.readdirSync('./lib/events/').forEach(file => {
    require("./events/" + file);
});

if (process.env.TOKEN) {
    bot.login(process.env.TOKEN).then(() => {
        console.log('Running with environment variable token!');
    });
} else {
    bot.login(cfg.token).then(() => {
        console.log('Running with config file token!');
    });
}


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (err) console.log(err.stack);

    if (options.cleanup) {
        try {
            console.log('cleaning up before stopping');
            // module.exports.bot.user.setGame("Shutting down")
            console.log(JSON.stringify(module.exports.promises));

            module.exports.Q.allSettled(module.exports.promises)
                .then((snapshots) => {
                    console.log("Closing connection pool");
                    module.exports.pool.end()
                });

            // module.exports.bot.user.setGame("Shutting down")
            //     .then((cientUser) => {
            //         console.log(JSON.stringify(module.exports.promises));
            //
            //         Q.allSettled(module.exports.promises)
            //             .then((snapshots) => {
            //                 console.log("Closing connection pool");
            //                 module.exports.pool.end()
            //             });
            //     }).catch((error) => {
            //         console.error("ERROR while shutting down: " + error);
            //     }
            // );

        } finally {
            module.exports.bot.destroy();
        }
    }

    if (options.exit) {
        console.log('starting shutdown procedure');
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));


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
