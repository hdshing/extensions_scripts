// ==UserScript==
// @name         悬浮窗口
// @namespace    http://tampermonkey.net/
// @version      2024-04-20
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zcmkeji.com
// @match        http*://*.csdn.net/*
// @grant        none
// ==/UserScript==

(function () {

    // 创建一个新的style元素
    var style = document.createElement('style');
    // 定义CSS样式内容
    var cssContent = `
            #mainDiv{
                padding: 0;
                margin: 0;
                border: 0;
                position: fixed;
                // top: 100%;
                // left: 100%;
                // transform: translate(-100%, -100%);
                bottom: 0;
                right: 0;
                width: 300px;
                height: 200px;
                z-index: 99999;
                border-radius: 4px;
                cursor: move;
                // overflow: hidden;
                background-color: rgba(0, 0, 0, 0.8);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                transition: padding 0.3s ease;
                // opacity: 0;
            }
            #mainDiv:hover{
                // padding-top: 15px;
            }
            #videoIframe{
                width: 100%;
                height: 100%;
                border: 0;
            }
            #ctrlDiv{
                width: 100%;
                height: 26px;
                display: flex;
                position: absolute;
                left: 0;
                top: 0;
                background-color: rgba(255, 255, 255, 1);
                transform: translate(0, -100%);
                opacity: 0;
                transition: all 0.3s ease;
                justify-content: end;
                align-items: center;

                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
            #mainDiv:hover #ctrlDiv{
                opacity: 1;
                box-shadow: 0 -2px 5px rgba(200, 200, 200, 0.2);
            }
            .btn_item{
                display: inline-flex;
                align-items: center;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
                color: #333;
                padding: 0 10px;
                height: 100%;
                margin-left: 4px;
                border-radius: 4px;
                color: #00AEEC;
            }
            .btn_item:hover{
                cursor: pointer;
                background-color: #00AEEC;
                color: #fff;
            }
        `;

    // 将CSS样式内容设置为style元素的文本内容
    if (style.styleSheet) {
        // 对于老版本的IE浏览器
        style.styleSheet.cssText = cssContent;
    } else {
        // 对于其他浏览器
        style.appendChild(document.createTextNode(cssContent));
    }

    // 将style元素添加到head中
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(style);

    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('id', 'mainDiv');

    // 创建iframe元素
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'videoIframe')
    iframe.src = 'https://code.juejin.cn/'; // 替换为你的iframe页面的URL

    document.body.appendChild(mainDiv);
    mainDiv.append(iframe)


    let ctrlDiv = document.createElement('div')
    ctrlDiv.setAttribute('id', 'ctrlDiv')
    mainDiv.appendChild(ctrlDiv);


    // 按钮配置
    const btnOptions = [
        {
            text: '设置',
            className: 'btn_item'
        },
        {
            text: '关闭',
            className: 'btn_item'
        }
    ]
    // 创建元素
    const createE = (option) => {
        let e = document.createElement(option.el || 'div')
        e.classList.add(option.className)
        e.innerText = option.text
        return e
    }
    btnOptions.forEach(option => {
        ctrlDiv.appendChild(createE(option))
    })





    // 获取可拖动的元素
    var draggable = document.getElementById('mainDiv');
    // 鼠标按下时的位置
    var startX, startY;

    // 鼠标按下时的处理函数
    draggable.onmousedown = function (e) {
        // 阻止默认行为（例如，防止选择文本）
        e.preventDefault();

        // 获取鼠标相对于元素的位置
        startX = e.clientX - draggable.getBoundingClientRect().left;
        startY = e.clientY - draggable.getBoundingClientRect().top;

        // 当鼠标移动时，更新元素的位置
        document.onmousemove = function (e) {
            var x = e.clientX - startX;
            var y = e.clientY - startY;

            // 更新元素的位置
            draggable.style.left = x + 'px';
            draggable.style.top = y + 'px';
        };

        // 当鼠标松开时，移除鼠标移动事件的监听器
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };


})();