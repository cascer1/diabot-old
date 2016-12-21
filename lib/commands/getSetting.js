/*
 *  diabot
 *  Copyright (C) 2016  Cas Eliëns
 *
 *      This program is free software: you can redistribute it and/or modify
 *      it under the terms of the GNU General Public License as published by
 *      the Free Software Foundation, either version 3 of the License, or
 *      (at your option) any later version.
 *
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU General Public License for more details.
 *
 *      You should have received a copy of the GNU General Public License
 *      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

let Clapp = require("../modules/clapp-discord");
let serverUtils = require("../mysql/serverUtils.js");

module.exports = new Clapp.Command({
    name: "getServerSetting",
    desc: "Get a specific server setting",
    fn: (argv, context) => {
        let member = context.msg.member;
        let missingPermissions = member.missingPermissions(["ADMINISTRATOR"]);

        if(missingPermissions.length != 0) {
            return `You require additional permissions to perform this action: ${missingPermissions}`;
        } else {
            let guildId = context.msg.guild.id;
            let setting = argv.args.setting;
            //TODO: check if server isn't registered yet.

            let result = serverUtils.getSetting(guildId, setting);

            return `The value of ${setting} is ${result}`;
        }
    },
    args: [
        {
            name: "setting",
            desc: "Setting name",
            type: "string",
            required: true
        }
    ]
});