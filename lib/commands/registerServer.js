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


let Clapp = require("../modules/clapp-discord");
let serverUtils = require("../mysql/serverUtils.js");

module.exports = new Clapp.Command({
    name: "registerServer",
    desc: "Register the server in the database to store settings (Admin only)",
    fn: (argv, context) => {
        let author = context.msg.author;
        let member = context.msg.member;
        let guild = context.msg.guild;
        let missingPermissions = member.missingPermissions(["ADMINISTRATOR"]);

        if(missingPermissions.length != 0) {
            return `You require additional permissions to perform this action: ${missingPermissions}`;
        } else {
            //TODO: Store server in database if it does not already exist. See #5
            let guildId = guild.id;
            let guildName = guild.name;
            let guildOwner = guild.owner;
            let guildOwnerId = guild.ownerID;

            serverUtils.register(guildId, guildName, guildOwnerId);
        }
    }
});