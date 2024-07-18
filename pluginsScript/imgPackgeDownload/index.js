// ==UserScript==
// @name         图片下载 | 页面所有图片打包下载 | 单个图片下载 | 想要哪张点哪张，简单有效
// @namespace    http://tampermonkey.net/
// @description  简单纯洁的网页图片下载小工具 | 图片打包 | 可打包页面上所有图片下载 | 可单选（Ctrl+鼠标右键）下载单个图片 |  { 功能: 1.打包所有下载 2.Ctrl+鼠标右键,下载单个 } | 没有什么花里胡哨的东西简单有效 | A tool that helps you quickly capture web images and package them for download
// @description:zh-CN  一个帮你快速捕获网页图片并打包下载、也可单选下载的小工具🔧
// @author       <shing0727@foxmail.com>
// @version      v3.4.4
// @license      GPLv3
// @icon         https://s21.ax1x.com/2024/05/14/pkmNM0s.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @match        *://*/*

// @downloadURL https://update.greasyfork.org/scripts/492706/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%7C%20%E5%8D%95%E4%B8%AA%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0%EF%BC%8C%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/492706/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%7C%20%E5%8D%95%E4%B8%AA%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%20%7C%20%E6%83%B3%E8%A6%81%E5%93%AA%E5%BC%A0%E7%82%B9%E5%93%AA%E5%BC%A0%EF%BC%8C%E7%AE%80%E5%8D%95%E6%9C%89%E6%95%88.meta.js
// ==/UserScript==

var btnStyle = `
    background-color: #fff;
    width: 90px;
    padding: 8px 0;
    border-radius: 6px;
    background: #333;
    justify-content: center;
    align-items: center;
    font-family: 'Damion', cursive;
    border: none;
    font-size: 14px;
    cursor: inherit;
    transition: 500ms;
    color: #eeeeee;
    box-shadow: 0 0 5px #444, 5px 5px 15px #222, inset 5px 5px 10px #444,inset -5px -5px 10px #222;
`;
var btn_text_style = `
    margin: 0;
    padding: 0;
    font-size: 14px;
`;
var load_tip_style = `
    position: fixed;
    width: 210px;
    padding: 12px;
    top: 20px;
    right: -220px;
    color: #333;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 5px;
    border-radius: 5px;
    transition: all 0.5s ease-in-out 0s, transform 0.5s ease-in-out 0s;
    font-family: 'Damion', cursive;
    font-weight: 600;
    z-index: 9999;
`;

var cssContent = `
#ccc_load_container{
    padding: 20px 10px 20px 7px;
    
    position: fixed;
    bottom: 10px;
    right: -100px;
    z-index: 99999;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    opacity: 0.3;
}
#right_btn{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    background-color: #000000;
    opacity: 0.3;
    height: 40%;
    width: 7px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
#right_btn:hover{
 opacity: 1;
}
// #ccc_load_container:hover{
//     right: 0;
//     opacity: 1;
// }
#flashing-div {
    opacity: 1;
    transition: all 0.8s ease-in-out, transform 0.8s ease-in-out;
    animation: flashAndScale 2.5s infinite; /* 初始状态设置为无限循环，稍后通过JavaScript控制 */
    visibility: visible; /* 初始状态为可见 */
  }
  @keyframes flashAndScale {
    0% {
      opacity: 0.9;
      box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.5);
    }
    25% {
      opacity: 1;
      box-shadow: none;
      box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.5);
    }
    50% {
      opacity: 0.9;
      box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.5);
    }
    75% {
      opacity: 1;
      box-shadow: none;
      box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.5);
    }
    100% {
      opacity: 0.9;
      box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.5);
    }
  }
  /* 添加一个类来停止动画并隐藏div（如果需要的话） */
  #flashing-div.stopped {
    animation: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0);
    transition: none;
  }

`;
// -------全局-------------
var lock = true; // 防止事件重复调用
var allLoadDOM = null; // 按钮容器-打包下载所有
var LoadTipDOM = null; // 下载提示框
// --------------------
// 初始加载样式
const loadStyle = () => {
  // 创建一个新的style元素
  var style = document.createElement("style");

  // 将CSS样式内容设置为style元素的文本内容
  if (style.styleSheet) {
    // 对于老版本的IE浏览器
    style.styleSheet.cssText = cssContent;
  } else {
    // 对于其他浏览器
    style.appendChild(document.createTextNode(cssContent));
  }
  // 将style元素添加到head中
  var head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(style);
};
/**
 * 传入配置信息创建元素并返回DOM对象
 * @param {*
 *  option { el：元素, text: 元素文本, className: 类名, prop:属性 }
 *  mountE: 挂载元素
 * }
 * @returns 创建元素
 */
