const { app, BrowserWindow, Menu, screen } = require("electron");
const path = require('path')

/*** 변수 */
let window; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */
let pipWindowSize = {
    width: 370,
    height: 290,
};


// custom 메뉴 만들기
const NLMenu = [
    {
        label: "about",
        submenu: [
            {
                role: "about",
            },
            {
                type: "separator",
            },
            {
                role: "quit",
            },
        ],
    },
    {
        label: "mode",
        submenu: [
            {
                label: "Pip Mode",
                click: () => {
                    changePipMode();
                }
            },
            {
                type: "separator",
            },
            {
                label: "Reset Preferences",
                click: () => {
                    window.webContents.executeJavaScript(`
                        localStorage.clear();
                        window.location.reload();
                    `);
                }
            }
        ],
    },
];

/*** Function */
const createWindow = () => {
    window = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 720,
        minHeight: 540,
        webPreferences: {
            nodeIntegration: true,  //Node 기반 라이브러리를 사용하신다면, 꼭 true로 설정
            contextIsolation: false,
        },
        autoHideMenuBar: false,  // 앱 메뉴바 visible - T,F

        center: true,           // 앱 실행 시 윈도우 가운데 위치 - T,F
        alwaysOnTop: true,      // 윈도우를 다른 창들 위에 항상 유지 - T,F
    })
    window.loadURL("http://localhost:3000")
}
const changePipMode = () => {
    /* min사이즈 제한 변경 */
    window.setMinimumSize(pipWindowSize.width, pipWindowSize.height);
    /* 윈도우 사이즈 변경 */
    window.setSize(pipWindowSize.width, pipWindowSize.height);
    /* 윈도우 center 해제 */
    window.center(false);
    /* 윈도우 비율 고정  */
    window.setAspectRatio(pipWindowSize.width / pipWindowSize.height);

    /* 화면 정보 가져와서 오른쪽 하단 위치 계산 */
    const primaryDisplay = screen.getPrimaryDisplay(); // 메인화면 정보 가져오기
    const { width, height } = primaryDisplay.workAreaSize; // 화면의 작업 영역 크기

    const x = width - pipWindowSize.width * 1.1; // right 90% (10% 여백)
    const y = height - pipWindowSize.height * 1.1; // bottom 90% (10% 여백)

    window.setBounds({
        x: Math.round(x),
        y: Math.round(y),
        width: pipWindowSize.width,
        height: pipWindowSize.height,
    });

    /* 윈도우를 항상 위에 표시 */
    window.setAlwaysOnTop(true, "floating", 1);
}


/*** init */
app.whenReady().then(() => {
    createWindow();
    const customMenu = Menu.buildFromTemplate(NLMenu);
    Menu.setApplicationMenu(customMenu);
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})