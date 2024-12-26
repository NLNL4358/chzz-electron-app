const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * changePipMode 함수 호출 시 ipcRenderer 호출
     * @returns - main.js 에서 "change-pip-mode"에 해당하는 이벤트 함수 수행
     */
    changePipMode: () => ipcRenderer.send('change-pip-mode'),

    /**
     * @returns NAVER로그인 창 Open
     */
    openNaverLoginWindow: () => ipcRenderer.send('open-naver-login'),

    /**
     * @return NAVER get access-token
     */
    onAuthSuccess: (callback) =>
        ipcRenderer.on('auth-success', (_, accessToken) =>
            callback(accessToken),
        ),
});
