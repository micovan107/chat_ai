async function searchWikipedia(query, detailed = false) {
    try {
        // Thử tìm kiếm trực tiếp trước
        let response = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        let data = await response.json();
        
        if (data.extract) {
            if (!detailed) {
                // Trả về bản tóm tắt ngắn gọn và câu hỏi
                return {
                    summary: data.extract.split('.')[0] + '.',
                    hasMore: true,
                    query: query
                };
            } else {
                // Trả về thông tin chi tiết
                return {
                    summary: data.extract,
                    hasMore: false
                };
            }
        }

        // Nếu không tìm thấy, thử tìm kiếm với API opensearch
        response = await fetch(`https://vi.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(query)}&limit=1&namespace=0&origin=*`);
        data = await response.json();

        if (data[1] && data[1].length > 0) {
            const title = data[1][0];
            try {
                const summaryResponse = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                const summaryData = await summaryResponse.json();
                if (summaryData.extract) {
                    if (!detailed) {
                        return {
                            summary: summaryData.extract.split('.')[0] + '.',
                            hasMore: true,
                            query: title
                        };
                    } else {
                        return {
                            summary: summaryData.extract,
                            hasMore: false
                        };
                    }
                }
            } catch (err) {
                console.error(`Lỗi khi lấy thông tin chi tiết cho ${title}:`, err);
            }
        }
        
        return {
            summary: 'Không tìm thấy thông tin về chủ đề này. Bạn có thể thử tìm kiếm với từ khóa khác.',
            hasMore: false
        };
    } catch (error) {
        console.error('Lỗi khi tìm kiếm Wikipedia:', error);
        return {
            summary: 'Xin lỗi, có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.',
            hasMore: false
        };
    }
}

// Hàm tìm kiếm nâng cao với nhiều tùy chọn hơn
async function advancedSearch(query, options = {}) {
    const {
        limit = 5,
        language = 'vi',
        format = 'json',
        namespace = 0
    } = options;

    try {
        const baseUrl = `https://${language}.wikipedia.org/w/api.php`;
        const searchUrl = `${baseUrl}?action=query&format=${format}&generator=search&gsrnamespace=${namespace}&gsrlimit=${limit}&gsrsearch=${encodeURIComponent(query)}&prop=extracts|info&exintro&explaintext&inprop=url&origin=*`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.query && data.query.pages) {
            const results = Object.values(data.query.pages)
                .map(page => ({
                    title: page.title,
                    extract: page.extract,
                    url: page.fullurl
                }));

            return results.map(result => 
                `${result.title}:\n${result.extract}\nĐọc thêm: ${result.url}`
            ).join('\n\n');
        }

        return 'Không tìm thấy kết quả nào phù hợp.';
    } catch (error) {
        console.error('Lỗi khi tìm kiếm nâng cao:', error);
        return 'Xin lỗi, có lỗi xảy ra trong quá trình tìm kiếm nâng cao.';
    }
}

export { searchWikipedia, advancedSearch };
