chrome.action.onClicked.addListener(async (tab) => {
    const currentWindow = await chrome.windows.getCurrent();
    chrome.windows.update(currentWindow.id, { "alwaysOnTop": true });
  });
  