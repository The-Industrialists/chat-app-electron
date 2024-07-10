const { app, BrowserWindow, ipcMain, contextBridge } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // Disable Node.js integration in renderer process
      contextIsolation: true, // Enable context isolation
    },
  });

  mainWindow.loadFile("index.html");

  // Open the DevTools (for debugging purposes)
  // mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();

  // Expose IPC methods securely using contextBridge
  contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
      // Send message to renderer process
      mainWindow.webContents.send(channel, data);
    },
    receive: (channel, func) => {
      // Listen for message from renderer process
      ipcMain.on(channel, (event, ...args) => func(...args));
    },
  });
});
