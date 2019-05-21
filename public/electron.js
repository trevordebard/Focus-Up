const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const { ipcMain } = electron;

const path = require('path');
const isDev = require('electron-is-dev');
const BlockSites = require('./scripts/block_sites');
const UnblockSites = require('./scripts/unblock_sites');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 422,
        minWidth: 320,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        // mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => (mainWindow = null));
}
let frontEndSender = null;
ipcMain.on('block', (event, sites) => {
    frontEndSender = event.sender;
    event.sender.send('load');
    BlockSites.block(sites, ipcMain);
});

ipcMain.on('unblock', () => {
    UnblockSites.unblock();
});

ipcMain.on('wwwListCreated', wwwList => {
    frontEndSender.send('wwwListCreated', wwwList);
});

ipcMain.on('updateProgress', data => {
    frontEndSender.send('updateProgress', data);
});
ipcMain.on('permissionDenied', () => {
    frontEndSender.send('permissionDenied');
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
exports.app = app;
