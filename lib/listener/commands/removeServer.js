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
let config = require("../../../config.js");
let Clapp = require("./../../modules/clapp-discord");
let serverUtils = require("./../mysql/serverUtils.js");
let userUtils = require("./../mysql/userUtils.js");

module.exports = new Clapp.Command({
    name: "removeServer",
    desc: "Remove the registered server from the database",
    admin: true,
    fn: (argv, context) => {
        return new Promise((fulfill, reject) => {
            let member = context.msg.member;

            if (!functions.hasAdminRole(member)) {
                fulfill(`You must have any of these roles to perform admin commands: ${config.adminRoles.join(",")}`);
            } else {
                let guildId = context.msg.guild.id;
                let guildOwnerId = context.msg.guild.ownerID;

                //TODO: check if server isn't registered yet.

                serverUtils.remove(guildId, guildOwnerId)
                    .done(() => {
                        fulfill("Your server has been removed from the database");
                    }, (error) => {
                        reject(error);
                    });
            }
        });
    }
});