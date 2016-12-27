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

let index = require('../index.js');
let functions = require('../functions.js');
const bot = index.bot;

bot.on('guildMemberRemove', member => {
    if (functions.hasDebugRole(member)) {
        const guild = member.guild;

        let channelId = member.guild.defaultChannel.id;
        let nickname = (member.nickname) ? member.nickname : member.user.username;

        console.log(`Sending goodbye message to channel ${channelId}`);

        guild.channels.get(channelId).sendMessage(`Goodbye, @${nickname}`)
            .then((message) => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
    }
});