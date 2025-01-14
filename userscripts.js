// UserScripts Configuration
const userScripts = [
    {
        name: 'Dark Mode Toggle',
        match: ['*://example.com/*'],
        description: 'Adds a dark mode toggle button and implements dark mode styling',
        enabled: true,
        code: function() {
            // Create the toggle button
            const toggleButton = document.createElement('button');
            toggleButton.innerHTML = '🌙';
            toggleButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 10px;
                border-radius: 50%;
                border: none;
                background: #2196f3;
                color: white;
                cursor: pointer;
                width: 40px;
                height: 40px;
                font-size: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            `;

            // Add hover effect
            toggleButton.onmouseover = () => toggleButton.style.transform = 'scale(1.1)';
            toggleButton.onmouseout = () => toggleButton.style.transform = 'scale(1)';

            // Add the button to the page
            document.body.appendChild(toggleButton);

            // Create stylesheet for dark mode
            const darkModeStyles = document.createElement('style');
            darkModeStyles.innerHTML = `
                body.dark-mode {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                }
                body.dark-mode a {
                    color: #6ea8fe !important;
                }
                body.dark-mode img {
                    opacity: 0.8;
                }
                body.dark-mode * {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                    border-color: #333 !important;
                }
            `;
            document.head.appendChild(darkModeStyles);

            // Toggle dark mode
            let isDarkMode = localStorage.getItem('darkMode') === 'true';
            
            function toggleDarkMode() {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('dark-mode', isDarkMode);
                toggleButton.innerHTML = isDarkMode ? '☀️' : '🌙';
                localStorage.setItem('darkMode', isDarkMode);
                
                // Notify other scripts
                document.dispatchEvent(new CustomEvent('darkModeChanged', {
                    detail: { enabled: isDarkMode }
                }));
            }

            // Set initial state
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                toggleButton.innerHTML = '☀️';
            }

            // Add click handler
            toggleButton.addEventListener('click', toggleDarkMode);
        }
    },
    {
    name: 'My Script',
    match: ['*://website.com/*'],
    description: 'What my script does',
    enabled: true,
    code: (function() {
    `use strict`;

    let video;
    //界面广告选择器
    const cssSelectorArr = [
        `#masthead-ad`,//首页顶部横幅广告.
        `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`,//首页视频排版广告.
        `.video-ads.ytp-ad-module`,//播放器底部广告.
        `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`,//播放页会员促销广告.
        `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,//播放页右上方推荐广告.
        `#related #player-ads`,//播放页评论区右侧推广广告.
        `#related ytd-ad-slot-renderer`,//播放页评论区右侧视频排版广告.
        `ytd-ad-slot-renderer`,//搜索页广告.
        `yt-mealbar-promo-renderer`,//播放页会员推荐广告.
        `ytd-popup-container:has(a[href="/premium"])`,//会员拦截广告
        `ad-slot-renderer`,//M播放页第三方推荐广告
        `ytm-companion-ad-renderer`,//M可跳过的视频广告链接处
    ];
    window.dev=false;//开发使用

    /**
    * 将标准时间格式化
    * @param {Date} time 标准时间
    * @param {String} format 格式
    * @return {String}
    */
    function moment(time) {
        // 获取年⽉⽇时分秒
        let y = time.getFullYear()
        let m = (time.getMonth() + 1).toString().padStart(2, `0`)
        let d = time.getDate().toString().padStart(2, `0`)
        let h = time.getHours().toString().padStart(2, `0`)
        let min = time.getMinutes().toString().padStart(2, `0`)
        let s = time.getSeconds().toString().padStart(2, `0`)
        return `${y}-${m}-${d} ${h}:${min}:${s}`
    }

    /**
    * 输出信息
    * @param {String} msg 信息
    * @return {undefined}
    */
    function log(msg) {
        if(!window.dev){
            return false;
        }
        console.log(window.location.href);
        console.log(`${moment(new Date())}  ${msg}`);
    }

    /**
    * 设置运行标志
    * @param {String} name
    * @return {undefined}
    */
    function setRunFlag(name){
        let style = document.createElement(`style`);
        style.id = name;
        (document.head || document.body).appendChild(style);//将节点附加到HTML.
    }

    /**
    * 获取运行标志
    * @param {String} name
    * @return {undefined|Element}
    */
    function getRunFlag(name){
        return document.getElementById(name);
    }

    /**
    * 检查是否设置了运行标志
    * @param {String} name
    * @return {Boolean}
    */
    function checkRunFlag(name){
        if(getRunFlag(name)){
            return true;
        }else{
            setRunFlag(name)
            return false;
        }
    }

    /**
    * 生成去除广告的css元素style并附加到HTML节点上
    * @param {String} styles 样式文本
    * @return {undefined}
    */
    function generateRemoveADHTMLElement(id) {
        //如果已经设置过,退出.
        if (checkRunFlag(id)) {
            log(`屏蔽页面广告节点已生成`);
            return false
        }

        //设置移除广告样式.
        let style = document.createElement(`style`);//创建style元素.
        (document.head || document.body).appendChild(style);//将节点附加到HTML.
        style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArr)));//附加样式节点到元素节点.
        log(`生成屏蔽页面广告节点成功`);
    }

    /**
    * 生成去除广告的css文本
    * @param {Array} cssSelectorArr 待设置css选择器数组
    * @return {String}
    */
    function generateRemoveADCssText(cssSelectorArr){
        cssSelectorArr.forEach((selector,index)=>{
            cssSelectorArr[index]=`${selector}{display:none!important}`;//遍历并设置样式.
        });
        return cssSelectorArr.join(` `);//拼接成字符串.
    }

    /**
    * 触摸事件
    * @return {undefined}
    */
    function nativeTouch(){
        // 创建 Touch 对象
        let touch = new Touch({
            identifier: Date.now(),
            target: this,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        // 创建 TouchEvent 对象
        let touchStartEvent = new TouchEvent(`touchstart`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        // 分派 touchstart 事件到目标元素
        this.dispatchEvent(touchStartEvent);

        // 创建 TouchEvent 对象
        let touchEndEvent = new TouchEvent(`touchend`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        // 分派 touchend 事件到目标元素
        this.dispatchEvent(touchEndEvent);
    }


    /**
    * 获取dom
    * @return {undefined}
    */
    function getVideoDom(){
        video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);
    }


    /**
    * 自动播放
    * @return {undefined}
    */
    function playAfterAd(){
        if(video.paused && video.currentTime<1){
            video.play();
            log(`自动播放视频`);
        }
    }


    /**
    * 移除YT拦截广告拦截弹窗并且关闭关闭遮罩层
    * @return {undefined}
    */
    function closeOverlay(){
        //移除YT拦截广告拦截弹窗
        const premiumContainers = [...document.querySelectorAll(`ytd-popup-container`)];
        const matchingContainers = premiumContainers.filter(container => container.querySelector(`a[href="/premium"]`));

        if(matchingContainers.length>0){
            matchingContainers.forEach(container => container.remove());
            log(`移除YT拦截器`);
        }

        // 获取所有具有指定标签的元素
        const backdrops = document.querySelectorAll(`tp-yt-iron-overlay-backdrop`);
        // 查找具有特定样式的元素
        const targetBackdrop = Array.from(backdrops).find(
            (backdrop) => backdrop.style.zIndex === `2201`
        );
        // 如果找到该元素，清空其类并移除 open 属性
        if (targetBackdrop) {
            targetBackdrop.className = ``; // 清空所有类
            targetBackdrop.removeAttribute(`opened`); // 移除 open 属性
            log(`关闭遮罩层`);
        }
    }


    /**
    * 跳过广告
    * @return {undefined}
    */
    function skipAd(mutationsList, observer) {
        const skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-skip-ad-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
        const shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`) || document.querySelector(`.ytp-ad-button-icon`);

        if((skipButton || shortAdMsg) && window.location.href.indexOf(`https://m.youtube.com/`) === -1){ //移动端静音有bug
            video.muted = true;
        }

        if(skipButton){
            const delayTime = 0.5;
            setTimeout(skipAd,delayTime*1000);//如果click和call没有跳过更改，直接更改广告时间
            if(video.currentTime>delayTime){
                video.currentTime = video.duration;//强制
                log(`特殊账号跳过按钮广告`);
                return;
            }
            skipButton.click();//PC
            nativeTouch.call(skipButton);//Phone
            log(`按钮跳过广告`);
        }else if(shortAdMsg){
            video.currentTime = video.duration;//强制
            log(`强制结束了该广告`);
        }

    }

    /**
    * 去除播放中的广告
    * @return {undefined}
    */
    function removePlayerAD(id){
        //如果已经在运行,退出.
        if (checkRunFlag(id)) {
            log(`去除播放中的广告功能已在运行`);
            return false
        }

        //监听视频中的广告并处理
        const targetNode = document.body;//直接监听body变动
        const config = {childList: true, subtree: true };// 监听目标节点本身与子树下节点的变动
        const observer = new MutationObserver(()=>{getVideoDom();closeOverlay();skipAd();playAfterAd();});//处理视频广告相关
        observer.observe(targetNode, config);// 以上述配置开始观察广告节点
        log(`运行去除播放中的广告功能成功`);
    }

    /**
    * main函数
    */
    function main(){
        generateRemoveADHTMLElement(`removeADHTMLElement`);//移除界面中的广告.
        removePlayerAD(`removePlayerAD`);//移除播放中的广告.
    }

    if (document.readyState === `loading`) {
        document.addEventListener(`DOMContentLoaded`, main);// 此时加载尚未完成
        log(`YouTube去广告脚本即将调用:`);
    } else {
        main();// 此时`DOMContentLoaded` 已经被触发
        log(`YouTube去广告脚本快速调用:`);
    }

    let resumeVideo = () => {
        const videoelem = document.body.querySelector('video.html5-main-video')
        if (videoelem && videoelem.paused) {
             console.log('resume video')
             videoelem.play()
        }
    }

    let removePop = node => {
        const elpopup = node.querySelector('.ytd-popup-container > .ytd-popup-container > .ytd-enforcement-message-view-model')

        if (elpopup) {
            elpopup.parentNode.remove()
            console.log('remove popup', elpopup)
            const bdelems = document
                .getElementsByTagName('tp-yt-iron-overlay-backdrop')
            for (var x = (bdelems || []).length; x--;)
                bdelems[x].remove()
            resumeVideo()
        }

        if (node.tagName.toLowerCase() === 'tp-yt-iron-overlay-backdrop') {
            node.remove()
            resumeVideo()
            console.log('remove backdrop', node)
        }
    }

    let obs = new MutationObserver(mutations => mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            Array.from(mutation.addedNodes)
                .filter(node => node.nodeType === 1)
                .map(node => removePop(node))
        }
    }))

    // have the observer observe foo for changes in children
    obs.observe(document.body, {
        childList: true,
        subtree: true
    })
})();

    {
        name: 'Reading Mode',
        match: ['*://example.com/*', '*://*.example.com/*'],
        description: 'Adds a reading mode button that simplifies the page layout',
        enabled: true,
        code: function() {
            // Create the reading mode button
            const readingButton = document.createElement('button');
            readingButton.innerHTML = '📖';
            readingButton.style.cssText = `
                position: fixed;
                bottom: 70px;
                right: 20px;
                z-index: 9999;
                padding: 10px;
                border-radius: 50%;
                border: none;
                background: #2196f3;
                color: white;
                cursor: pointer;
                width: 40px;
                height: 40px;
                font-size: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            `;

            // Add hover effect
            readingButton.onmouseover = () => readingButton.style.transform = 'scale(1.1)';
            readingButton.onmouseout = () => readingButton.style.transform = 'scale(1)';

            // Add the button to the page
            document.body.appendChild(readingButton);

            // Create stylesheet for reading mode
            const readingModeStyles = document.createElement('style');
            readingModeStyles.innerHTML = `
                body.reading-mode {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                body.reading-mode > * {
                    display: none !important;
                }
                body.reading-mode article,
                body.reading-mode main,
                body.reading-mode .content,
                body.reading-mode [role="main"] {
                    display: block !important;
                    width: 90% !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 20px !important;
                    font-size: 18px !important;
                    line-height: 1.6 !important;
                }
                body.reading-mode img {
                    max-width: 100% !important;
                    height: auto !important;
                    margin: 20px auto !important;
                    display: block !important;
                }
                body.reading-mode h1, 
                body.reading-mode h2, 
                body.reading-mode h3 {
                    margin: 1.5em 0 0.5em 0 !important;
                }
                body.reading-mode p {
                    margin: 1em 0 !important;
                }
            `;
            document.head.appendChild(readingModeStyles);

            // Listen for dark mode changes
            document.addEventListener('darkModeChanged', (e) => {
                if (e.detail.enabled) {
                    readingModeStyles.innerHTML += `
                        body.reading-mode {
                            background-color: #1a1a1a !important;
                            color: #ffffff !important;
                        }
                    `;
                }
            });

            // Toggle reading mode
            let isReadingMode = false;
            
            function toggleReadingMode() {
                isReadingMode = !isReadingMode;
                document.body.classList.toggle('reading-mode', isReadingMode);
                readingButton.style.background = isReadingMode ? '#4CAF50' : '#2196f3';
                
                // Save state
                localStorage.setItem('readingMode', isReadingMode);
                
                // Notify other scripts
                document.dispatchEvent(new CustomEvent('readingModeChanged', {
                    detail: { enabled: isReadingMode }
                }));
            }

            // Restore previous state
            if (localStorage.getItem('readingMode') === 'true') {
                toggleReadingMode();
            }

            // Add click handler
            readingButton.addEventListener('click', toggleReadingMode);
        }
    },
    {
        name: 'Auto Scroll',
        match: ['*://example.com/*'],
        description: 'Adds an auto-scroll feature with speed control',
        enabled: true,
        code: function() {
            // Create the control panel
            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = `
                position: fixed;
                bottom: 120px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                gap: 5px;
                transition: all 0.3s ease;
            `;

            // Add controls
            const playButton = document.createElement('button');
            playButton.innerHTML = '▶️';
            playButton.style.cssText = `
                border: none;
                background: #2196f3;
                color: white;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
            `;

            const speedControl = document.createElement('input');
            speedControl.type = 'range';
            speedControl.min = '1';
            speedControl.max = '10';
            speedControl.value = localStorage.getItem('autoScrollSpeed') || '5';
            speedControl.style.width = '100px';

            controlPanel.appendChild(playButton);
            controlPanel.appendChild(speedControl);
            document.body.appendChild(controlPanel);

            // Listen for dark mode changes
            document.addEventListener('darkModeChanged', (e) => {
                controlPanel.style.backgroundColor = e.detail.enabled ? '#333' : 'white';
                speedControl.style.backgroundColor = e.detail.enabled ? '#444' : '#ddd';
            });

            // Listen for reading mode changes
            document.addEventListener('readingModeChanged', (e) => {
                if (e.detail.enabled && isScrolling) {
                    toggleScroll(); // Stop scrolling in reading mode
                }
            });

            // Auto scroll functionality
            let isScrolling = false;
            let scrollInterval;

            function toggleScroll() {
                isScrolling = !isScrolling;
                playButton.innerHTML = isScrolling ? '⏸️' : '▶️';
                
                if (isScrolling) {
                    scrollInterval = setInterval(() => {
                        window.scrollBy(0, speedControl.value);
                    }, 50);
                } else {
                    clearInterval(scrollInterval);
                }

                // Save state
                localStorage.setItem('autoScrolling', isScrolling);
            }

            // Add event listeners
            playButton.addEventListener('click', toggleScroll);
            speedControl.addEventListener('input', () => {
                localStorage.setItem('autoScrollSpeed', speedControl.value);
                if (isScrolling) {
                    clearInterval(scrollInterval);
                    scrollInterval = setInterval(() => {
                        window.scrollBy(0, speedControl.value);
                    }, 50);
                }
            });

            // Restore previous state
            if (localStorage.getItem('autoScrolling') === 'true') {
                toggleScroll();
            }
        }
    }
];

