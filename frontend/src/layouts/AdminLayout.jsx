import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
        <div className="">
           <Navbar />
           <Outlet />
        </div>
  )
}

export default AdminLayout