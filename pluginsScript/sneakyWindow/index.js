// ==UserScript==
// @name         悬浮窗口
// @namespace    http://tampermonkey.net/
// @version      2024-04-20
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zcmkeji.com
// @match        http*://*.csdn.net/*
// @match        http*://localhost:81/*
// @grant        none
// ==/UserScript==



// 样式内容
var cssContent = `
#mainId{
    padding: 0;
    margin: 0;
    border: 0;
    position: fixed;
    // top: 100%;
    // left: 100%;
    // transform: translate(-100%, -100%);
    bottom: 0;
    right: 0;
    width: 400px;
    height: 300px;
    z-index: 99999;
    border-radius: 4px;
    // overflow: hidden;
    // background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: padding 0.3s ease;
    // opacity: 0;
}
#mainId:hover{
    // padding-top: 15px;
}
#iframeContainerId{
    width: 100%;
    height: 100%;
}
#iframeId{
    width: 100%;
    height: 100%;
    border: 0;
    // background-color: #00AEEC;
    background-color: #999;
}
#ctrlId{
    width: 100%;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 1);
    transform: translate(0, -100%);
    opacity: 1;
    transition: all 0.3s ease;
    // justify-content: end;
    align-items: center;
    cursor: move;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
#mainId:hover #ctrlId{
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

#dirBox{
    position: relative;
    background-color: rgb(236, 239, 247);
    width: 74%;
    height: 30px;
    border-radius: 20px;
}
// #urlInput{
//     width: 100%;
//     line-height: 30px;
//     padding: 0 14px;
//     background-color: transparent;
//     border: 0;
// }
// #urlInput:focus-visible{
//     outline: none;
//     border: 0;
// }
`;



var CURR_TIME = new Date().getTime(); // 当前时间戳
var IFRAME_SRC = 'https://translate.google.com.hk/' // iframe url
var mainDOM = null; // 主容器
var iframeContainerDOM = null; // iframe外层框
var iframeDOM = null; // 内置iframe窗口
var ctrlDOM = null; // 顶部控制栏
var maskDOM = null; // 遮罩
var rightBorderDOM = null; // 右边框
var leftBorderDOM = null; // 左边框
var LB_AngleDOM = null; // 左下角


// 初始加载样式
const loadStyle = () => {
    // 创建一个新的style元素
    var style = document.createElement('style');

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
}

// 初始创建布局
const createLayout = () => {
    mainDOM = myCreateEle({ prop: { id: 'mainId' } }, document.body)
    iframeContainerDOM = myCreateEle({ prop: { id: 'iframeContainerId' } }, mainDOM)
    iframeDOM = myCreateEle({ el: 'iframe', prop: { id: 'iframeId', src: IFRAME_SRC } }, iframeContainerDOM)
    ctrlDOM = myCreateEle({ prop: { id: 'ctrlId' } }, mainDOM)

    let dirBoxDOM = myCreateEle({ el: 'div', prop: { id: 'dirBox' } }, ctrlDOM)
    let inputDOM = myCreateEle({ el: 'input', prop: { type: 'text', id:'urlInput' } }, dirBoxDOM)

    // 按钮配置
    const btnOptions = [
        { text: '刷新', className: 'btn_item', prop: { id: 'refreshBtnId' } },
        { text: '设置', className: 'btn_item', prop: { id: 'setBtnId' } },
        { text: '关闭', className: 'btn_item', prop: { id: 'closeBtnId' } }
    ]
    // 创建按钮
    btnOptions.forEach(item => myCreateEle(item, ctrlDOM))



    maskDOM = myCreateEle({ style: 'width: 100%; height: 100%; background-color: transparent; position: absolute; top: 0px; left: 0; display: none;', prop: { id: 'maskId' } }, mainDOM)

    rightBorderDOM = myCreateEle({ style: 'width: 3px; height: 100%; position: absolute; top:0; right: 0; cursor: ew-resize;', className: 'moveborder', prop: { position: 'r' } }, mainDOM)
    leftBorderDOM = myCreateEle({ style: 'width: 3px; height: 100%; position: absolute; top:0; left: 0; cursor: ew-resize;', className: 'moveborder', prop: { position: 'l' } }, mainDOM)
    LB_AngleDOM = myCreateEle({ style: 'width: 6px; height: 6px;position: absolute; bottom:0; left: 0; cursor: ne-resize;', className: 'moveborder', prop: { position: 'lb' } }, mainDOM)
}
/**
 * 传入配置信息创建元素并返回DOM对象
 * @param {*
 *  option { el：元素, text: 元素文本, className: 类名, prop:属性 }
 *  mountE: 挂载元素
 * }
 * @returns 创建元素
 */
const myCreateEle = (option, mountE) => {
    let e = document.createElement(option.el || 'div')
    option.className && e.classList.add(option.className)
    for (let p in (option.prop || {})) {
        e.setAttribute(p, option.prop[p])
    }
    e.innerText = option.text || ''
    e.style.cssText = option.style || ''
    mountE && mountE.appendChild(e)
    return e
}

// 传url跳转，无参刷新
const onRefresh = (url = IFRAME_SRC) => {
    console.log('onRefresh', url)
    url === IFRAME_SRC && (iframeDOM.src = 'about:blank')
    IFRAME_SRC = url
    iframeDOM.src = IFRAME_SRC
}



