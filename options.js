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

        translations.forEach(translation => {
            const translationElement = document.createElement('div');
            translationElement.classList.add('translation-history-item');
            translationElement.textContent = `${translation.originalText}\n${translation.translatedText}`;
            historyContainer.appendChild(translationElement);
        });
    });
}

// Call the function when the DOM content has been loaded
document.addEventListener('DOMContentLoaded', loadTranslationHistory);

