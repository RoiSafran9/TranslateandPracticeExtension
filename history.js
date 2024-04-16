document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get({ history: [] }, function (result) {
        const historyList = document.getElementById('wordsList');
        result.history.forEach((entry, index) => {
            // Create each entry with a delete button
            const wordEntry = document.createElement('div');
            wordEntry.innerHTML = `<span class="date">${entry.saveDate}</span> - <span class="word">${entry.word}</span> - <span class="translation">${entry.translation}</span> <button class="delete-history-btn" data-index="${index}">X</button>`;
            historyList.appendChild(wordEntry);
        });

        // After all entries have been added, add event listeners to delete buttons
        // Moved inside the chrome.storage.local.get callback to ensure 'result' is accessible
        document.querySelectorAll('.delete-history-btn').forEach(button => {
            button.addEventListener('click', function () {
                const indexToDelete = parseInt(this.getAttribute('data-index'));
                const confirmDeletion = confirm("Are you sure you want to delete this word from history?");
                if (confirmDeletion) {
                    result.history.splice(indexToDelete, 1); // Remove the entry from history
                    chrome.storage.local.set({ history: result.history }, function () {
                        // Reload or dynamically update the list to reflect the change
                        location.reload(); // Simplest approach for refreshing the displayed list
                    });
                }
            });
        });
    });
});

