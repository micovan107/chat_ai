async function searchWikipedia(query) {
    try {
        const response = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.extract || 'Không tìm thấy thông tin về chủ đề này.';
    } catch (error) {
        return 'Xin lỗi, có lỗi xảy ra khi tìm kiếm.';
    }
}

export { searchWikipedia };