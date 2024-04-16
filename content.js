document.addEventListener('mouseup', function (e) {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage({ method: "storeSelectedText", text: selectedText });
    }
});
