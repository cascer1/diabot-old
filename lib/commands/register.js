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
let userUtils = require("../mysql/userUtils.js");

module.exports = new Clapp.Command({
    name: "register",
    desc: "Register yourself as a user of the server. Should be done automatically",
    fn: (argv, context) => {
        let member = context.msg.member;

        userUtils.register(member.user.id, member.guild.id, "USER")
            .done(() => {
                context.msg.reply("You have been registered.\nPlease let us know which type of diabetes you have using the `setType` command.");
                return "You have been registered.\nPlease let us know which type of diabetes you have using the `setType` command."
            }, (error) => {
                if (error.code == "ER_DUP_ENTRY") {
                    context.msg.reply("You have already been registered");
                    return "You have already been registered";
                } else {
                    console.log(chalk.bgRed.white("Error:"));
                    console.log(error);
                    context.msg.reply("Something went wrong, please try again.");
                    return "Something went wrong, please try again.";
                }
            });
    }
});