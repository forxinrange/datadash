const electron = require('electron')

const { app, BrowserWindow } = require('electron')

const { Menu } = require('electron')

const ipc = require('electron').ipcRenderer

var newWindow = null


const nativeMenus = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                click(){
                    app.quit()
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Editor',
                click(){
                    openEditorWindow()
                }
            }
        ]
    },
    {
        label: 'Config',
        submenu: [
            {
                label: 'Connection Details',
                click(){
                    openServerDetails()
                }
            }
        ]
    },
    {
        label: 'DevTools',
        submenu: [
            {
                label: 'Chromium Dev Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.webContents.toggleDevTools()
                }
            }
        ]
    }
]

// Main Window

function createWindow(){

    win = new BrowserWindow({ width: 1024, height: 728})

    win.loadFile('index.html')

    win.on('closed', () => {
        win = null
    })
}

// Editor Window

function openEditorWindow(){
    if(newWindow){
        newWindow.focus()
        return
    }

    newWindow =  new BrowserWindow({

        height: 728,
        width: 1024

    })

    newWindow.loadFile('editor.html')

    newWindow.on('closed',function(){
        newWindow = null
    })
}

// Connection details window

function openServerDetails(){
    if(newWindow){
        newWindow.focus()
        return
    }

    newWindow = new BrowserWindow({

        height: 728,
        width: 728

    })

    newWindow.loadFile('con_input.html')

    newWindow.on('closed', function(){
        newWindow = null
    })
}


// Runtime

const menu = Menu.buildFromTemplate(nativeMenus)

Menu.setApplicationMenu(menu)

app.on('ready', createWindow)

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin'){
        app.quit()
    }
})
