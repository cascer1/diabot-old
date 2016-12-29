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

let rabbit = require('rabbot');

let settings = require("../rabbitconfig.js");

const Discord = require("discord.js");
const bot = new Discord.Client();
const cfg = require("../../config.js");

rabbit.configure(settings).done(function () {
    console.log("Connected to message queue");
    console.log("Connecting to Discord");

    let handler = rabbit.handle("diabot.discord.message", (message) => {
        console.log("Received a message at " + +new Date());
        console.log(JSON.stringify(message));
        console.log("ID: " + message.properties.headers.CorrelationId);
        console.log("Member: " + message.properties.headers.member);
        console.log("Guild: " + message.properties.headers.guild);
        message.reply("Gotcha!");
        console.log();
        console.log();
        message.reply("Got it!");
    });

    bot.login(process.env.TOKEN)
        .then(() => {
            console.log("Logged in to Discord");
            console.log("Subscribing to messages queue");
            rabbit.startSubscription("local.messages");
        });
});


// rabbit.handle({
//     queue: "local.messages", // only handle messages from the queue with this name
//     type: "#", // handle messages with this type name or pattern
//     autoNack: true, // automatically handle exceptions thrown in this handler
//     context: null // control what `this` is when invoking the handler
// }, (message) => {
//     console.log(message);
//     message.ack();
// });
