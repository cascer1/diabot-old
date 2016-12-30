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

let config   = require("../../config.js");
let chalk    = require("chalk");
let holidays = require("./themeEmoji.js");

module.exports = {
    convertToMmol  : (input) => {
        return Math.round((input / 18.018) * 10) / 10;
    },
    convertToMgdl  : (input) => {
        return Math.round((input * 18.018) * 10) / 10;
    },
    hasDebugRole   : (member) => {
        let roles = member.roles.array();

        for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < config.developerRoles.length; j++) {
                if (roles[i].name === config.developerRoles[j]) {
                    return true;
                }
            }
        }

        return false;
    },
    hasAdminRole   : (member) => {
        let roles = member.roles.array();

        for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < config.adminRoles.length; j++) {
                if (roles[i].name === config.adminRoles[j]) {
                    return true;
                }
            }
        }

        return false;
    },
    getNickname    : (member) => {
        return (member.nickname) ? member.nickname : member.user.username;
    },
    sendMessage    : (member, message, code, verbose) => {
        if (code) {
            message = message.substr(0, 1995) + "\n```";
        } else {
            message = message.substr(0, 2000);
        }

        if (!verbose) {
            member.sendMessage(message)
                .catch(console.error);
        } else {
            member.sendMessage(message)
                .then(console.log(`Delivered message to ${module.exports.getNickname(member)}`))
                .catch(console.error);
        }
    },
    showError      : (error) => {
        console.log(chalk.bgRed.white("Error:"));
        console.error(error);
    },
    getHolidayEmoji: () => {
        let today = new Date();

        let year = today.getUTCFullYear();

        for (let i = 0; i < holidays.length; i++) {
            let holiday = holidays[i];
            if (!holiday.date) continue;
            let startDay = new Date(year, holiday.start.month - 1, holiday.start.day);

            if (holiday.nextYear) year++;
            let endDay = new Date(year, holiday.end.month - 1, holiday.end.day);

            if (today >= startDay && today <= endDay) {
                return holiday.emoji[Math.floor(Math.random() * holiday.emoji.length)];
            }
        }
    },
    getBgEmoji     : (bg) => {
        for (let i = 0; i < holidays.length; i++) {
            let holiday = holidays[i];

            if (typeof holiday.bgLow === "undefined" || typeof holiday.bgHigh == "undefined") continue;

            if (bg >= holiday.bgLow && bg <= holiday.bgHigh) {
                return holiday.emoji[Math.floor(Math.random() * holiday.emoji.length)];
            }
        }
    },
    getCommand     : (sentence, app) => {
        if (app.isCliSentence(sentence)) {
            let commands      = require("./commands");
            let commandStart  = app.prefix.length + app.separator.length;
            let commandEnd    = sentence.indexOf(" ", commandStart);
            let commandLength = sentence.length;

            if (commandEnd !== -1) {
                commandLength = commandEnd - commandStart;
            }

            let command = sentence.substring(commandStart, commandStart + commandLength);

            console.log("Getting removal info for " + command);

            for (let i = 0; i < commands.length; i++) {
                if (commands[i].name === command) {
                    return commands[i];
                }
            }

            return null;
        }
        return false;
    }
};
