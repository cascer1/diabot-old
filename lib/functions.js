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

let config = require('../config.js');

module.exports = {
    convertToMmol: function (input) {
        return Math.round((input / 18.018) * 10) / 10;
    },
    convertToMgdl: function (input) {
        return Math.round((input * 18.018) * 10) / 10;
    },
    hasDebugRole: function (member) {
        let roles = member.roles.array();

        for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < config.developerRoles.length; j++) {
                if (roles[i].name == config.developerRoles[j]) return true;
            }
        }

        return false;
    },
    hasAdminRole: function (member) {
        let roles = member.roles.array();

        for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < config.adminRoles.length; j++) {
                if (roles[i].name == config.adminRoles[j]) return true;
            }
        }

        return false;
    },
    getNickname: function (member) {
        return (member.nickname) ? member.nickname : member.user.username;
    },
    sendMessage: function (member, message, code, verbose) {
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
    showError: function (error) {
        console.log(chalk.bgRed.white("Error:"));
        console.error(error);
    },
    isChristmas: function() {
        let date = new Date();

        let day = date.getUTCDate();
        let month = date.getUTCMonth() + 1;

        return (day >= 24 && day <= 26 && month == 12)
    }
};
