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
let userUtils = require("../mysql/userUtils.js");

module.exports = new Clapp.Command({
    name: "registerServer",
    desc: "Register the server in the database to store settings (Admin only)",
    fn: (argv, context) => {
        let member = context.msg.member;

        if (!functions.hasAdminRole(member)) {
            return `You must have any of these roles to perform admin commands: ${JSON.stringify(config.adminRoles)}`;
        } else {
            let guildId = context.msg.guild.id;
            let guildName = context.msg.guild.name;
            let guildOwnerId = context.msg.guild.ownerID;

            userUtils.isRegistered(guildOwnerId)
                .then((result) => {
                    if (!result) {
                        return "You must first register yourself before you can register servers. Please use the `register` command.";
                    } else {
                        serverUtils.register(guildId, guildName, guildOwnerId)
                            .done(() => {
                                context.msg.reply("Your server has been registered");
                                return "Your server has been registered";
                            }, (error) => {
                                if (error.code == "ER_DUP_ENTRY") {
                                    context.msg.reply("This server is already registered");
                                    return "This server is already registered";
                                } else if (error.code == "ER_NO_REFERENCED_ROW" || error.code == "ER_NO_REFERENCED_ROW_2") {
                                    context.msg.reply("You must first register yourself before you can register servers. Please use the `register` command.");
                                    return "You must first register yourself before you can register servers. Please use the `register` command.";
                                } else {
                                    console.log(chalk.bgRed.white("Error:"));
                                    console.log(error);
                                    context.msg.reply("Something went wrong, please try again.");
                                    return "Something went wrong, please try again.";

                                }
                            });
                    }
                })
                .catch((error) => {
                    console.log(chalk.bgRed.white("Error:"));
                    console.log(error);
                    context.msg.reply("Something went wrong, please try again.")
                })
        }
    }
});