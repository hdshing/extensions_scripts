// ==UserScript==
// @name         浮动窗口B站样式
// @namespace    http://tampermonkey.net/
// @version      2024-04-20
// @description  try to take over the world!
// @author       You
// @match        http*://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==


    
const loadStyle = ()=>{
    


    // 1. 创建一个新的<style>元素
    var styleElement = document.createElement('style');

    // 2. 设置<style>元素的样式内容
    var cssContent = `
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        ::-webkit-scrollbar-track:hover {
            background: #ddd;
        }

        #mirror-vdcon{
            position: fixed;
            z-index: 9000;
        }
        #bgBox{
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100%;
            background-color: #eee;
            z-index: 9100;
        }
        .iframe_video{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9200;
        }
    `;
    styleElement.type = 'text/css';
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssContent;
    } else {
        styleElement.appendChild(document.createTextNode(cssContent));
    }

    // 3. 将<style>元素添加到<head>元素中
    var headElement = document.getElementsByTagName('head')[0];
    headElement.appendChild(styleElement);
}

const main = () => {
    var video = document.querySelector('video')
    if( !video ) return

    video.classList.add('iframe_video')
    loadStyle();
    document.body.style.overflow ='hidden' // 隐藏滚动条  
    var htmlElement = document.documentElement;
    htmlElement.style.overflow ='hidden'
    var bg_box = document.createElement('div') // 背景板
    bg_box.setAttribute('id', 'bgBox')
    document.body.appendChild(bg_box)
    
    let video_container = document.querySelector('.bpx-player-video-wrap')
    video_container && video_container.appendChild(bg_box)
}

(function() {
    main()
})();