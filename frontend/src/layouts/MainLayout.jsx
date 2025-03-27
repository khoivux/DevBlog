import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const MainLayout = () => {
  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
          <Navbar />
          <Outlet />
      </div>
      <div className="w-full mt-10">
        <Footer />
      </div>
    </>

  )
}

export default MainLayout