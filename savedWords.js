document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get({ words: [] }, function (result) {
        const wordsList = document.getElementById('wordsList');
        result.words.forEach((wordObj, index) => {
            const entry = document.createElement('div');
            entry.className = 'word-entry'; // Add a class for styling
            //entry.innerHTML = `<p><span class="word">${wordObj.word}</span> - <span class="translation">${wordObj.translation}</span> - <span class="date">${wordObj.saveDate}</span><button class="delete-btn" data-index="${index}">V</button></p>`;
            entry.innerHTML = `<p><span class="date">${wordObj.saveDate}</span> - <span class="word">${wordObj.word}</span> - <span class="translation">${wordObj.translation}  </span><button class="practice-btn" data-index="${index}">Practice</button><button class="delete-btn" data-index="${index}">V</button></p>`;
            wordsList.appendChild(entry);
        });

        // Add click event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                // Get the index of the word to be deleted
                const indexToDelete = parseInt(this.getAttribute('data-index'));
                // Remove the word from the array and update local storage
                result.words.splice(indexToDelete, 1);
                chrome.storage.local.set({ words: result.words }, function () {
                    wordsList.removeChild(wordsList.children[indexToDelete]);
                });
            });
        });

        document.querySelectorAll('.practice-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const entry = document.querySelectorAll('.word-entry')[index];
                const translation = entry.querySelector('.translation');
                // Toggle translation visibility
                translation.style.display = translation.style.display === 'none' ? '' : 'none';
                // Toggle button color
                this.classList.toggle('practice-active');
            });
        });
    });

    document.getElementById('viewHistory').addEventListener('click', function () {
        chrome.tabs.create({ url: 'history.html' });
    });
});