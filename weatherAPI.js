// Hàm chuyển đổi địa điểm thành tọa độ sử dụng Geocoding API
async function getCoordinates(location) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=vi`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude,
                name: data.results[0].name
            };
        }
        return null;
    } catch (error) {
        console.error('Lỗi khi lấy tọa độ:', error);
        return null;
    }
}

// Hàm phân tích thời gian từ câu hỏi
function parseTime(timeStr) {
    const now = new Date();
    timeStr = timeStr.toLowerCase();

    if (timeStr.includes('hôm nay')) {
        return now;
    } else if (timeStr.includes('ngày mai')) {
        now.setDate(now.getDate() + 1);
        return now;
    } else if (timeStr.includes('tuần sau')) {
        now.setDate(now.getDate() + 7);
        return now;
    }
    return now; // Mặc định là thời tiết hiện tại
}

// Hàm lấy dữ liệu thời tiết từ Open-Meteo API
async function getWeather(location, timeStr) {
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
        return `Xin lỗi, không tìm thấy địa điểm "${location}"`;
    }

    const time = parseTime(timeStr);
    const dateStr = time.toISOString().split('T')[0];

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${coordinates.latitude}&` +
            `longitude=${coordinates.longitude}&` +
            `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&` +
            `timezone=auto&` +
            `start_date=${dateStr}&` +
            `end_date=${dateStr}`
        );
        const data = await response.json();

        // Lấy dữ liệu thời tiết
        const maxTemp = data.daily.temperature_2m_max[0];
        const minTemp = data.daily.temperature_2m_min[0];
        const precip = data.daily.precipitation_sum[0];
        const precipProb = data.daily.precipitation_probability_max[0];

        // Tạo thông báo thời tiết
        let message = `Thời tiết ${coordinates.name} ${timeStr}:\n`;
        message += `Nhiệt độ: ${minTemp}°C - ${maxTemp}°C\n`;
        message += `Lượng mưa: ${precip}mm\n`;
        message += `Xác suất mưa: ${precipProb}%`;

        return message;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thời tiết:', error);
        return 'Xin lỗi, có lỗi xảy ra khi lấy dữ liệu thời tiết.';
    }
}

export { getWeather };