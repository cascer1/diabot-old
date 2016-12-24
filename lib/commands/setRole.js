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
let functions = require("../functions.js");
let config = require("../../config.js");

module.exports = new Clapp.Command({
    name: "setRole",
    desc: "Set the role assocciated with a type of diabetes",
    fn: (argv, context) => {
        let type = argv.args.type;
        let role = argv.args.role;
        if (!functions.hasAdminRole(member)) {
            return `You must have any of these roles to perform admin commands: ${JSON.stringify(config.adminRoles)}`;
        } else {
            functions.isValidType(type, context.msg.guild.id)
                .then((result) => {
                    if (result) {
                        if (result.matched) {
                            //TODO: Create role or update existing role
                        } else {
                            //TODO: Notify user that given type is invalid
                        }
                    }
                }, (error) => {
                    //TODO: log error
                });
        }

    },
    args: [
        {
            name: "type",
            desc: "Diabetes Type",
            type: "string",
            required: true
        },
        {
            name: "role",
            desc: "Role Name",
            type: "string",
            required: true
        }
    ]
});
