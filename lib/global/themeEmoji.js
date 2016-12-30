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

// Add some holiday spirit to the bot!


let christmasEmoji = [
    ":christmas_tree:",
    ":mrs_claus:",
    ":snowflake:",
    ":snowman:",
    ":snowman2:",
    ":star:",
    ":star2:",
    ":santa:",
    ":gift:",
    ":ribbon:"
];

let newyearsEmoji = [
    ":fireworks:",
    ":star:",
    ":star2:",
    ":balloon:",
    ":confetti_ball:",
    ":tada:"
];

let halloweenEmoji = [
    ":ghost:",
    ":new_moon:",
    ":full_moon:",
    ":wolf:",
    ":candle:"
];

let bglowEmoji = [
    ":apple:",
    ":green_apple:",
    ":pear:",
    ":banana:",
    ":watermelon:",
    ":lollipop:",
    ":kiwi:",
    ":milk:",
    ":candy:"
];

let bggoodEmoji = [
    ":+1:",
    ":ok_hand:",
    ":star:",
    ":white_check_mark:"
];

let bghighEmoji = [];

let kingsdayEmoji = [
    ":crown:",
    ":flag_nl:"
];

module.exports = [
    {
        name  : "bglow",
        emoji : bglowEmoji,
        bgLow : 0,
        bgHigh: 3.9,
        date  : false
    },
    {
        name  : "bggood",
        emoji : bggoodEmoji,
        bgLow : 5,
        bgHigh: 6,
        date  : false
    },
    {
        name  : "bghigh",
        emoji : bghighEmoji,
        bgLow : 10,
        bgHigh: 50,
        date  : false
    },
    {
        name : "christmas",
        emoji: christmasEmoji,
        start: {month: 12, day: 25},
        end  : {month: 12, day: 26},
        date : true
    },
    {
        name    : "newyears",
        emoji   : newyearsEmoji,
        start   : {month: 12, day: 30},
        end     : {month: 1, day: 1},
        nextYear: true,
        date    : true
    },
    {
        name : "halloween",
        emoji: halloweenEmoji,
        start: {month: 10, day: 30},
        end  : {month: 10, day: 31},
        date : true
    },
    {
        name : "kingsday",
        emoji: kingsdayEmoji,
        start: {month: 4, day: 26},
        end  : {month: 4, day: 27},
        date : true
    }
];