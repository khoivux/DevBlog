import { Outlet } from "react-router-dom";
import { ToastProvider } from "../contexts/ToastContext";
const AuthLayout = () => {
  return (
    <ToastProvider>
      <div className="">
          <Outlet />
      </div>
    </ToastProvider>
      
  )
}

export default AuthLayout