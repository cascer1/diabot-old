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
let Clapp = require("./../../modules/clapp-discord");

module.exports = new Clapp.Command({
    name: "credits",
    desc: "Get information about contributors to this bot",
    fn  : (argv, context) => {
        // This output will be redirected to your app"s onReply function
        return "This bot was created by cascer1. \n" +
            "Faythe made the avatar!";
    }
});
