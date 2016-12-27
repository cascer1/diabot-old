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
let chalk = require('chalk');

module.exports = new Clapp.Command({
    name: "registerServer",
    desc: "Register the server in the database to store settings (Admin only)",
    fn: (argv, context) => {
        return new Promise((fulfill, reject) => {
            let member = context.msg.member;

            if (!functions.hasAdminRole(member)) {
                fulfill(`You must have any of these roles to perform admin commands: ${JSON.stringify(config.adminRoles)}`);
            } else {
                let guildId = context.msg.guild.id;
                let guildName = context.msg.guild.name;

                serverUtils.register(guildId, guildName)
                    .done(() => {
                        context.msg.reply("Your server has been registered");
                        context.msg.reply("Registering you as server owner");

                        userUtils.isRegistered(member.user.id, member.guild.id)
                            .then((result) => {
                                if (!result) {
                                    userUtils.register(member.user.id, member.guild.id, "OWNER")
                                        .done(() => {
                                            context.msg.reply("You have been registered.\nPlease let us know which type of diabetes you have using the `setType` command.");
                                            fulfill("You have been registered.\nPlease let us know which type of diabetes you have using the `setType` command.");
                                        }, (error) => {
                                            if (error.code == "ER_DUP_ENTRY") {
                                                fulfill("You have already been registered");
                                            } else {

                                                console.log(chalk.bgRed.white("Error:"));
                                                console.log(error);
                                                fulfill("Something went wrong, please try again.");
                                            }
                                        });
                                } else {
                                    userUtils.setOwner(member.user.id, member.guild.id)
                                        .done(() => {
                                            context.msg.reply("You have been added as the server owner.");
                                        }, (error) => {
                                            console.log(chalk.bgRed.white("Error:"));
                                            console.log(error);
                                            context.msg.reply("Something went wrong, please try again.");
                                        });

                                }
                            })
                            .catch((error) => {
                                console.log(chalk.bgRed.white("Error:"));
                                console.log(error);
                                context.msg.reply("Something went wrong, please try again.")
                            });

                        return "Your server has been registered";
                    }, (error) => {
                        if (error.code == "ER_DUP_ENTRY") {
                            context.msg.reply("This server is already registered");
                            fulfill("This server is already registered");
                        } else {
                            console.log(chalk.bgRed.white("Error:"));
                            console.log(error);
                            context.msg.reply("Something went wrong, please try again.");
                            fulfill("Something went wrong, please try again.");

                        }
                    });


            }
        });
    }
});