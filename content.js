document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'q') {
        let selectedText = window.getSelection().toString();
        if (selectedText) {
            translateText(selectedText, 'ko', 'en');
        }
    }
});

function translateText(text, sourceLang, targetLang) {
    // Construct the URL for the MyMemory API
    const endpoint = 'https://api.mymemory.translated.net/get';
    const url = new URL(endpoint);
    url.searchParams.append('q', text);
    url.searchParams.append('langpair', `${sourceLang}|${targetLang}`);
    url.searchParams.append('mt', '1'); // 1 to enable machine translation, 0 to disable

    // Use fetch with the constructed URL
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming the API response format is as expected
            const translatedText = data.responseData.translatedText;
            showTranslationPopup(text, translatedText);
            console.log(translatedText); // Logging the translated text to the console
        })
        .catch(error => console.error('Error:', error));
}


function showTranslationPopup(originalText, translatedText) {
    const popup = document.createElement('div');
    popup.id = 'translation-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '10000';
    popup.innerHTML = `
        <div id="original-text" style="margin-bottom: 10px;"><strong>Original:</strong> ${originalText}</div>
        <div id="translated-text" style="margin-bottom: 10px;"><strong>Translated:</strong> ${translatedText}</div>
    `;

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.style.backgroundColor = '#5c6bc0'; // Set the background color
    saveButton.style.color = 'white'; // Set the text color
    saveButton.style.border = 'none'; // Remove the border
    saveButton.style.padding = '10px 20px'; // Add some padding
    saveButton.style.borderRadius = '5px'; // Round the corners
    saveButton.style.cursor = 'pointer'; // Change cursor on hover
    saveButton.style.marginTop = '10px'; // Add margin on the top
    saveButton.style.fontSize = '14px'; // Set font size
    saveButton.onmouseover = function() {
        this.style.backgroundColor = '#3f51b5'; // Lighten the color on hover
    };
    saveButton.onmouseout = function() {
        this.style.backgroundColor = '#5c6bc0'; // Return to original color
    };
    saveButton.onclick = function() {
        saveTranslation(originalText, translatedText);
        popup.remove();
    };
    popup.appendChild(saveButton);



    document.body.appendChild(popup);

    // Close the popup when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!popup.contains(event.target)) {
            popup.remove();
        }
    }, { capture: true });
}

// Send a message to the background script to save data
function saveTranslation(originalText, translatedText) {
    chrome.runtime.sendMessage({
        action: "saveTranslation",
        data: { originalText, translatedText }
    });
    console.log("Saving translation");
}


function downloadTranslations() {
    chrome.storage.local.get({ translations: [] }, function(result) {
        const translations = result.translations;
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Texto Original,Traducción\n'; // Encabezados del CSV

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
