function translateText(textToTranslate, targetLanguage = 'he') {
    const url = `https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${targetLanguage}&api-version=3.0&profanityAction=NoAction&textType=plain`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '139c2e91ddmsh8a42e07204c8999p18b4c2jsnf598f9f08652',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        body: JSON.stringify([
            {
                Text: textToTranslate
            }
        ])
    };

    fetch(url, options)
        .then(response => response.json()) 
        .then(data => {
            if (data && data[0] && data[0].translations && data[0].translations.length > 0) {
                const translation = data[0].translations[0].text;
                document.getElementById('translation').value = translation;
            } else {
                console.error('Translation API returned an unexpected structure:', data);
                document.getElementById('translation').value = 'Translation error';
            }
        })
        .catch(error => {
            console.error('Error calling the translation API:', error);
            document.getElementById('translation').value = 'Translation error';
        });
}

function getSelectedText() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
        if (!currentTabId) return; 

        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            function: () => window.getSelection().toString(),
        }, (results) => {
            if (!results || results.length === 0) return; 
            const selection = results[0].result;
            document.getElementById('word').value = selection;
            document.getElementById('translation').value = translateText(selection, 'he');
        });
    });
}

    document.addEventListener('DOMContentLoaded', function () {
        getSelectedText();

        document.getElementById('saveWord').addEventListener('click', function () {
            const word = document.getElementById('word').value;
            const translation = document.getElementById('translation').value;
            const saveDate = new Date().toLocaleDateString(); // Format date as needed

            // Retrieve both current words and history, add to them, then save
            chrome.storage.local.get({ words: [], history: [] }, function (result) {
                const newEntry = { word, translation, saveDate };

                result.words.push(newEntry); // Add to current words list
                result.history.push(newEntry); // Also add to history

                chrome.storage.local.set({ words: result.words, history: result.history }, function () {
                    console.log('Word saved and added to history.');
                    // Optionally, close the popup or provide user feedback
                });
            });
        });

        document.getElementById('saveWord').addEventListener('click', function () {
            const word = document.getElementById('word').value;
            const translation = document.getElementById('translation').value;
            const saveDate = new Date().toLocaleDateString(); // Get the current date in local format

            // Retrieve the existing saved words, add the new one, then save back to storage
            chrome.storage.local.get({ words: [] }, function (result) {
                const savedWords = result.words;
                savedWords.push({ word, translation, saveDate }); // Add new word with its translation and save date
                chrome.storage.local.set({ words: savedWords }, function () {
                    console.log('Word saved with translation and date.');
                    window.close();
                });
            });
        });
    
    document.getElementById('showSavedWords').addEventListener('click', function () {
        chrome.tabs.create({ url: 'savedWords.html' }); // Assumes you have a savedWords.html file
    });
    
    // Call loadSavedWords to display saved words on popup load
    //loadSavedWords();
});
/*
document.addEventListener('DOMContentLoaded', function () {
    getSelectedText();
    document.getElementById('saveWord').addEventListener('click', function () {
        const word = document.getElementById('word').value;
        const translation = document.getElementById('translation').value;
        // Save the word and translation in storage
        chrome.storage.local.get({ words: {} }, function (items) {
            items.words[word] = translation;
            chrome.storage.local.set({ words: items.words }, function () {
                console.log('Word saved.');
                // Optionally, refresh the list of saved words.
            });
        });
    });

    document.getElementById('saveWord').addEventListener('click', function () {
        const word = document.getElementById('word').value;
        const translation = document.getElementById('translation').value;
        const saveDate = new Date().toLocaleDateString(); // Get the current date in local format

        // Retrieve the existing saved words, add the new one, then save back to storage
        chrome.storage.local.get({ words: [] }, function (result) {
            const savedWords = result.words;
            savedWords.push({ word, translation, saveDate }); // Add new word with its translation and save date
            chrome.storage.local.set({ words: savedWords }, function () {
                console.log('Word saved with translation and date.');
                window.close();
            });
        });
    });
    */