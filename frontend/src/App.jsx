import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./contexts/ToastContext.jsx"; // 👈 Import ToastProvider

const App = () => {
  return (
    <ToastProvider> {/* 👈 Bọc toàn bộ app */}
      <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
        {/* NAVBAR */}
        <Navbar />
        <Outlet />
        {/* FOOTER */}
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
