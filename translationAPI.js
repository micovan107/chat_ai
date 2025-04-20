// Hàm dịch văn bản
async function translateText(text, targetLang) {
    // Xử lý ngôn ngữ đích
    targetLang = targetLang.toLowerCase();
    const langMap = {
        'anh': 'en',
        'pháp': 'fr',
        'đức': 'de',
        'nhật': 'ja',
        'hàn': 'ko',
        'trung': 'zh'
    };

    const lang = langMap[targetLang] || targetLang;

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error('Lỗi khi dịch:', error);
        return 'Xin lỗi, có lỗi xảy ra khi dịch. Vui lòng thử lại sau.';
    }
}

export { translateText };