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


module.exports = {
    connection: {
        user: process.env.DIABOT_QUEUE_USER,
        pass: process.env.DIABOT_QUEUE_PASS,
        server: process.env.DIABOT_QUEUE_HOST,
        // server: "127.0.0.1, 194.66.82.11",
        // server: ["127.0.0.1", "194.66.82.11"],
        port: process.env.DIABOT_QUEUE_PORT,
        timeout: 2000,
        vhost: process.env.DIABOT_QUEUE_VHOST
    },
    exchanges: [
        {name: process.env.DIABOT_QUEUE_EXCHANGE, type: "fanout", publishTimeout: 1000, durable: false},
        // { name: "config-ex.2", type: "topic", alternate: "alternate-ex.2", persistent: true },
        // { name: "dead-letter-ex.2", type: "fanout" }
    ],
    queues: [
        {name: process.env.DIABOT_QUEUE_NAME, durable: false},
        // { name:"config-q.2", subscribe: true, deadLetter: "dead-letter-ex.2" }
    ],
    bindings: [
        {exchange: process.env.DIABOT_QUEUE_EXCHANGE, target: process.env.DIABOT_QUEUE_NAME, keys: "message"},
        // {exchange: "config-ex.2", target: "config-q.2", keys: ["test1", "test1"]}
    ],
    // logging: {
    //     adapters: {
    //         stdOut: { // adds a console logger at the "info" level
    //             level: 3,
    //             bailIfDebug: true
    //         }
    //     }
    // }
};