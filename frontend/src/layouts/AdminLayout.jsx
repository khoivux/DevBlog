import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { ToastProvider } from "../contexts/ToastContext";
const AdminLayout = () => {
  return (
    <ToastProvider>
        <div className="">
           <Navbar />
           <Outlet />
        </div>
    </ToastProvider>
  )
}

export default AdminLayout