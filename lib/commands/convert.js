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

module.exports = new Clapp.Command({
    name: "convert",
    desc: "Convert between mg/dL and mmol/L. If no flag is provided, I will attempt to guess the correct conversion for you.",
    removePrompt: true,
    fn: (argv, context) => {
        let input = argv.args.value;
        let result = 0.00;
        if (argv.flags.mgdl) {
            result = functions.convertToMmol(input);
            return `${input} mg/dL equals ${result} mmol/L`;
        } else if (argv.flags.mmol) {
            result = functions.convertToMgdl(input);
            return `${input} mmol/L equals ${result} mg/dL`;
        } else {
            if (input < 25) {
                // assume input is mmol/L
                result = functions.convertToMgdl(input);
                return `${input} mmol/L equals ${result} mg/dL`;
            } else if (input >= 25 && input < 50) {
                // convert both to be safe
                let resultmgdl = functions.convertToMgdl(input);
                let resultmmol = functions.convertToMmol(input);

                return `*I'm not sure if you entered mmol/L or mg/dL, so I'll show you both.*\n${input} mg/dL equals **${resultmmol} mmol/L** \n${input} mmol/L equals **${resultmgdl} mg/dL**`;

            } else {
                // assume input is mg/dL
                result = functions.convertToMmol(input);
                return `${input} mg/dL equals ${result} mmol/L`;
            }
        }
    },
    args: [
        {
            name: "value",
            desc: "Original value",
            type: "number",
            required: true
        }
    ],
    flags: [
        {
            name: "mmol",
            desc: "Convert from mmol/L",
            alias: "m",
            type: "boolean",
            default: false
        },
        {
            name: "mgdl",
            desc: "Convert from mg/dL",
            alias: "i",
            type: "boolean",
            default: false
        }
    ]
});
