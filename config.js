module.exports = {

    // Your bot name. Typically, this is your bot's username without the discriminator.
    // i.e: if your bot's username is MemeBot#0420, then this option would be MemeBot.
    name: "Diabot",

    // The bot's command prefix. The bot will recognize as command any message that begins with it.
    // i.e: "-diabot foo" will trigger the command "foo",
    //      whereas "Diabot foo" will do nothing at all.
    prefix: "-diabot",

    // Your bot's user token. If you don't know what that is, go here:
    // https://discordapp.com/developers/applications/me
    // Then create a new application and grab your token.
    token: "",

    // Users with this role will be able to perform some extra debug commands
    developerRoles: ["diabotDebug"],

    // Users with this role will be able to perform some administrative commands
    adminRoles: ["diabotAdmin"],

    // If this option is enabled, the bot will delete the message that triggered it, and its own
    // response, after the specified amount of time has passed.
    // Enable this if you don't want your channel to be flooded with bot messages.
    // ATTENTION! In order for this to work, you need to give your bot the following permission:
    // MANAGE_MESSAGES - 	0x00002000
    // More info: https://discordapp.com/developers/docs/topics/permissions
    deleteAfterReply: {
        enabled: false,
        time: 1000, // In milliseconds
    },

    // Same as deleteAfterReply, but only applies to messages sent by the bot
    // Leaves messages sent to the bot in place
    deleteReplyAfterReply: {
        enabled: false,
        time: 2500
    },

    // Same as deleteAfterReply, but only applies to messages sent to the bot
    // Leaves messages sent by the bot in place
    deletePromptAfterReply: {
        enabled: false,
        time: 2500
    }
};
