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
let Clapp     = require("./../../modules/clapp-discord");
let functions = require("../../global/functions.js");

module.exports = new Clapp.Command({
    name    : "setStatus",
    desc    : "Set the bot status to the current version",
    isHidden: true,
    fn      : (argv, context) => {
        if(context.msg.author.id !== "189436077793083392") return "I'm sorry " + functions.getNickname(context.msg.member) + ", I'm afraid I can't do that.";

        let pjson = require("./../../../package.json");

        let status = (argv.args.status === "version") ? "version " + pjson.version : argv.args.status;

        context.bot.user.setGame(status)
               .then(() => {
                   return "All done"
               })
               .catch(console.error);
    },
    args    : [
        {
            name    : "status",
            desc    : "New status, version if empty",
            type    : "string",
            default : "version",
            required: false
        }
    ]
});
