function updateTime() {
    const timeElement = document.querySelector('.time');
    const iconElement = document.querySelector('.icon');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Cập nhật thời gian
    timeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;

    // Đặt icon dựa vào thời gian (6:00 - 18:59 là ngày, còn lại là đêm)
    if (hours >= 6 && hours < 19) {
        iconElement.className = 'bx bx-sun'; // Biểu tượng mặt trời
        iconElement.style.color = '#FFA500'; // Màu vàng cam
    } else {
        iconElement.className = 'bx bx-moon'; // Biểu tượng mặt trăng
        iconElement.style.color = '#1E90FF'; // Màu xanh dương
    }
}

// Cập nhật thời gian mỗi giây
setInterval(updateTime, 1000);
updateTime(); 