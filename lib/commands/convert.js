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
  desc: "Convert between mg/dL and mmol/L",
  fn: (argv, context) => {
    let input = argv.args.value;
    let result = 0.00;
    if(argv.flags.mgdl) {
      result = functions.convertToMmol(input);
      return `${input} mg/dL equals ${result} mmol/L`;
    } else {
      result = functions.convertToMgdl(input);
      return `${input} mmol/L equals ${result} mg/dL`;
    }
  },
  args: [
    {
      name: "value",
      desc: "Original value",
      type: "string",
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
      desc: "convert from mg/dL",
      alias: "i",
      type: "boolean",
      default: false
    }
  ]
});
