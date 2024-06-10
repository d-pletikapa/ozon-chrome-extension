console.log('Background competetive-position-extractor script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.action === 'copyToClipboard') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (data) => {
          const textArea = document.createElement('textarea');
          textArea.value = data;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            console.log('Successfully copied to clipboard');
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
          }
          document.body.removeChild(textArea);
        },
        args: [message.data]
      });
    });
  }
});
