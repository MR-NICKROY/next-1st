import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponent/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add this inside your layout component

export default function Layout({ children }) {
  return (
    <>
      <div className="flex">
        <ToastContainer />
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin Dashboard</h3>
            <Image src={assets.profile_icon} width={40} alt="profile" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
