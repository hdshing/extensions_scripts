chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 200,
      height: 200,
      focused: true,
      top: 0,
      left: 0,
      alwaysOnTop: true
    });
  });
  