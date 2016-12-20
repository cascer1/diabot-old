let Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
  name: "convert",
  desc: "Convert between mg/dL and mmol/L",
  fn: (argv, context) => {
    let input = argv.args.value;
    let result = 0.00;
    if(argv.flags.mgdl) {
      result = Math.round((input / 18.018) * 10) / 10;
      return `${input} mg/dL equals ${result} mmol/L`;
    } else {
      result = Math.round((input * 18.018) * 10) / 10;
      return `${input} mmol/L equals ${result} mg/dL`;
    }
  },
  args: [
    {
      name: 'value',
      desc: 'Original value',
      type: 'string',
      required: true
    }
  ],
  flags: [
    {
      name: 'mmol',
      desc: 'Convert from mmol/L',
      alias: 'm',
      type: 'boolean',
      default: false
    },
    {
      name: 'mgdl',
      desc: 'convert from mg/dL',
      alias: 'i',
      type: 'boolean',
      default: false
    }
  ]
});
