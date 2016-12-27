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

    // Help
    help_usage: 'Usage: ',
    help_command: '(command)',
    help_cmd_list: 'Here\'s a list of commands:',
    help_further_help: 'To get further help on a command, type: ',
    help_av_args: 'Available arguments',
    help_av_options: 'Available options',
    help_args_required_optional: 'Arguments in (parenthesis) are required, arguments in [brackets]'
    + ' are optional',


    // Errors
    err: "Error: ",

    err_internal_error: "Something went wrong while executing the command `%CMD%`. Please try again later.",
    err_unknown_command: "unknown command `%CMD%`.",
    err_unfulfilled_args: "not every required argument was fulfilled. Missing arguments:",
    err_type_mismatch: "your command couldn't be executed for the following reasons:",
    err_type_help: "Type `%PREFIX% --help` for help."


};
