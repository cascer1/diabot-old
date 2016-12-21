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

let mysql = require('mysql');
let connection = mysql.createConnection(process.env.JAWSDB_URL);


module.exports = {
    register: function(id, name, ownerID) {
        // https://github.com/mysqljs/mysql
        let returned = {};
        connection.connect();

        let server = {id: id, name: name, ownerId: ownerID};
        let partMessage = {serverId: id, setting: 'partMessage', value: false};
        let welcomeMessage = {serverId: id, setting: 'welcomeMessage', value: false};

        console.log(`registering server: ${JSON.stringify(server, 2)}`);

        connection.query('INSERT INTO servers SET ?', server, function(err, result) {
            returned = {err: err, result: result};
        });

        connection.query('INSERT INTO settings SET ?', partMessage, function(err, result) {
            if(err) throw err;
        });

        connection.query('INSERT INTO settings SET ?', welcomeMessage, function(err, result) {
            if(err) throw err;
        });

        connection.end();
        return returned;
    },
    getSetting: function(id, setting) {
        let value = '';
        connection.connect();

        connection.query('SELECT value FROM settings WHERE serverId = ? AND setting = ?', id, setting, function(err, rows, fields) {
            if (err) throw err;

            value = rows[0].value;
        });

        connection.end();

        return value;
    },
    getServer: function(id) {
        console.log(`getting server ${id}`);
        let returned = {};
        connection.connect();

        connection.query('SELECT COUNT(id) AS count FROM servers WHERE id = ?', id, function(err, rows, fields) {
            if (err) throw err;

            returned = rows[0];
        });

        connection.end();
        return returned;
    }
};