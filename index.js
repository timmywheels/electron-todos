const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

const todos = []
let index = 0;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(`file://${__dirname}/main.html`)
    mainWindow.on('closed', () => app.quit());


    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'New Todo'
    })
    addWindow.loadURL(`file://${__dirname}/new.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
    debugger;
    todos.push({ 'index': index, 'description': todo })
    index++;
    mainWindow.webContents.send('todoList:display', [...todos])
    console.log('todos[]:', [...todos])
    addWindow.close();
})

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear All Todos',
                accelerator: process.platform === 'darwin' ? 'Command+X' : 'Control+X',
                click() {
                    clearAllTodos()
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({ label: '' });
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Option+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]

    })
}