// UserScript Injection System
class UserScriptManager {
    constructor() {
        this.scripts = userScripts;
    }

    matchUrl(pattern, url) {
        const regex = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '\\?');
        return new RegExp(`^${regex}$`).test(url);
    }

    shouldRunOnUrl(script, url) {
        return script.match.some(pattern => this.matchUrl(pattern, url));
    }

    async injectScripts(iframe) {
        try {
            const url = iframe.src;
            const enabledScripts = this.scripts.filter(script => 
                script.enabled && this.shouldRunOnUrl(script, url)
            );

            for (const script of enabledScripts) {
                try {
                    // Wait for iframe to load
                    await new Promise(resolve => {
                        if (iframe.contentDocument.readyState === 'complete') {
                            resolve();
                        } else {
                            iframe.onload = resolve;
                        }
                    });

                    // Create a script element
                    const scriptElement = iframe.contentDocument.createElement('script');
                    scriptElement.textContent = `(${script.code.toString()})();`;
                    
                    // Inject the script
                    iframe.contentDocument.body.appendChild(scriptElement);
                    console.log(`Injected script: ${script.name}`);
                } catch (err) {
                    console.error(`Error injecting script ${script.name}:`, err);
                }
            }
        } catch (err) {
            console.error('Error in script injection:', err);
        }
    }
}

// Export the manager
window.userScriptManager = new UserScriptManager();
