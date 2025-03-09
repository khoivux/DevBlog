function login(url, method, data, successRedirect, errorElementId) {
    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(result => {
        if (result.status >= 400 || !result.body.authenticated) {
            throw result.body; // Nếu lỗi hoặc chưa xác thực, ném object chứa thông tin lỗi
        }
        // Lưu JWT  vào Cookie nếu authenticated = true
        document.cookie = `JWToken=${result.body.token}; path=/; SameSite=Strict`;
        // Chuyển hướng đến trang home
        window.location.href = successRedirect;
    })
        .catch(error => {
        // Hiển thị thông báo lỗi
        let errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.innerText = error.message || "Đăng nhập thất bại!";
            errorElement.style.display = "block";
        }
    });
}

function register(url, method, data, successRedirect, errorElementId) {
    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(result => {
        if (result.status >= 400) {
            throw result.body; // Nếu lỗi hoặc chưa xác thực, ném object chứa thông tin lỗi
        }
        let modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();

        // Chờ 3 giây rồi chuyển hướng
        setTimeout(() => {
            window.location.href = successRedirect;
        }, 1000);
    })
        .catch(error => {
        // Hiển thị thông báo lỗi
        let errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.innerText = error.message || "Đăng nhập thất bại!";
            errorElement.style.display = "block";
        }
    });
}

function togglePassword() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye"); // Icon mắt mở
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash"); // Icon mắt nhắm

    }
}