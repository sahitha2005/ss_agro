// frontend/js/translator.js
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en', // Your website's base language
        
        // This line restricts the dropdown to specific languages.
        // en = English, ta = Tamil, te = Telugu, hi = Hindi, kn = Kannada, ml = Malayalam
        includedLanguages: 'en,ta,te,hi,kn,ml', 
        
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}
