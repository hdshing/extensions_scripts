// ==UserScript==
// @name         多语言翻译 | 简单划选翻译 | 原文译文可展示对比学习 | 持续更新
// @namespace    http://tampermonkey.net/
// @version      2024-05-14
// @description  页面翻译 | 选中文字（ Ctrl + 鼠标右键 ）| 英文学习 | 翻译文可设置，支持全球多数通用语言 | 极其便利，长期更新！| 有什么问题都可以反馈
// @author       shing0727@foxmail.com
// @match        *://*/*
// @icon         https://s21.ax1x.com/2024/05/17/pkuVzUH.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var cssContent = `
.fy_btn_box{
    position: fixed;
    top: 50px;
    right: 50px;
    z-index: 9999;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    color: #333;
}
#fy_transContainer{
    display: none;
    position: fixed;
    top: 50px;
    left: 50px;
    max-width: 300px;
    padding: 10px;
    padding-top: 24px;
    border-radius: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    box-shadow: 0 3px 10px 1px rgba(0, 0, 0, 0.1);
    background-color: rgba(255,255,255,0.7);
    backdrop-filter: saturate(420%) blur(50px);
    -webkit-backdrop-filter: saturate(420%) blur(50px);
    z-index: 9999;
    font-size: 14px;
    border-bottom-right-radius: 0;
    overflow: hidden;
}
#fy_dragBar{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    cursor: grab;
    // background-color: #F9E79F;
    background-color: rgba(0,0,0,0.1);
    backdrop-filter: saturate(420%) blur(50px);
    -webkit-backdrop-filter: saturate(420%) blur(50px);
}
#fy_Scale_rb{
    position:absolute;
    bottom:0;
    right:0;
    width:7px;
    height:7px;
    cursor: nw-resize;
    // background: #ddd;
    // clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
}

#fy_contentBox{
    width: 100%;
    overflow: auto;
    line-height: 1.3em;
    letter-spacing: 0.5px;
}
#fy_contentBox .textRight{
    text-align: right;
}
.transText_node{
    width: 100%;
    padding: 7px;
    box-sizing: border-box;
}
.transText_node:hover{
    background-color: rgba(0,0,0,0.04);
    border-radius: 6px;
}
.transText_node_to{
    transition: all 0.2s;
}
.transText_node_from{
    height: 0;
    overflow: hidden;
    transition: all 0.2s;
}

#fy_contentBox .fy_node_expand{
    background-color: rgba(0,0,0,0.04);
    border-radius: 6px;
    margin: 5px 0;
}

