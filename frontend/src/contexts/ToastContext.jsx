import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Date.now();
    const newToast = { id, type, message, status: "in" }; // status là 'in' khi toast xuất hiện
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, status: "out" } : toast
        )
      );
      setToasts((prev) => prev.filter((t) => t.id !== id)); // Sau khi fade out xóa toast
    }, 3000); // ẩn toast sau 4 giây
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4   space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            status={toast.status}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const toastStyles = {
  success: "border-green-500 text-green-700 bg-green-50",
  error: "border-red-500 text-red-700 bg-red-50",
  warning: "border-yellow-500 text-yellow-700 bg-yellow-50",
  info: "border-blue-500 text-blue-700 bg-blue-50",
};

const Toast = ({ type, message, status }) => {
  const progressBarStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };
  
  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaTimesCircle className="text-red-500" />,
    warning: <FaExclamationCircle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
  };

  return (
    <div
      className={`w-[300px] p-4 border-l-4 rounded shadow-sm ${toastStyles[type]} relative opacity-0 ${
        status === "in" ? "animate-fadeIn" : "animate-fadeOut"
      } duration-500 transition-all`}
    >
      <div className="flex items-center space-x-2">
        <div className="text-xl">{icons[type]}</div>
        <div>{message}</div>
      </div>
      {/* Progress bar ở dưới */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
        <div
          className={`h-full ${progressBarStyles[type]} animate-progressBar`}
        />
      </div>
    </div>
  );
};
