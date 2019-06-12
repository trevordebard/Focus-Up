const HostsUtils = require('./hosts-utils');

async function block(sites, ipcMain) {
  if (sites && sites.length) {
    try {
      let isWritable = await HostsUtils.canWrite('/etc/hosts');
      if (!isWritable) {
        isWritable = await HostsUtils.requestPermissionToWrite();
      }
      if (isWritable) {
        HostsUtils.addSitesToHostsFile(sites);
        await HostsUtils.restartWifi();
        ipcMain.emit('blockComplete');
      }
    } catch (error) {
      console.log('There was an error');
      console.log(error);
      ipcMain.emit('permissionDenied', error);
    }
  } else {
    ipcMain.emit('sitesEmpty');
  }
}
exports.block = block;
