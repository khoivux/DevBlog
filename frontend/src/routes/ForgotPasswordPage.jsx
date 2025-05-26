import { useState, useEffect } from "react";
import { sendOTP } from "../service/emailService";
import { verifyEmail, resetPassword } from "../service/authService";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300); // 300 giây = 5 phút
const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timeLeft === 0) {
      setOtpExpired(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await sendOTP(email);
      showToast("success", response.message);
      setStep(2);
      setTimeLeft(300); // Reset 5 phút
      setOtpExpired(false);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }
    try {
      const valid = await verifyEmail(email, otp);
      if (!valid) {
        setError("Mã OTP không đúng hoặc đã hết hạn");
        return;
      }
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    try {
      const response = await resetPassword(email, newPassword, confirmPassword);
      showToast("success", response.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-custom w-96">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <img
              src="https://res.cloudinary.com/drdjvonsx/image/upload/v1745129650/logo_vgrbmq.png"
              alt="Logo"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            {step === 1 && "Quên mật khẩu"}
            {step === 2 && "Nhập mã OTP"}
            {step === 3 && "Đặt lại mật khẩu"}
          </h2>
          {error && (
            <p className="text-red-500 text-base text-center mt-2">{error}</p>
          )}
        </div>

        <form
          className="mt-6"
          onSubmit={
            step === 1
              ? handleSendOtp
              : step === 2
              ? handleVerifyOtp
              : handleResetPassword
          }
        >
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
                Gửi mã OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-500 mb-1">
                Mã OTP đã được gửi tới email <b>{email}</b>.
              </p>
              <p className="text-sm text-red-500 mb-3">
                {otpExpired
                  ? "Mã OTP đã hết hạn. Vui lòng gửi lại mã."
                  : `Mã có hiệu lực trong: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                      .toString()
                      .padStart(2, "0")}`}
              </p>

              <input
                type="text"
                placeholder="Nhập mã OTP"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={otpExpired}
              />
              <button
                className={`w-full text-white py-2 rounded-lg mt-4 ${
                  otpExpired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
                }`}
                disabled={otpExpired}
              >
                Xác minh OTP
              </button>
            </>
          )}


          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 mb-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
                Đổi mật khẩu
              </button>
            </>
          )}
        </form>

        <div className="flex justify-between mt-4 text-base font-medium text-blue-500">
          <a href="/login" className="hover:underline">
            Đăng nhập
          </a>
          <a href="/register" className="hover:underline">
            Đăng kí
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
