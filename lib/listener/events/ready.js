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
let listener = require("../index.js");
const bot    = listener.bot;

bot.on("ready", function () {
    let pjson = require("./../../../package.json");

    bot.user.setGame("Starting up")
       .then(
           setTimeout(() => {
               bot.user.setGame("version " + pjson.version)
                  .then(console.log("Running version " + pjson.version))
           }, 5000)
       )
       .catch(console.error);
});