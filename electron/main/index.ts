import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import path from 'path'
import fs from 'fs'
import clone from 'git-clone/promise'
import shelljs from 'shelljs'
import { execSync } from 'child_process'

const gitClone = {
	callback: require('git-clone'),
	promise: require('git-clone/promise')
};


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1280,
    height: 720,
    minWidth: 850,
    minHeight: 600,
    frame: false,
    fullscreenable: true,
    resizable: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.on('close-app', (_) => {
  app.quit()
})

ipcMain.handle('fullscreen-app', (_) => {
  if (win?.isFullScreen()) {
    win.setFullScreen(false)
  } else {
    win?.setFullScreen(true)
  }
  return win?.isFullScreen()
})

ipcMain.on('minimize-app', (_) => {
  win?.minimize()
})

ipcMain.handle('get-websites', (_) => {
  console.log('get websites')
  //Get all folders in the dist folder
  const websites = fs.readdirSync(process.env.DIST, {withFileTypes: true})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  return websites
})



ipcMain.handle('create-website', async (_, website) => {
  //Create a folder with the website name
  const websitePath = path.join('./dist/'+website.name)
  //Wait for the end of runTestCase for return websiteData
  try {
    const websiteData = JSON.stringify(website)
    await runTestCase('promise', { args: ['--progress', '--verbose'] }, website.name, promiseTest, () => {
      fs.mkdirSync(websitePath, {recursive: true})
      // //Create a json file with the website data
      fs.writeFileSync(path.join(websitePath, 'config.json'), websiteData)
    })
    return websiteData
  } catch (err) {
    console.log(err)
    return null
  }

  
  
})

function assertGitRepoSync(dir, revision) {
	const stats = fs.statSync(`${dir}/.git`);
	return stats.isDirectory();
}

function assertCheckout(dir, expectedCheckout) {
	const checkedOut = execSync('git rev-parse HEAD', {cwd: dir, encoding: 'utf8'}).trim();
	return checkedOut === expectedCheckout;
}

let nextCheckoutId = 1;
async function runTestCase(name, opts, websiteName, fn, _callback) {
	const id = nextCheckoutId++;
	const targetDir = `./dist/${websiteName}`;

  await fn(targetDir, opts, (err) => {
    if (err) {
      console.error(`Test '${name}' for ${websiteName} failed: ${err.message}`);
      throw err;
    } else if (!assertGitRepoSync(targetDir)) {
      console.error(`Test '${name}' for ${websiteName} failed: target directory is not a git repository`);
      throw err;
    } else if (opts && opts.checkout && !assertCheckout(targetDir, opts.checkout)) {
      console.error(`Test '${name}' for ${websiteName} failed: incorrect checkout`);
      throw err;
    } else {
      console.error(`Test '${name}' for ${websiteName}: OK`);
    }
    // execSync(`rm -rf ${targetDir}`);
    _callback()
  });
}

const promiseTest = async (targetDir, options, onComplete) => {
	try {
    // await gitClone.promise('git@github.com:Dehairka/vue-boilerplate.git', targetDir, options);
    await gitClone.callback('git@github.com:Dehairka/vue-boilerplate.git', targetDir, {
      options,
      progress: (evt) => {
        console.log(evt);
      }
    }, () => {
      console.log("done!");
      onComplete(null);
    });
	} catch (err) {
		onComplete(err);
	}
}

const callbackTest = (targetDir, options, onComplete) => {
	if (options === null) {
    // gitClone.callback('git@github.com:jaz303/git-clone.git', targetDir, onComplete);
    gitClone.callback('git@github.com:Dehairka/vue-boilerplate.git', targetDir, {
      progress: (evt) => {
        console.log(evt);
      }
    }, () => {
      console.log("done!");
      ipcMain.emit('website-created')
    });
	} else {
		gitClone.callback('git@github.com:Dehairka/vue-boilerplate.git', targetDir, {
      options,
      progress: (evt) => {
        console.log(evt);
      }
    }, () => {
      console.log("done!");
    });
	}
};

ipcMain.handle('choose-website', (_, websiteName) => {
  //Get the config.json file from the website folder
  const websitePath = path.join(process.env.DIST, websiteName)
  const websiteData = fs.readFileSync(path.join(websitePath, 'config.json'), 'utf8')
  return websiteData
})