.fy_node_expand .transText_node_from, .fy_node_expand .transText_node_to{
    padding: 6px 8px;
}
.fy_node_expand .transText_node_to{
    background-color: rgb(209, 255, 240);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.fy_node_expand .transText_node_from{
    background-color: rgb(254, 234, 242);
    height: auto;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

#fy_select{
    position: absolute;
    top: 2px;
    right: 0;
    background-color: transparent;
    border: none; /* 去除默认边框 */  
    box-shadow: none; /* 去除默认的阴影 */  
    outline: none; /* 去除可能的轮廓线 */
}
// .copy_icon{
//     position: absolute;
//     bottom: 10xp;
//     right: 10px;
// }
// #fy_top_tools{
//     width: auto;
//     position: relative;
//     display: inline-flex;
//     align-items: center;
//     box-sizing: border-box;
//     padding: 0 6px;
//     height: 100%;
//     cursor: initial;
// }
// .fy_top_toolItem{
//     padding: 3px 5px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }
// .tool_icon{
//     display: inline-block;
//     width: 10px;
//     height: 10px;
//     line-height: 9px;
//     border-radius: 10px;
//     font-size: 10px;
//     text-align: center;
//     background-color: red;
//     color: red;
// }
// .fy_top_toolItem:hover .tool_icon{
//     color:#fff;
// }



`


// ------------全局----------------
// 显示总容器
var transContainerDOM = null
// 翻译内容容器
var fyContentDOM = null
// 拖动条
var fyDragBarDOM = null
var fyScale_rb = null
// 待翻译文本
var fromTransTextArray = [];
// 翻译结果对象
var transRes = {}
// -------------------------- 
var transToTypes = [
    { type: 'zh', keyName: '中', name: '中文', isSelected: true },
    { type: 'en', keyName: '英', name: '英文', isSelected: false },
    { type: 'fra', keyName: '法', name: '法文', isSelected: false },
    { type: 'spa', keyName: '西', name: '西班牙文', isSelected: false },
    { type: 'jp', keyName: '日', name: '日文', isSelected: false },
    { type: 'kor', keyName: '韩', name: '韩文', isSelected: false },
    { type: 'ru', keyName: '俄', name: '俄文', isSelected: false },
    { type: 'de', keyName: '德', name: '德文', isSelected: false },
    { type: 'it', keyName: '意', name: '意大利文', isSelected: false },
    { type: 'th', keyName: '泰', name: '泰文', isSelected: false },
    { type: 'pt', keyName: '葡', name: '葡萄牙文', isSelected: false },
    { type: 'ara', keyName: '阿', name: '阿拉伯文', isSelected: false },
]

// 初始加载样式
const loadStyle = () => {
    var style = document.createElement('style');
    if (style.styleSheet) {
        // 对于老版本的IE浏览器
        style.styleSheet.cssText = cssContent;
    } else {
        style.appendChild(document.createTextNode(cssContent));
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(style);
}
/**
 * 传入配置信息创建元素并返回DOM对象
*/
const myCreateEle = (option, mountE) => {
    let e = document.createElement(option.el || 'div')
    option.className && e.classList.add(option.className)
    for (let p in (option.props || {})) {
        e.setAttribute(p, option.props[p])
    }
    e.innerText = option.text || ''
    e.style.cssText = option.style || ''
    mountE && mountE.appendChild(e)
    return e
}

// 初始生成元素
const initLoadElement = () => {
    transContainerDOM = myCreateEle({
        props: { id: 'fy_transContainer' }
    }, document.body)
    // 内容容器
    fyContentDOM = myCreateEle({ props: { id: 'fy_contentBox' } }, transContainerDOM)
    // loading
    $(transContainerDOM).append(`
    <div id="fy_loading">
        <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>
    </div>
    `)
    // 拖动条
    fyDragBarDOM = myCreateEle({
        props: { id: 'fy_dragBar' }
    }, transContainerDOM)
    // $(fyDragBarDOM).append(`
    //     <div id='fy_top_tools'>
    //         <div class='fy_top_toolItem'>
    //             <span class='tool_icon'>×</span>
    //         </div>
    //     </div>
    // `)
    // 缩放点-框
    fyScale_rb = myCreateEle({
        props: { id: 'fy_Scale_rb' }
    }, transContainerDOM)

    let optionsStr = ''
    transToTypes.forEach(item => {
        optionsStr += `
        <option value="${item.type}" title="${item.name}">
            <span >${item.keyName}</span>
        </option>
        `
    })
    // ❌➖📌💡🎯📝✔️❓❗️📅🚫🔄✅📖📘
    // filter: grayscale(100%); 置灰
    $(transContainerDOM).append(`
        <select id="fy_select">
        ${optionsStr}
        </select>
    `)


}


// 生成MD5值
const calculateMD5 = (input) => {
    return CryptoJS.MD5(input).toString();
}

// ---------------
var salt = Date.now()
var appid = '20240513002050392';
var fyToType = 'zh'
// ---------------

// 处理翻译
const handleTranslate = (fromTransText, reUpdate = false) => {
    var sign = calculateMD5(appid + fromTransText + salt + 'evAKKTnaxMEpHrnCxwDC');
    let param = `?q=${fromTransText}&from=auto&to=${fyToType}&appid=${appid}&salt=${salt}&sign=${sign}`

    // $(fyContentDOM).append(`
    //     <div class="transText_node">
    //         <div class="transText_node_to">${fromTransText}</div>
    //         <div class="transText_node_from">${fromTransText}</div>
    //     </div>
    // `)
    // $('#fy_loading').hide()
    // computedContainer()
    // console.log('~~ ', fyToType)
    // return
    GM_xmlhttpRequest({
        url: "https://fanyi-api.baidu.com/api/trans/vip/translate" + param,
        method: "GET",
        onload: function (response) {
            if (response.status === 200) {
                let res = JSON.parse((response.responseText || ''))

                if (!(res.trans_result && res.trans_result.length > 0)) return;

                transRes = {
                    formLang: res.from,
                    toLang: res.to,
                    formText: res.trans_result[0].src,
                    toText: res.trans_result[0].dst,
                }
                let textRight = fyToType === 'ara' ? 'textRight' : ''
                $(fyContentDOM).append(`
                    <div class="transText_node ${textRight}">
                        <div class="transText_node_to" title="${transRes.formText}">${transRes.toText}</div>
                        <div class="transText_node_from">${transRes.formText}</div>
                    </div>
                `)
                $('#fy_loading').hide()
                !reUpdate && computedContainer()
                // console.log('翻译结果 = ', transRes)

            } else {
                console.error("Request failed with status111 " + response.status);
            }
        },
        onerror: function (e) {
            console.error("Request failed222: " + e.message);
        },
    });
}



