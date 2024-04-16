let selectedText = '';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method === "storeSelectedText") {
        selectedText = request.text;
    } else if (request.method === "getSelectedText") {
        sendResponse({ text: selectedText });
    }
});
