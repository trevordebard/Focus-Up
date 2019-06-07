const electron = require("electron");

const { app } = electron;
const { BrowserWindow } = electron;
const { ipcMain } = electron;
const { dialog } = electron;

const path = require("path");
const isDev = require("electron-is-dev");
const MenuBuilder = require("./menu");
const BlockSites = require("./scripts/block_sites");
const UnblockSites = require("./scripts/unblock_sites");

let mainWindow;
let blockInProgress = false;

function confirmClose() {
  dialog.showMessageBox(
    {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message:
        "Are you sure you want to close in the middle of a Focus session?"
    },
    function(response) {
      console.log(`response: ${response}`);
      if (response === 0) {
        // Runs the following if 'Yes' is clicked
        app.showExitPrompt = false;
        UnblockSites.unblock();
        blockInProgress = false;
        app.quit();
      }
    }
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 422,
    minWidth: 320,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "favicon.ico")
  });
  mainWindow.on("close", function(e) {
    if (blockInProgress) {
      e.preventDefault();
      confirmClose();
    } else {
      app.quit();
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    // mainWindow.webContents.openDevTools();
  }
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  mainWindow.on("closed", () => (mainWindow = null));
}
let frontEndSender = null;
ipcMain.on("block", (event, sites) => {
  frontEndSender = event.sender;
  blockInProgress = true;
  event.sender.send("load");
  BlockSites.block(sites, ipcMain);
});

ipcMain.on("unblock", () => {
  blockInProgress = false;
  UnblockSites.unblock();
});

ipcMain.on("blockComplete", wwwList => {
  frontEndSender.send("blockComplete", wwwList);
});

ipcMain.on("updateProgress", data => {
  frontEndSender.send("updateProgress", data);
});
ipcMain.on("permissionDenied", () => {
  frontEndSender.send("permissionDenied");
});

app.on("ready", createWindow);

app.on("window-all-closed", e => {
  if (blockInProgress) {
    e.preventDefault(); // Prevents the window from closing
  } else {
    app.quit();
  }
});

// Works with Command + Q
app.on("before-quit", function(e) {
  // Handle menu-item or keyboard shortcut quit here
  if (blockInProgress) {
    e.preventDefault();
    confirmClose();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

exports.app = app;
