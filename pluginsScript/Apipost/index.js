// ==UserScript==
// @name         Apipost开发预览
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  try to take over the world!
// @author       You
// @match        https://console-docs.apipost.cn/preview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apipost.cn
// @grant        none
// ==/UserScript==

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


var pre_window = null;
var move_b = null;
const set = () => {

    let targetParentDOM = document.querySelector('#doc-anchor-response-200-成功').nextElementSibling
    targetParentDOM.style.position = 'relative';
    let target = targetParentDOM.children[0]
    target.style.maxHeight = 'none';

    pre_window = target.querySelector('pre')
    pre_window.style.maxHeight = 'none';

    move_b = myCreateEle({ style: 'width: 100%; height: 6px; position: absolute; bottom: 0; left: 0; cursor: s-resize; background-color: rgba(255, 255, 255, 0.2);' }, targetParentDOM)
    
    let json_content = target.querySelector('.apipost-json-content')
    let fullBtn = myCreateEle({ className: 'apipost-json-copy', text: '全展' }, json_content)

    
    fullBtn.onclick = (e)=>{
        let h = pre_window.querySelector('ul').offsetHeight
        pre_window.style.height = `${h+70}px`;
    }
}


// 拖动窗口函数
const initBindEvent = () => {

    // 鼠标按下时的位置
    var startX, startY;
    var isMove = false;
    var currPerHeight;
    move_b.addEventListener('mousedown',(e)=>{
        isMove = true;
        e.preventDefault();
        startX = e.pageX;
        startY = e.pageY;
        currPerHeight = pre_window.offsetHeight;
    })
    window.addEventListener('mousemove', e=>{
        if(!isMove)return
        e.preventDefault();
        let newHeight = currPerHeight + (e.pageY - startY);
        newHeight = Math.max(newHeight, 100);
        pre_window.style.height = `${newHeight}px`;
    })
    window.addEventListener('mouseup', e=>{
        isMove = false
    })

}


(function () {
    'use strict';
    setTimeout(() => {
        set()
        initBindEvent()
    }, 1000);
})();