const HostsUtils = require('./hosts-utils');

function unblock() {
  HostsUtils.restoreHostsFile();
}
exports.unblock = unblock;