const myCreateEle = (option, mountE) => {
  let e = document.createElement(option.el || "div");
  option.className && e.classList.add(option.className);
  for (let p in option.prop || {}) {
    e.setAttribute(p, option.prop[p]);
  }
  e.innerText = option.text || "";
  e.style.cssText = option.style || "";
  mountE && mountE.appendChild(e);
  return e;
};

// 创建下载提示框
const createLoadTip = () => {
  LoadTipDOM = myCreateEle(
    {
      el: "div",
      style: `${load_tip_style}`,
      text: "稍等片刻，正在打包下载...",
    },
    document.body
  );
};

// 打包下载所有图片事件
const handleDownload = () => {
  let imageUrls = [];
  document.querySelectorAll("img").forEach((item) => {
    let src = item?.src;
    if (!src) {
      src = item.getAttribute("srcset");
    }
    if (!src) return;
    imageUrls.push({
      src,
      imgName: getImageFileNameFromUrl(src) + getImageExtension(src),
    });
  });
  if (!imageUrls.length) return;
  const zip = new JSZip();
  lock = false;
  !LoadTipDOM && createLoadTip();
  LoadTipDOM.style.right = "20px";
  Promise.all(
    imageUrls.map((item, index) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: item.src,
          responseType: "blob",
          onload: function (response) {
            if (response.status === 200) {
              let blob = response.response;
              const filename = item.imgName;
              zip.file(filename, blob, { binary: true });
            } else {
              console.error("Request failed with status " + response.status);
            }
            resolve();
          },
          onerror: function (e) {
            console.error("Request failed: " + e.message);
            resolve();
          },
        });
      });
    })
  )
    .then(() => {
      let domain = window.location.href.replace(/^https?:\/\//i, "");
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, `【${document.title}】【${domain}】.zip`);
        unlock();
      });
    })
    .catch((error) => {
      unlock();
    });
};
const unlock = (delay = 500) => {
  setTimeout(() => {
    lock = true;
    allLoadDOM.style.cursor = "pointer";
    LoadTipDOM.style.right = "-220px";
  }, delay);
};
const createEle = () => {
  allLoadDOM = document.createElement("div");
  allLoadDOM.setAttribute("id", "ccc_load_container");
  if (!localStorage.getItem("IS_IMAGE_DOWNLOAD_TIP")) {
    allLoadDOM.style.right = "0";
    allLoadDOM.style.opacity = "1";
    setTimeout(() => {
      allLoadDOM.style = "";
    }, 1500);
  }
  $(allLoadDOM).append(`
    <div id="right_btn"></div>
`);
  $(allLoadDOM).append(`
        <button style="${btnStyle}"><p style="${btn_text_style}">所有图片</p><p style="${btn_text_style}">打包下载</p></button>
    `);
  document.body.appendChild(allLoadDOM);
  $("#ccc_load_container > button").click(() => {
    lock && handleDownload();
    allLoadDOM.style.cursor = "not-allowed";
  });
};

// 获取图片名称
function getImageFileNameFromUrl(url) {
  // 正则表达式匹配最后一个'/'和第一个'?'之间的内容（如果存在）
  // 或者最后一个'/'和字符串结尾之间的内容（如果不存在查询参数）
  const regex = /\/([^?\/]+?)(?:\?|$|@)/;
  const match = url.match(regex);
  if (match && match[1]) {
    // match[1] 是文件名（不包括查询参数及其后面的部分）
    return match[1];
  }
  return "default.jpg";
}

// 获取图片扩展名
function getImageExtension(url) {
  var extension = url.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif)$/i);
  if (extension) {
    return extension[0];
  } else {
    return ".jpg";
  }
}

