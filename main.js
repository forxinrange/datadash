const electron = require('electron')

const { app, BrowserWindow } = require('electron')

function createWindow(){

    win = new BrowserWindow({ width: 1024, height: 728})

    win.loadFile('index.html')

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin'){

        app.quit()

    }

})