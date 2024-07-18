// ==UserScript==
// @name         免登录复制(CSDN、jb51、51cto)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       shing <shing_hd@outlook.com>
// @match        http*://*.csdn.net/*
// @match        http*://*.jb51.net/*
// @match        http*://*.51cto.com/*
// @icon         https://profile-avatar.csdnimg.cn/627f48ad0ed749b681f42c9319c6f801_csdnnews.jpg
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
(function() {
    'use strict';

    //优化登陆后复制
    $('code').css({'user-select':'unset'});
    $('#content_views pre').css({'user-select':'unset'});
    $('#content_views').css({'user-select':'unset'});
    //删除下载的链接
    $("div[data-url^='https://download']").remove();

    //jb51.net
    $('.jb51code').css({'user-select':'unset'});
    $('.jb51code').css({'-webkit-user-select':'unset'});

    //移除“登陆后复制”按钮
    $('.hljs-button').remove();
    //移除readmore按钮，并显示全文
    $('.look-more-preCode').click();
    $('.hide-article-box').remove();
    $('.article_content').css({'height':'initial'})

    //去除复制后的copyright小尾巴
    document.querySelectorAll('*').forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    })
})();