function downloadImageData(imgSrc, imgAlt = "default") {
  let a = document.createElement("a");
  a.href = imgSrc;
  a.download = imgAlt || "image.png"; // 设置下载的图片名
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadImage(imageUrl, imageName = "image.png") {
  let url = imageUrl;
  if (url.includes("?")) {
    url = url.split("?")[0];
  }
  if (url.includes("@")) {
    url = url.split("@")[0];
  }
  if (url.includes("#")) {
    url = url.split("#")[0];
  }
  if (!url.match(/https?:\/\//)) {
    url = window.location.protocol + '//' + window.location.hostname + '/' + url
  }
  GM_xmlhttpRequest({
    method: "GET",
    url,
    responseType: "blob",
    onload: function (response) {
      if (response.status === 200) {
        let blob = response.response;

        // 创建一个Blob URL
        const url = window.URL.createObjectURL(blob);
        // 创建一个<a>标签用于下载
        const a = document.createElement("a");
        a.href = url;
        a.download = imageName; // 设置下载的文件名
        a.style.display = "none";
        // 触发点击事件
        document.body.appendChild(a);
        a.click();
        // 释放URL对象
        window.URL.revokeObjectURL(url);
        // 清理<a>标签
        document.body.removeChild(a);

      } else {
        console.error("下载图片失败，状态码为 " + response.status);
      }
    },
    onerror: function (e) {
      console.error("请求失败： " + e.message);
    },
  });
}

var allbtn = false
const initBindEvent = () => {
  document.addEventListener("contextmenu", function (event) {
    if (event.ctrlKey) {
      // 取消默认行为（阻止上下文菜单出现）
      event.preventDefault();
    }
  });
  document.addEventListener("mousedown", function (event) {
    if (event.ctrlKey && event.button === 2) {
      event.preventDefault();
      var targetElement = event.target;
      const getUrl = (dom) => {
        return dom.getAttribute("src") || dom.getAttribute("srcset") || "";
      };
      if (targetElement) {
        let url = getUrl(targetElement);
        let srcArr = [];
        if (url) {
          srcArr = [url];
        } else {
          let arrDom = targetElement.querySelectorAll("img");
          arrDom.forEach((item) => {
            srcArr.push(getUrl(item));
          });
        }
        srcArr.forEach((url) => {
          const fileName = getImageFileNameFromUrl(url);
          if (url.includes("data:image/")) {
            downloadImageData(url);
          } else {
            downloadImage(url, fileName);
          }
        });
      }
    }
  });

  $('#right_btn').click(function () {
    allbtn = !allbtn
    if (allbtn) {
      allLoadDOM.style.right = "0";
      allLoadDOM.style.opacity = "1";
    } else {
      allLoadDOM.style.right = "-100px";
      allLoadDOM.style.opacity = "0.4";
    }
  })
  $(allLoadDOM).mouseleave(function () {
    allbtn = false
    allLoadDOM.style.right = "-100px";
    allLoadDOM.style.opacity = "0.4";
  });
};
const initTip = () => {
  let tip = document.createElement("div");
  tip.style.cssText = `
        position: fixed;
        top: 3vh;
        left: 50%;
        transform: translate(-50%, 0);
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
       align-items: center;
       color: #ffffff;
       z-index: 999999;
       padding: 10px 20px;
       border-radius: 10px;
       text-align: center;
       letter-spacing: 1.5px;
    `;

  tip.innerText = "Ctrl + 🖱️鼠标右键 \n （下载选中图片～）";
  tip.setAttribute("id", "flashing-div");
  setTimeout(() => {
    tip.style.top = "-150px";
    // tip.style.display = "none";
  }, 3000);

  document.body.appendChild(tip);
};

const init = () => {
  window.addEventListener("load", function () {
    if (window.self !== window.top) return;
    createEle();
    initBindEvent();
    loadStyle();
    setTimeout(() => {
      if (!localStorage.getItem("IS_IMAGE_DOWNLOAD_TIP")) {
        localStorage.setItem("IS_IMAGE_DOWNLOAD_TIP", "1");
        // initTip();
      }
    }, 200);
  });
};
(function () {
  init();
})();
