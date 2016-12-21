/**
 * Created by cas.eliens on 20-12-2016.
 */

module.exports = {
  convertToMmol: function(input) {
    return Math.round((input / 18.018) * 10) / 10;
  },
  convertToMgdl: function(input) {
    return Math.round((input * 18.018) * 10) /10;
  }
}
