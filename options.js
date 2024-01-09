// options.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('download-csv').addEventListener('click', downloadTranslations);
});

function downloadTranslations() {
    chrome.storage.local.get({ translations: [] }, function(result) {
        const translations = result.translations;
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Original,Translation\n'; // Encabezados del CSV

        // Agregar cada traducción al contenido CSV
        translations.forEach(function(rowArray) {
            let row = `${rowArray.originalText},${rowArray.translatedText}`;
            csvContent += row + '\n';
        });

        // Crear un enlace para descargar el CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'translations.csv');
        document.body.appendChild(link);

        // Descargar el archivo CSV
        link.click();
    });
}

// Inside popup.js
function loadTranslationHistory() {
    chrome.storage.local.get(['translations'], function(result) {
        const historyContainer = document.getElementById('translation-history');
        const translations = result.translations || [];

        historyContainer.innerHTML = ''; // Clear existing entries

        translations.forEach((translation, index) => {
            const translationElement = document.createElement('div');
            translationElement.classList.add('translation-history-item');
        
            const originalTextLabel = document.createElement('strong');
            originalTextLabel.textContent = 'Original: ';
        
            const originalTextSpan = document.createElement('span');
            originalTextSpan.textContent = `${translation.originalText}\n`;
            
            const lineBreak = document.createElement('br');
            const lineBreak2 = document.createElement('br');

            const translatedTextLabel = document.createElement('strong');
            translatedTextLabel.textContent = 'Translation: ';
        
            const translatedTextSpan = document.createElement('span');
            translatedTextSpan.textContent = translation.translatedText;
        
            // Append the labels and spans to the translation element
            translationElement.appendChild(originalTextLabel);
            translationElement.appendChild(originalTextSpan);
            translationElement.appendChild(lineBreak);
            translationElement.appendChild(lineBreak2);
            translationElement.appendChild(translatedTextLabel);
            translationElement.appendChild(translatedTextSpan);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = function() {
                removeTranslation(index);
            };
            translationElement.appendChild(deleteButton);

            historyContainer.appendChild(translationElement);
        });
    });
}

function removeTranslation(index) {
    chrome.storage.local.get(['translations'], function(result) {
        let translations = result.translations || [];
        translations.splice(index, 1); // Remove the item at the specific index
        chrome.storage.local.set({ translations: translations }, function() {
            loadTranslationHistory(); // Reload the history to reflect changes
        });
    });
}


// Call the function when the DOM content has been loaded
document.addEventListener('DOMContentLoaded', loadTranslationHistory);

