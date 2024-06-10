chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'copyToClipboard') {
    console.log('Copying to clipboard:', message.data);
    navigator.clipboard.writeText(message.data).then(() => {
      console.log('Successfully copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }
});
