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
const Clapp = require("../modules/clapp-discord");
// const Clapp = require("./../modules/clapp-discord/index.js");
const cfg = require("../../config.js");
const pkg = require("../../package.json");
const Discord = require("discord.js");
let chalk = require("chalk");
let functions = require("./../global/functions.js");
let rabbit = require('rabbot');

let rabbitSettings = require("../rabbitconfig.js");

const bot = new Discord.Client();

module.exports.bot = bot;

let app = new Clapp.App({
    name: cfg.name,
    desc: pkg.description,
    prefix: cfg.prefix,
    version: pkg.version,
    onReply: (message, context) => {
    }
});

rabbit.configure(rabbitSettings).done(function () {
    console.log("Connected to message queue");
    console.log("Setting up Discord connection");

    bot.on("message", handleDiscordMessage);

    console.log("Loading commands");
    fs.readdirSync("./lib/listener/commands/").forEach((file) => {
        app.addCommand(require("./commands/" + file));
    });

    console.log("Loading events");
    fs.readdirSync("./lib/listener/events/").forEach((file) => {
        require("./events/" + file);
    });

    if (process.env.TOKEN) {
        bot.login(process.env.TOKEN).then(() => {
            console.log("Logged in to Discord");
        });
    } else {
        bot.login(cfg.token).then(() => {
            console.log("Logged in to Discord");
        });
    }
});

function replyToMessage(msg, reply) {
    // Fired when input is needed to be shown to the user.

    reply = "\n" + reply;

    msg.reply(reply)
        .then((botResponse) => {
            if (cfg.deleteAfterReply.enabled) {
                msg.delete(cfg.deletePromptAfterReply.time)
                    .then((msg) => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
                botResponse.delete(cfg.deleteReplyAfterReply.time)
                    .then((msg) => console.log(`Deleted message from ${msg.author}`))
                    .catch(console.log);
            } else {
                // User doesn't want us to specifically remove all bot messages
                // Only remove messages that are explicitly marked for removal
                let commandName = functions.getCommand(msg.content, app);
                let command = app.commands[commandName];

                if (command.removePrompt) {
                    msg.delete(cfg.deletePromptAfterReply.time)
                        .then((msg) => console.log(`Deleted message from ${msg.author}`))
                        .catch(console.log);
                }

                if (command.removeAnswer) {
                    botResponse.delete(cfg.deleteReplyAfterReply.time)
                        .then((msg) => console.log(`Deleted message from ${msg.author}`))
                        .catch(console.log);
                }
            }
        });
}

function handleDiscordMessage(msg) {
    if (app.isCliSentence(msg.content)) {
        rabbit.request(process.env.DIABOT_QUEUE_EXCHANGE,
            {
                routingKey: "message",
                type: "diabot.discord.message",
                correlationId: msg.id,
                contentType: "text/plain",
                body: msg.content,
                expiresAfter: 10000,
                timeout: 10000,
                timestamp: +new Date(),// posix timestamp (long)
                mandatory: true, //Must be set to true for onReturned to receive unqueued message
                headers: {
                    guild: msg.guild.id,
                    member: msg.member.id,
                    channel: msg.channel.id,
                    user: msg.author.id,
                    message: msg.id
                }
            })
            .then(function (final) {
                replyToMessage(msg, final.body);
            });
    }
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
            bot.user.setGame("Shutting Down")
                .catch(console.error);

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