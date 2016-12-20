let Clapp = require("../modules/clapp-discord");

module.exports = new Clapp.Command({
  name: "version",
  desc: "Get bot version",
  fn: (argv, context) => {
    // This output will be redirected to your app"s onReply function
    return "Hi! My name is Diabot version 0.1";
  }
});
