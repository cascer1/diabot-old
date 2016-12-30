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
let chalk = require("chalk");
let functions = require("../functions.js");

module.exports = {
    db: require("./../../worker/index.js").db,
    Q: require("./../../worker/index.js").Q,
    register: function (id, name) {
        // https://github.com/mysqljs/mysql
        let server = {id: id, name: name};
        let partMessage = {serverId: id, setting: "partMessage", value: false};
        let welcomeMessage = {serverId: id, setting: "welcomeMessage", value: false};

        let defaultTypes = [
            {serverId: id, name: "T1D"},
            {serverId: id, name: "T2D"},
            {serverId: id, name: "LADA"},
            {serverId: id, name: "NONE"}
        ];

        console.log(`registering server: ${JSON.stringify(server, 2)}`);

        let promise = module.exports.db.query("INSERT INTO servers SET ?", server)
            .then(module.exports.db.query("INSERT INTO settings SET ?", welcomeMessage))
            .then(module.exports.db.query("INSERT INTO settings SET ?", partMessage))
            .then(() => {
                for (let i = 0; i < defaultTypes.length; i++) {
                    promise.then(module.exports.db.query("INSERT INTO types SET ?", defaultTypes[i]));
                }
            });



        promise.catch((error) => {
            functions.showError(error);
            return ( module.exports.Q.reject(error) );
        });

        return (promise);

    },
    remove: function (id, ownerID) {
        // https://github.com/mysqljs/mysql
        let server = {id: id, ownerId: ownerID};

        console.log(`removing server: ${JSON.stringify(server, 2)}`);

        return module.exports.db.query("DELETE FROM servers WHERE `id`=?", id);

    },
    getSetting: function (id, setting) {
        // https://github.com/mysqljs/mysql
        let server = {serverId: id, setting: setting};

        return module.exports.db.query("SELECT value FROM settings WHERE serverId = ? AND setting = ?", [server.serverId, server.setting])
            .then((results) => {
                if (results[0][0].value === undefined) return "ERROR: This setting does not exist.";
                else return results[0][0].value;
            }, (error) => {
                functions.showError(error);
                return ( module.exports.Q.reject(error) );
            });
    },
    getServer: function (id) {
        //TODO: reformat for connection pool
        console.log(`getting server ${id}`);
        let returned = {};
        connection.connect();

        connection.query("SELECT COUNT(id) AS count FROM servers WHERE id = ?", id, function (err, rows, fields) {
            if (err) throw err;

            returned = rows[0];
        });

        connection.end();
        return returned;
    },
    getTypes: function (id) {
        return module.exports.db.query(`SELECT name FROM types WHERE serverId = ?`, id)
            .then((results) => {
                return results[0];
            }, (error) => {
                functions.showError(error);
                return ( module.exports.Q.reject(error) );
            });
    }
};