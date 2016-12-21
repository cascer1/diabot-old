let Clapp = require("../modules/clapp-discord");

module.exports = new Clapp.Command({
  name: "credits",
  desc: "Get information about contributors to this bot",
  fn: (argv, context) => {
    // This output will be redirected to your app"s onReply function
    return "This bot was created by cascer1. \n" +
      "Faythe made the avatar!";
  }
});
