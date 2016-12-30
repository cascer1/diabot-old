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
let chalk     = require("chalk");
let functions = require("../functions.js");

module.exports = {
    db          : require("./../../worker/index.js").db,
    Q           : require("./../../worker/index.js").Q,
    register    : (id, serverId, role) => {
        // https://github.com/mysqljs/mysql
        let user = {id: id, type: "NONE", serverId: serverId, role: role};

        console.log(`registering User: ${JSON.stringify(user, 2)}`);

        return module.exports.db.query("INSERT INTO users SET ?", user);

    },
    remove      : (id, serverId) => {
        // https://github.com/mysqljs/mysql
        let user = {id: id, serverId: serverId};

        console.log(`removing user: ${JSON.stringify(user, 2)}`);

        return module.exports.db.query("DELETE FROM users WHERE ?", user);

    },
    isRegistered: (id, serverId) => {
        let user = {id: id, serverId: serverId};

        return module.exports.db.query(`SELECT COUNT( * ) AS userCount FROM users WHERE id=? AND serverId=?`, [user.id, user.serverId])
            .then((results) => {
                return (results[0][0].userCount === 1);
            }, (error) => {
                functions.showError(error);
                return ( module.exports.Q.reject(error) );
            });
    },
    setType     : (id, type, serverId) => {
        let user = {id: id, type: type, serverId: serverId};

        console.log(`Updating user: ${JSON.stringify(user, 2, "")}`);

        return module.exports.db.query(`UPDATE users SET type=? WHERE id=? AND serverId=?`, [type, id, serverId]);
    },
    setOwner    : (id, serverId) => {
        return module.exports.db.query(`UPDATE users SET role='OWNER' WHERE id = ? AND serverId = ?`, [id, serverId]);
    }
};