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

let functions = require("../functions.js");
let config = require("../../config.js");
let Clapp = require("../modules/clapp-discord");
let serverUtils = require("../mysql/serverUtils.js");

module.exports = new Clapp.Command({
    name: "removeServer",
    desc: "Remove the registered server from the database (Admin only)",
    fn: (argv, context) => {
        let member = context.msg.member;

        if (!functions.hasAdminRole(member)) {
            return `You must have any of these roles to perform admin commands: ${JSON.stringify(config.adminRoles)}`;
        } else {
            let guildId = context.msg.guild.id;
            let guildOwnerId = context.msg.guild.ownerID;

            //TODO: check if server isn't registered yet.

            serverUtils.remove(guildId, guildOwnerId)
                .done(() => {
                    context.msg.reply("Your server has been removed from the database");
                    return "Your server has been removed from the database";
                }, (error) => {
                    console.error(JSON.stringify(error, 2, ' '));
                    context.msg.reply("Something went wrong, please try again.");
                    return "Something went wrong, please try again.";
                })
        }
    }
});