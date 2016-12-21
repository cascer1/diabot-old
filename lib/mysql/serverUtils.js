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

        let query = connection.query('INSERT INTO servers SET ?', server, function(err, result) {
            returned = {err: err, result: result};
        });

        connection.end();
        return returned;
    },
};