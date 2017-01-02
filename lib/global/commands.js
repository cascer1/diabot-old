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

// Command definitions used by listener to determine auto-deletion of prompts and answers

module.exports = [
    {name: "--version", removePrompt: 1, removeAnswer: 2500},
    {name: "--help", removePrompt: 1, removeAnswer: 0},
    {name: "convert", removePrompt: 1, removeAnswer: 0},
    {name: "credits", removePrompt: 500, removeAnswer: 0},
    {name: "convert", removePrompt: 1, removeAnswer: 0},
    {name: "debug", removePrompt: 1, removeAnswer: 0},
    {name: "getServerSetting", removePrompt: 500, removeAnswer: 2500},
    {name: "register", removePrompt: 500, removeAnswer: 5000},
    {name: "registerServer", removePrompt: 500, removeAnswer: 5000},
    {name: "removeServer", removePrompt: 500, removeAnswer: 5000},
    {name: "setType", removePrompt: 500, removeAnswer: 2500},
    {name: "setStatus", removePrompt: 1, removeAnswer: 5000, hidden: true}
];