// 拖动窗口函数
const initBindEvent = () => {

    // 鼠标按下时的位置
    var startX, startY;
    var isMove = false

    var isResizing = false
    var mainCurrWidth;
    var mainCurrHeight;
    var selectedBorder;


    // 鼠标按下指定可拖动的DOM时的处理函数
    ctrlDOM.addEventListener('mousedown', (e) => {
        isMove = true
        // 阻止默认行为（例如，防止选择文本）
        e.preventDefault();
        // 获取鼠标相对于元素的位置
        startX = e.clientX - mainDOM.getBoundingClientRect().left;
        startY = e.clientY - mainDOM.getBoundingClientRect().top;
        // 显示蒙版--主要为了遮挡iframe，解决拖动bug
    })
    let bElements = document.querySelectorAll('.moveborder')
    bElements.forEach(itemDom => {
        itemDom.addEventListener('mousedown', (e) => {
            isResizing = true;
            selectedBorder = e.target.getAttribute('position')
            mainCurrWidth = mainDOM.offsetWidth;
            mainCurrHeight = mainDOM.offsetHeight;
            maskDOM.style.display = 'block';

            let rect = mainDOM.getBoundingClientRect()
            console.log('selectedBorder ==== ', selectedBorder)
            console.log('rect ==== ', rect, window.innerWidth - rect.right)
            console.log('mainDOM.offsetLeft ====', mainDOM.offsetLeft)
            console.log('==================================== ')


            startX = e.pageX; // 使用 pageX 以获取相对于文档的位置
            startY = e.pageY; // 使用 pageY 以获取相对于文档的位置
            if (selectedBorder == 'l' || selectedBorder == 'lb') {
                mainDOM.style.left = "auto"
                // let rightval = window.innerWidth - rect.right < 0 ? 
                // mainDOM.style.right = Math.max(0, (window.innerWidth - rect.right)) +'px'
                let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                mainDOM.style.right = (window.innerWidth - rect.right - scrollBarWidth) + 'px'
            }
            if (selectedBorder == 'r') {
                mainDOM.style.left = rect.left + 'px'
                mainDOM.style.right = "auto"
            }

        });
    })

    // 当鼠标移动时
    window.addEventListener('mousemove', (e) => {
        if (!isMove && !isResizing) return;

        // 阻止选择文本
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome, Safari, Firefox
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
        // 防止默认的拖动选择文本行为
        e.preventDefault();

        if (isMove) {
            var x = e.clientX - startX;
            var y = e.clientY - startY;
            // 更新元素的位置
            mainDOM.style.left = x + 'px';
            mainDOM.style.top = y + 'px';
        }

        if (isResizing) {
            // 计算新的宽度
            let newWidth = mainCurrWidth;
            if (selectedBorder == 'l' || selectedBorder == 'lb') {
                newWidth = mainCurrWidth + (startX - e.pageX)
            }
            if (selectedBorder == 'r') {
                newWidth = mainCurrWidth + (e.pageX - startX)
            }

            // 考虑边界情况
            const minWidth = 10; // 设置最小宽度
            // const maxWidth = window.innerWidth - mainDOM.offsetLeft - 10; // 考虑左边距和拖动条宽度
            const maxWidth = window.innerWidth - 10; // 考虑左边距和拖动条宽度
            const newValidWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

            // 应用新的宽度
            mainDOM.style.width = `${newValidWidth}px`;

            // 更新当前宽度和起始点，以便下一次计算
            mainCurrWidth = newValidWidth;
            startX = e.pageX;

            // 改变高度的情况
            if (selectedBorder == 'lb') {
                let newHeight = mainCurrHeight + (e.pageY - startY)
                const newValidWidth = Math.max(10, newHeight);
                mainDOM.style.height = `${newValidWidth}px`;
                mainCurrHeight = newValidWidth
                startY = e.pageY
            }
        }

    })
    // 当鼠标松开时
    window.addEventListener('mouseup', () => {
        // 关闭可移动
        isMove = false;
        // 关闭拖动改变窗口大小
        isResizing = false;
        // 蒙版
        maskDOM.style.display = 'none';
    });
    // 鼠标离开浏览器窗口时
    document.addEventListener('mouseleave', (e) => {
        isResizing = false;
    });

    // 监听键盘上的所有按键按下事件  
    document.addEventListener('keydown', function (event) {
        console.log('按键:', event.key); // 推荐使用  
        if (event.altKey && ['h', 'H'].includes(event.key)) {
            mainDOM.style.display = mainDOM.style.display === 'none' ? 'block' : 'none';
        }
        if (event.altKey && ['s', 'S'].includes(event.key)) {
            mainDOM.style.display = 'block';
        }
    });

    // 设置按钮点击事件
    setBtnId.addEventListener('click', (e) => {
    })

    // 设置按钮点击事件
    closeBtnId.addEventListener('click', (e) => {
        document.body.removeChild(mainDOM)
    })

    // 绑定刷新按钮事件
    refreshBtnId.addEventListener('click', (e) => {
        onRefresh()
    })

}


const main = () => {
    // window.self !== window.top 则当前窗口是嵌入在另一个窗口或iframe中的
    if (window.self !== window.top) return;
    loadStyle();
    createLayout();
    initBindEvent();
}


(function () {
    main();
})();