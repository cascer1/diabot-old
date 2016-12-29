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
let functions = require("../functions.js");
let listener = require("../../listener/index.js");
const bot = listener.bot;

bot.on("guildMemberUpdate", (oldMember, newMember) => {
    if (functions.hasDebugRole(newMember)) {
        let messagePart1 = "Your details have been updated!\n" +
            "**Old details:**\n" +
            "```" +
            JSON.stringify(oldMember, 2, " ");

        let messagePart2 = "**New Details:**\n" +
            "```" +
            JSON.stringify(newMember, 2, " ");

        // Do some truncating and closing of the code block
        // Because max message length in discord is 2000 chars.
        functions.sendMessage(newMember, messagePart1, true, true);
        functions.sendMessage(newMember, messagePart2, true, true);
    }
});



