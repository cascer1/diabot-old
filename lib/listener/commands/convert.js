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

// Stub method for listener

module.exports = new Clapp.Command({
    name: "convert",
    desc: "Convert between mg/dL and mmol/L. If no flag is provided, I will attempt to guess the correct conversion for you.",
    removePrompt: true,
    fn: (argv, context) => {
    },
    args: [
        {
            name: "value",
            desc: "Original value",
            type: "number",
            required: true
        }
    ]
});
