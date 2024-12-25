const { app, BrowserWindow, Menu, screen, ipcMain } = require('electron');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

/*** 변수 */
let window; /* 윈도우는 전역변수로 만들어 menu에서 접근 가능하도록 설정 */
let naverLoginWindow; /* 네이버 로그인용 윈도우 */
let pipToggle = false; /* 핍모드 toggle */

/*** 상수  */
const pipWindowSize = {
    width: 370,
    height: 290,
};
const localPort = 54581;
dotenv.config(); // env 파일 main.js에서도 쓰도록 불러오기

// custom 메뉴 만들기
const NLMenu = [
    {
        label: 'about',
        submenu: [
            {
                role: 'about',
            },
            {
                type: 'separator',
            },
            {
                role: 'quit',
            },
        ],
    },
    {
        label: 'mode',
        submenu: [
            {
                label: 'Pip Mode',
                accelerator: 'Ctrl+Shift+P',
                click: () => {
                    modeChanger();
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Developer', // 개발자모드
                accelerator: 'Ctrl+Shift+I', // 단축키 설정
                click: () => {
                    window.webContents.toggleDevTools(); // 개발자 도구 열기/닫기
                },
            },
        ],
    },
];

/*** Function */
const startServer = () => {
    const server = express();

    // React 빌드된 파일의 경로 지정
    server.use(express.static(path.join(__dirname, '../build')));

    // 기본 경로로 들어왔을 때 React의 index.html 반환
    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });

    // 서버 시작
    server.listen(localPort, () => {
        console.log(`React build served at http://localhost:${localPort}`);
    });
};

const createWindow = () => {
    window = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 720,
        minHeight: 540,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // preload.js 파일 경로
            nodeIntegration: false, // 보안상 이유로 false
            contextIsolation: true, // ipcAPI를 사용하기 위해 true로 선언!
        },
        autoHideMenuBar: true, // 앱 메뉴바 hide - T,F
        frame: false,
        center: true, // 앱 실행 시 윈도우 가운데 위치 - T,F
        // alwaysOnTop: true,      // 윈도우를 다른 창들 위에 항상 유지 - T,F
    });
    const startURL = `http://localhost:${localPort}`;
    window.loadURL(startURL);
};

/**
 * pipToggle을 변경하며 pip모드와 app모드를 오고가게 하는 함수
 */
const modeChanger = () => {
    pipToggle = !pipToggle;
    switch (pipToggle) {
        case true:
            changePipMode();
            break;
        case false:
            changeAppMode();
            break;
        default:
            changeAppMode();
            break;
    }
};

/**
 * @description - 일반 모드로 변경함수
 */
const changeAppMode = () => {
    /* min사이즈 제한 변경 */
    window.setMinimumSize(720, 540);

    /* 윈도우 비율 고정 해제  */
    window.setAspectRatio(0);

    /* 화면 정보 가져오기 (PIP 모드였던 모니터 기준) */
    const currentBounds = window.getBounds();
    const primaryDisplay = screen.getDisplayNearestPoint({
        x: currentBounds.x,
        y: currentBounds.y,
    });

    /* 해당 모니터의 중앙 좌표 계산 */
    const { width, height, x, y } = primaryDisplay.workArea;
    const centerX = x + (width - 1024) / 2;
    const centerY = y + (height - 768) / 2;

    /* 윈도우 위치를 중앙으로 설정 */
    window.setBounds({
        x: Math.round(centerX),
        y: Math.round(centerY),
        width: 1024,
        height: 768,
    });

    window.setAlwaysOnTop(false, 'normal', 0);
};
/**
 * @description - Pip 모드로 변경함수
 */
const changePipMode = () => {
    /* min사이즈 제한 변경 */
    window.setMinimumSize(pipWindowSize.width, pipWindowSize.height);

    /* 윈도우 center 해제 */
    window.center(false);

    /* 윈도우 비율 고정  */
    window.setAspectRatio(pipWindowSize.width / pipWindowSize.height);

    /* 화면 정보 가져오기 (현재 윈도우가 있는 모니터 기준) */
    const currentBounds = window.getBounds();
    const currentDisplay = screen.getDisplayNearestPoint({
        x: currentBounds.x,
        y: currentBounds.y,
    });

    /* 해당 모니터의 작업 영역 크기를 가져와서 오른쪽 하단 좌표 계산 */
    const { width, height, x, y } = currentDisplay.workArea;
    const pipX = x + width - pipWindowSize.width * 1.1; // 오른쪽 끝에서 10% 여백
    const pipY = y + height - pipWindowSize.height * 1.1; // 아래쪽 끝에서 10% 여백

    window.setBounds({
        x: Math.round(pipX),
        y: Math.round(pipY),
        width: pipWindowSize.width,
        height: pipWindowSize.height,
    });

    /* 윈도우를 항상 위에 표시 */
    window.setAlwaysOnTop(true, 'floating', 1);
};

const openNaverLoginWindow = () => {
    const naverClientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUrl = `http://localhost:${process.env.REACT_APP_PORT}`;
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&state=flase&redirect_uri=${redirectUrl}`;

    // 새로운 BrowserWindow 생성
    naverLoginWindow = new BrowserWindow({
        width: 600,
        height: 650,
        resizable: false,
        frame: true,
        parent: window, // 메인 창을 부모로 설정
        modal: true, // 모달 창으로 설정
        autoHideMenuBar: true, // 앱 메뉴바 hide - T,F
        frame: false,
        webPreferences: {
            nodeIntegration: false, // 보안상 false
            contextIsolation: true, // ipc 사용 시 필요
        },
    });

    // 로그인 URL 로드
    naverLoginWindow.loadURL(naverAuthUrl);

    // 로그인 창의 `will-redirect` 이벤트를 감지하여 처리
    naverLoginWindow.webContents.on('will-redirect', (event, url) => {
        event.preventDefault();

        // 로그인 완료 처리 로직
        const urlParams = new URL(url).searchParams;
        const authCode = urlParams.get('oauth_token');
        const state = urlParams.get('state');
        console.log(
            'urlParams : ',
            urlParams,
            'authCode : ',
            authCode,
            'state : ',
            state,
        );

        if (authCode) {
            window.webContents.send('auth-success', {
                accessToken: authCode,
            });
        }

        // 로그인 창 닫기
        if (naverLoginWindow) {
            naverLoginWindow.close();
            naverLoginWindow = null;
        }
    });

    // 로그인 창이 닫힐 때 처리
    naverLoginWindow.on('closed', () => {
        naverLoginWindow = null;
    });
};

/*** init */
app.whenReady().then(() => {
    if (app.isPackaged) {
        startServer(); // 배포 시 Express 서버 시작
    }
    createWindow();
    const customMenu = Menu.buildFromTemplate(NLMenu);
    Menu.setApplicationMenu(customMenu);
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/*** IPC - Event - handler  " React와 Electron의 소통 "*/
ipcMain.on('change-pip-mode', () => {
    modeChanger();
});
ipcMain.on('open-naver-login', () => {
    openNaverLoginWindow();
});
