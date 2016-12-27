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
let serverUtils = require("../mysql/serverUtils.js");

module.exports = new Clapp.Command({
    name: "setType",
    desc: "Change your registered type of diabetes",
    fn: (argv, context) => {
        return new Promise((fulfill, reject) => {
            let member = context.msg.member;

            userUtils.isRegistered(member.user.id, member.guild.id)
                .done((result) => {
                        if (!result) {
                            fulfill("You must first register yourself before you can change your diabetes type. Please use the `register` command.");
                        } else {
                            serverUtils.getTypes(member.guild.id)
                                .done((result) => {
                                    let matched = false;
                                    let allowedTypes = [];
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i].name == argv.args.type) matched = true;
                                        allowedTypes.push(result[i].name);
                                    }

                                    if (matched) {
                                        userUtils.setType(member.user.id, argv.args.type, member.guild.id)
                                            .done(() => {
                                                fulfill("Thank you, your diabetes type has been registered");
                                            }, (error) => {
                                                reject(error);
                                            });
                                    } else {
                                        fulfill("The allowed types are: " + allowedTypes.join(", "));
                                    }
                                }, (error) => {
                                    reject(error);
                                });


                        }
                    }
                    ,
                    (error) => {
                        reject(error);
                    }
                );
        });
    },
    args: [
        {
            name: "type",
            desc: "Diabetes type",
            type: "string",
            required: true
        }
    ]
});