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
const Clapp = require("./../modules/clapp-discord");
const pkg = require("../../package.json");

rabbit.configure(settings).done(function () {
    console.log("Connected to message queue");
    console.log("Setting up Discord connection");

    bot.on("message", handleDiscordMessage);

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

function handleDiscordMessage(msg) {
    rabbit.request("local",
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
                member: msg.member.id
            }
        })
        .progress(function (reply) {
            console.log("reply: " + JSON.stringify(reply));
        })
        .then(function (final) {
            msg.reply(final.body);
        });
}