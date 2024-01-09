// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveTranslation") {
        // Perform the storage operation
        const { originalText, translatedText } = request.data;
        chrome.storage.local.get({ translations: [] }, function(result) {
            const translations = result.translations;
            translations.push({ originalText, translatedText });
            chrome.storage.local.set({ translations: translations }, function() {
                console.log('Translation saved');
            });
        });
    }
});
