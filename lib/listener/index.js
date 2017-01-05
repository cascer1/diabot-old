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
const Clapp   = require("../modules/clapp-discord");
// const Clapp = require("./../modules/clapp-discord/index.js");
const cfg     = require("../../config.js");
const pkg     = require("../../package.json");
const Discord = require("discord.js");
let functions = require("./../global/functions.js");
let rabbit    = require('rabbot');
let Q         = require("q");

let rabbitSettings = require("../rabbitconfig.js");

const bot = new Discord.Client();

module.exports.bot = bot;

let app = new Clapp.App({
    name   : cfg.name,
    desc   : pkg.description,
    prefix : cfg.prefix,
    version: pkg.version,
    onReply: (message, context) => {
        console.error("ERROR! listener onReply function called!");
    }
});

function replyToMessage(msg, reply) {
    // Fired when input is needed to be shown to the user.
    let command = functions.getCommand(msg.content, app);

    let holidayEmoji = functions.getHolidayEmoji();

    reply = "\n" + reply;

    if (typeof holidayEmoji !== "undefined") {
        reply = reply + "\n" + holidayEmoji;
    }

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
                if (command.removePrompt && command.removePrompt > 0) {
                    msg.delete(command.removePrompt)
                        .then((msg) => console.log(`Deleted message from ${msg.author}`))
                        .catch(console.log);
                }

                if (command.removeAnswer && command.removeAnswer > 0) {
                    botResponse.delete(command.removeAnswer)
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
                routingKey   : "message",
                type         : "diabot.discord.message",
                correlationId: msg.id,
                contentType  : "text/plain",
                body         : msg.content,
                expiresAfter : 7500,
                timeout      : 5000,
                timestamp    : +new Date(),// posix timestamp (long)
                mandatory    : true, // Return exception when unrouteable
                headers      : {
                    guild  : msg.guild.id,
                    member : msg.member.id,
                    channel: msg.channel.id,
                    user   : msg.author.id,
                    message: msg.id
                }
            })
            .then((final) => {
                replyToMessage(msg, final.body);
                final.ack();
            })
            .catch((err) => {
                console.error(err);
                if (err.message.indexOf("No reply received within the configured timeout") != -1) {
                    replyToMessage(msg, "I'm afraid my workers are swamped and can't handle your request in time. Sorry :(");
                } else {
                    replyToMessage(msg, "I'm afraid something went wrong while processing your request. Sorry :(");
                }
            });
    }
}

rabbit.configure(rabbitSettings).done(function () {
    console.log("Connected to message queue");
    console.log("Setting up Discord connection");

    bot.on("message", handleDiscordMessage);

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

rabbit.onUnhandled((message) => {
    console.log("Unhandled message caught");
    bot.channels.get(metadata.channelId).fetchMessage(metadata.messageId).then((msg) => {
        msg.reply("I'm afraid my workers are swamped and can't handle your request in time. Sorry :(")
    });
});

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

function setShutdownStatus() {
    let deferred = Q.defer();
    console.log("Setting status to 'Shutting down'");

    bot.user.setGame("Shutting down")
        .then(() => {
            console.log("Status set to 'Shutting down'");
            deferred.resolve();
        });

    return deferred;
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

function exitHandler(options, err) {
    if (err) {
        console.log(err.stack);
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
                    return setShutdownStatus();
                })
                .then(() => {
                    return disconnectRabbit();
                })
                .then(() => {
                    return disconnectBot();
                })
                .then(() => {
                    console.log("Good Bye");
                    process.exit(0);
                });
        }
        catch (err) {
            console.error(err);
        }
        finally {
            bot.destroy()
                .catch(console.error);
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
process.on("uncaughtException", exitHandler.bind(null, {exit: true, crash: true}));
