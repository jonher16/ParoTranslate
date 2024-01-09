document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'q') {
        let selectedText = window.getSelection().toString();
        if (selectedText) {
            translateText(selectedText, 'ko', 'es');
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
    document.body.appendChild(popup);

    // Close the popup when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!popup.contains(event.target)) {
            popup.remove();
        }
    }, { capture: true });
}

