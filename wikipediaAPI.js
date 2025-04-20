async function searchWikipedia(query) {
    try {
        // Thử tìm kiếm trực tiếp trước
        let response = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        let data = await response.json();
        
        // Nếu không tìm thấy kết quả trực tiếp, thử tìm kiếm với API opensearch
        if (!data.extract || response.status === 404) {
            response = await fetch(`https://vi.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(query)}&limit=1&namespace=0&origin=*`);
            data = await response.json();
            
            if (data[1] && data[1].length > 0) {
                // Lấy kết quả đầu tiên và tìm thông tin chi tiết
                const title = data[1][0];
                response = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                data = await response.json();
                return data.extract || 'Không tìm thấy thông tin chi tiết về chủ đề này.';
            }
        } else {
            return data.extract;
        }
        
        return 'Không tìm thấy thông tin về chủ đề này.';
    } catch (error) {
        console.error('Lỗi khi tìm kiếm Wikipedia:', error);
        return 'Xin lỗi, có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.';
    }
}

export { searchWikipedia };
