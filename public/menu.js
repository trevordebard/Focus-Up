const electron = require('electron');

const { app } = electron;
const { Menu } = electron;
const { shell } = electron;
const isDev = require('electron-is-dev');

class MenuBuilder {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        console.log('constructed');
    }

    buildMenu() {
        if (isDev) {
            this.setupDevelopmentEnvironment();
        }

        const template =
            process.platform === 'darwin'
                ? this.buildDarwinTemplate()
                : this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment() {
        console.log('dev');
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on('context-menu', (e, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement(x, y);
                    },
                },
            ]).popup(this.mainWindow);
        });
    }

    buildDarwinTemplate() {
        console.log('darwin');
        const subMenuAbout = {
            label: 'Focus Up',
            submenu: [
                {
                    label: 'About Focus Up',
                    selector: 'orderFrontStandardAboutPanel:',
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: 'Hide ElectronReact',
                    accelerator: 'Command+H',
                    selector: 'hide:',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:',
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };
        const subMenuEdit = {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:',
                },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:',
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:',
                },
            ],
        };
        const subMenuViewDev = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    },
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.toggleDevTools();
                    },
                },
            ],
        };
        const subMenuViewProd = {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
            ],
        };
        const subMenuWindow = {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:',
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:',
                },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' },
            ],
        };
        const subMenuHelp = {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        shell.openExternal('https://github.com/trevordebard');
                    },
                },
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal('https://github.com/trevordebard');
                    },
                },
            ],
        };

        const subMenuView = isDev ? subMenuViewDev : subMenuViewProd;

        return [
            subMenuAbout,
            subMenuEdit,
            subMenuView,
            subMenuWindow,
            subMenuHelp,
        ];
    }

    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O',
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click: () => {
                            this.mainWindow.close();
                        },
                    },
                ],
            },
            {
                label: '&View',
                submenu: isDev
                    ? [
                          {
                              label: '&Reload',
                              accelerator: 'Ctrl+R',
                              click: () => {
                                  this.mainWindow.webContents.reload();
                              },
                          },
                          {
                              label: 'Toggle &Full Screen',
                              accelerator: 'F11',
                              click: () => {
                                  this.mainWindow.setFullScreen(
                                      !this.mainWindow.isFullScreen()
                                  );
                              },
                          },
                          {
                              label: 'Toggle &Developer Tools',
                              accelerator: 'Alt+Ctrl+I',
                              click: () => {
                                  this.mainWindow.toggleDevTools();
                              },
                          },
                      ]
                    : [
                          {
                              label: 'Toggle &Full Screen',
                              accelerator: 'F11',
                              click: () => {
                                  this.mainWindow.setFullScreen(
                                      !this.mainWindow.isFullScreen()
                                  );
                              },
                          },
                      ],
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal('http://electron.atom.io');
                        },
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal(
                                'https://github.com/atom/electron/tree/master/docs#readme'
                            );
                        },
                    },
                    {
                        label: 'Community Discussions',
                        click() {
                            shell.openExternal(
                                'https://discuss.atom.io/c/electron'
                            );
                        },
                    },
                    {
                        label: 'Search Issues',
                        click() {
                            shell.openExternal(
                                'https://github.com/atom/electron/issues'
                            );
                        },
                    },
                ],
            },
        ];

        return templateDefault;
    }
}
module.exports = MenuBuilder;
