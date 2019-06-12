const sudo = require('sudo-prompt');
const fs = require('fs');
const WiFiControl = require('wifi-control');

const canWrite = path => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.W_OK, err => {
      resolve(!err);
    });
  });
};

const requestPermissionToWrite = () => {
  const options = {
    name: 'Focus Up',
  };
  return new Promise((resolve, reject) => {
    sudo.exec(
      'chmod 777 /private/etc/hosts',
      options,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        } else {
          resolve('permission granted');
        }
      }
    );
  });
};

const addSitesToHostsFile = sites => {
  const formattedSites = formatSites(sites);
  console.log(formattedSites);
  fs.appendFileSync('/private/etc/hosts', formattedSites, 'utf8');
  console.log('Data is appended to file successfully.');
};

const formatSites = (sites, ipcMain) => {
  let list = '';
  const wwwList = [];
  sites.forEach(element => {
    let wwwElement;
    if (element.substring(0, 4) === 'www.') {
      wwwElement = element;
    } else {
      wwwElement = `www.${element}`;
    }

    wwwList.push(wwwElement);
    list += `0.0.0.0 ${wwwElement}
      :: ${wwwElement}
      0.0.0.0 ${wwwElement.substring(4)}
      :: ${wwwElement.substring(4)}
      `;
  });
  return list;
};

const restartWifi = () => {
  //  Initialize wifi-control package with verbose output
  WiFiControl.init({
    debug: process.env.NODE_ENV === 'dev',
  });
  return new Promise((resolve, reject) => {
    WiFiControl.resetWiFi((err, response) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

const restoreHostsFile = async () => {
  const defaultHost = `
    ##
    ##
    # Host Database
    #
    # localhost is used to configure the loopback interface
    # when the system is booting. Do not change this entry.
    ##
    127.0.0.1    localhost
    255.255.255.255    broadcasthost
    ::1 localhost
    fe80::1%lo0    localhost
    `;
  let isWritable = await canWrite('/etc/hosts');
  if (!isWritable) {
    isWritable = await requestPermissionToWrite();
  }
  if (isWritable) {
    fs.writeFile('/private/etc/hosts', defaultHost, res => {
      console.log('Done unblocking');
    });
  }
};

exports.canWrite = canWrite;
exports.requestPermissionToWrite = requestPermissionToWrite;
exports.addSitesToHostsFile = addSitesToHostsFile;
exports.restartWifi = restartWifi;
exports.restoreHostsFile = restoreHostsFile;
