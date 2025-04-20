// Khởi tạo math.js
let math;

// Hàm khởi tạo math.js
async function initMath() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js';
    script.async = true;
    
    await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
    
    math = window.math;
}

// Khởi tạo math.js khi module được load
initMath();

function evaluateMathExpression(expression) {
    try {
        if (!math) {
            throw new Error('Math.js chưa được khởi tạo');
        }
        
        // Loại bỏ các ký tự không an toàn, cho phép dấu ^ cho phép lũy thừa
        expression = expression.replace(/[^-()/+*^.,0-9\s]/g, '');
        
        // Tính toán biểu thức
        const result = math.evaluate(expression);
        
        // Làm tròn kết quả đến 4 chữ số thập phân
        return math.round(result, 4);
    } catch (error) {
        console.error('Lỗi khi tính toán:', error);
        return null;
    }
}

export { evaluateMathExpression };