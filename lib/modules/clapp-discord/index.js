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

const Clapp = require("clapp")
    , Table = require("cli-table2")
    , str = require("./str-en.js");

class App extends Clapp.App {
    constructor(options) {
        super(options);
    }

    _getHelp() {
        const LINE_WIDTH = 175;

        let r =
            this.name + (typeof this.version !== "undefined" ? " v" + this.version : "") + "\n" +
            this.desc + "\n\n" +

            str.help_usage + this.prefix + this.separator + str.help_command + "\n\n" +

            str.help_cmd_list + "\n\n";

        // Command list
        let table = new Table({
            chars: {
                "top": "", "top-mid": "", "top-left": "", "top-right": "", "bottom": "",
                "bottom-mid": "", "bottom-left": "", "bottom-right": "", "left": "",
                "left-mid": "", "mid": "", "mid-mid": "", "right": "", "right-mid": "",
                "middle": ""
            },
            colWidths: [
                Math.round(0.15 * LINE_WIDTH), // We round it because providing a decimal number would
                Math.round(0.65 * LINE_WIDTH)  // break cli-table2
            ],
            wordWrap: true
        });

        for (let i in this.commands) {
            // Add (Admin Only) suffix to command description of applicable
            let description = this.commands[i].desc;
            if (this.commands[i].admin === true) description += " (Admin Only)";

            table.push([i, description]);
        }

        r +=
            "```" + table.toString() + "```\n\n" +
            str.help_further_help + this.prefix + " " + str.help_command + " --help";

        return r;
    }
}

class Command extends Clapp.Command {
    constructor(options) {
        super(options);

        this.admin = options.admin || false;
        this.removePrompt = options.removePrompt || false;
        this.removeAnswer = options.removeAnswer || false;
    }

    _getHelp(app) {
        const LINE_WIDTH = 175;

        let r = str.help_usage + ' ' + app.prefix + ' ' + this.name;

        let args_table = void 0;
        let flags_table = void 0;

        // Add every argument to the usage (Only if there are arguments)
        if (Object.keys(this.args).length > 0) {
            args_table = new Table({
                chars: {
                    'top': '', 'top-mid': '', 'top-left': '', 'top-right': '', 'bottom': '',
                    'bottom-mid': '', 'bottom-left': '', 'bottom-right': '', 'left': '',
                    'left-mid': '', 'mid': '', 'mid-mid': '', 'right': '', 'right-mid': '',
                    'middle': ''
                },
                head: ['Argument', 'Description', 'Default'],
                style: {
                    border: [],
                    header: []
                },
                colWidths: [
                    Math.round(0.10 * LINE_WIDTH),
                    Math.round(0.45 * LINE_WIDTH),
                    Math.round(0.25 * LINE_WIDTH)
                ],
                wordWrap: true
            });
            for (let i in this.args) {
                r += this.args[i].required ? ' (' + i + ')' : ' [' + i + ']';
                args_table.push([
                    i,
                    typeof this.args[i].desc !== 'undefined' ?
                        this.args[i].desc : '',
                    typeof this.args[i].default !== 'undefined' ?
                        this.args[i].default : ''
                ]);
            }

            r += '\n\n' + str.help_av_args + ':\n\n```' + args_table.toString() + '```';
        }

        r += '\n' + this.desc;

        if (this.admin == true) r += '\n **Admin Only**';

        // Add every flag, only if there are flags to add
        if (Object.keys(this.flags).length > 0) {
            flags_table = new Table({
                chars: {
                    'top': '', 'top-mid': '', 'top-left': '', 'top-right': '', 'bottom': '',
                    'bottom-mid': '', 'bottom-left': '', 'bottom-right': '', 'left': '',
                    'left-mid': '', 'mid': '', 'mid-mid': '', 'right': '', 'right-mid': '',
                    'middle': ''
                },
                head: ['Option', 'Description', 'Default'],
                style: {
                    border: [],
                    header: []
                },
                colWidths: [
                    Math.round(0.10 * LINE_WIDTH),
                    Math.round(0.45 * LINE_WIDTH),
                    Math.round(0.25 * LINE_WIDTH)
                ],
                wordWrap: true
            });
            for (let i in this.flags) {
                flags_table.push([
                    (typeof this.flags[i].alias !== 'undefined' ?
                        '-' + this.flags[i].alias + ', ' : '') + '--' + i,
                    typeof this.flags[i].desc !== 'undefined' ?
                        this.flags[i].desc : '',
                    typeof this.flags[i].default !== 'undefined' ?
                        this.flags[i].default : ''
                ]);
            }

            r += '\n\n' + str.help_av_options + ':\n\n```' + flags_table.toString() + '```';
        }

        if (Object.keys(this.args).length > 0)
            r += '\n\n' + str.help_args_required_optional;

        return r;
    }
}

module.exports = {
    App: App,
    Argument: Clapp.Argument,
    Command: Command,
    Flag: Clapp.Flag
};
