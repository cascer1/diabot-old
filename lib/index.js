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
const bot = new Discord.Client();

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
        app.parseInput(msg.content, {
            msg: msg
            // Keep adding properties to the context as you need them
        });
    }
});

module.exports.bot = bot;

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
