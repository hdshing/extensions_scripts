document.addEventListener('DOMContentLoaded', function() {
    const makeTopMostButton = document.getElementById('makeTopMost');
    makeTopMostButton.addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'makeTopMost' });
    });
  });
  