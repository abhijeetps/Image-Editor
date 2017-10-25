const {BrowserWindow, app} = require('electron');

let win;

let boot = () => {
    win = new BrowserWindow({
        height: 480,
        width: 640,
        frame: false
    });

    win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();
    
};

app.on('ready', boot);