chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.subject == 'count') chrome.runtime.sendMessage({count: msg.count});
});