var currX = 0; // 当前鼠标位置
var currY = 0; // 当前鼠标位置
var isContainer = false // 容器是否出现
var isTrans = false; // 是否处于可翻译状态
// 绑定事件
const bingEvents = () => {
    // transContainerDOM 翻译容器
    let isTransKeyObj = {};
    document.addEventListener('keydown', (e) => {
        if (['c', 'Control'].includes(e.key)) {
            isTrans = true;
            isTransKeyObj.c = true;
        }
    });
    document.addEventListener('keyup', (e) => {
        if (['c', 'Control'].includes(e.key)) {
            isTrans = false;
            isTransKeyObj.c = false;
        }
    });
    // 鼠标按下事件 
    document.addEventListener("mousedown", function (event) {
        if (isTrans && event.button === 2) {
            // 获取Selection对象,选中的文本
            let textAll = window.getSelection().toString();
            if (!textAll) return
            currX = event.clientX;
            currY = event.clientY;
            fromTransTextArray = textAll.split(/[\n\t]+/);
            // console.log("选中的文本：")
            // console.log(fromTransTextArray)
            isContainer = true

            transContainerDOM.style.display = 'flex'
            $('#fy_loading').show()
            fyContentDOM.innerText = ''
            computedContainer() // 计算容器位置
            fromTransTextArray.filter(text => text).forEach(text => {
                handleTranslate(text)
            })
        }
    })
    document.body.onclick = function (event) {
        if (isContainer) {
            clearTransContainer()
        }
    };
    transContainerDOM.onclick = function (e) {
        e.stopPropagation(); // 阻止事件冒泡
    }
    const clearTransContainer = () => {
        isContainer = false
        isTrans = false
        for (let key in isTransKeyObj) {
            isTransKeyObj[key] = false
        }
        transContainerDOM.style.display = 'none'
        fyContentDOM.innerText = ''
        transContainerDOM.style.maxWidth = '300px';
        transContainerDOM.style.width = 'auto'
        transContainerDOM.style.height = 'auto'
    }
    // 上下文菜单
    document.addEventListener("contextmenu", function (event) {
        if (isTrans) {
            // 取消默认行为（阻止上下文菜单出现）
            event.preventDefault();
        }
    });

    bindHandleDrag() // 绑定拖动模块事件
    bindHandleScale() // 绑定缩放模块事件
    bindHandleSelect() // 绑定切换翻译事件
    bindTextClick() // 点击翻译文本事件

}
// 切换翻译语言
const bindHandleSelect = () => {
    document.getElementById('fy_select').onchange = function (e) {
        fyToType = this.value
        fyContentDOM.innerText = ''
        $('#fy_loading').show()
        fromTransTextArray.filter(text => text).forEach(text => {
            handleTranslate(text, true)
        })
    }
}
// 拖动事件
const bindHandleDrag = () => {
    var isMove = false
    var mouseToEleX;
    var mouseToEleY;
    // 拖动处理
    fyDragBarDOM.addEventListener("mousedown", function (e) {
        if (!isTrans) {
            isMove = true
            fyDragBarDOM.style.cursor = 'grabbing'
            // 获取鼠标相对于元素的位置
            mouseToEleX = e.clientX - transContainerDOM.getBoundingClientRect().left;
            mouseToEleY = e.clientY - transContainerDOM.getBoundingClientRect().top;
        }
    });
    // 当鼠标移动时
    window.addEventListener('mousemove', (e) => {
        if (!isMove) return
        // 防止默认的拖动选择文本行为
        e.preventDefault();
        let t = (e.clientY - mouseToEleY) < 0 ? 0 : e.clientY - mouseToEleY;
        // 更新元素的位置
        transContainerDOM.style.left = (e.clientX - mouseToEleX) + 'px';
        transContainerDOM.style.top = t + 'px';
    })
    // 当鼠标松开时
    window.addEventListener('mouseup', () => {
        isMove = false;
        fyDragBarDOM.style.cursor = 'grab'
    });
}

  

// 缩放事件
const bindHandleScale = () => {
    var mainCurrWidth;
    var mainCurrHeight;
    var cX, cY;
    var isScale = false;
    fyScale_rb.addEventListener('mousedown', (e) => {
        isScale = true
        mainCurrWidth = transContainerDOM.offsetWidth
        mainCurrHeight = transContainerDOM.offsetHeight
        cX = e.clientX;
        cY = e.clientY;
    });
    // 当鼠标移动时
    window.addEventListener('mousemove', (e) => {
        if (!isScale) return
        // 防止默认的拖动选择文本行为
        e.preventDefault();
        transContainerDOM.style.maxWidth = 'none'
        let newWidth = mainCurrWidth + (e.clientX - cX)
        let newHeight = mainCurrHeight + (e.clientY - cY)
        // 更新元素的位置
        transContainerDOM.style.width = Math.max(10, newWidth) + 'px';
        transContainerDOM.style.height = Math.max(10, newHeight) + 'px';
    })
    // 当鼠标松开时
    window.addEventListener('mouseup', () => {
        isScale = false;
        fyDragBarDOM.style.cursor = 'grab'
    });
}
// 点击译文事件
const bindTextClick = () => {
    fyContentDOM.addEventListener('click', function (event) {
        let textAll = window.getSelection().toString();
        if (textAll) return;
        let targetEle = event.target
        if (!targetEle.classList.contains('transText_node')) {
            targetEle = targetEle.parentNode
        }
        if (!targetEle.classList.contains('transText_node')) return;

        if (targetEle.classList.contains('fy_node_expand')) {
            targetEle.classList.remove('fy_node_expand');
        } else {
            targetEle.classList.add('fy_node_expand')
        }

        var rect = transContainerDOM.getBoundingClientRect();
        // 获取视口的高度
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        // 计算元素底部到视口底部的距离
        if (( viewportHeight - rect.bottom ) < 30 ) {
            transContainerDOM.style.height = ( viewportHeight - rect.top - 50) +'px'
        }

    });
}

// 计算渲染容器高度位置
const computedContainer = () => {
    let h_ = transContainerDOM.offsetHeight;
    let w_ = transContainerDOM.offsetWidth;
    let yinzi = 10
    let top = currY - h_ - yinzi;
    // 小窗口位置高过主窗口则在鼠标底部显示
    transContainerDOM.style.top = top < 1 ? (currY + yinzi) + 'px' : top + 'px';
    let left = currX - (w_ / 2);
    transContainerDOM.style.left = left < 1 ? '1px' : left + 'px'

    let topToBotton = window.innerHeight - currY
    if (transContainerDOM.offsetHeight > topToBotton) {
        transContainerDOM.style.height = topToBotton + 'px'
    }
}

// 语音播放文本
const playText = (text) => {
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
        // 创建语音合成实例
        var synthesis = window.speechSynthesis;
        var textToSpeak = text;
        // 创建语音合成的配置
        var utterance = new SpeechSynthesisUtterance(textToSpeak);
        // 使用默认语音
        utterance.voice = speechSynthesis.getVoices()[0];
        // 播放文本
        synthesis.speak(utterance);
    } else {
        console.log("抱歉，您的浏览器不支持语音合成功能。");
    }
}

const init = (e) => {
    initLoadElement();
    bingEvents();
}

(function () {
    window.addEventListener("load", function () {
        loadStyle();
        this.setTimeout(() => {
            init()
        }, 300);
    })
})();












// copy 文本
const copyText = (text)=>{
    navigator.clipboard.writeText(text)  
    .then(() => {  
      console.log('文本已成功复制到剪贴板');  
    })  
    .catch(err => {  
      // 某些浏览器可能不支持或需要用户交互  
      console.error('无法复制文本: ', err);  
    });
}









// -------------------------------------
cssContent += `

#fy_loading{
    display: none;
    width: 200px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
#fy_loading svg {
    width: 2.25em;
    transform-origin: center;
    animation: rotate4 2s linear infinite;
    }

#fy_loading circle {
    fill: none;
    stroke: hsl(214, 97%, 59%);
    stroke-width: 2;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash4 1.5s ease-in-out infinite;
    }

@keyframes rotate4 {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash4 {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
    }

    100% {
        stroke-dashoffset: -125px;
    }
}



/* 滚动条整体样式 */
::-webkit-scrollbar {
    width: 6px;  /* 宽度 */
    height: 6px; /* 高度（对于垂直滚动条） */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 6px;
}

/* 滚动条滑块:hover状态样式 */
::-webkit-scrollbar-thumb:hover {
    background: #888;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
}

/* 滚动条轨道:hover状态样式 */
::-webkit-scrollbar-track:hover {
    background: #ddd;
}

/* 滚动条轨道:active状态样式 */
::-webkit-scrollbar-track-piece:active {
    background: #eee;
}

/* 滚动条:角落样式（即两个滚动条交汇处） */
::-webkit-scrollbar-corner {
    background: #535353;
}
`