"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "../../Assets/assets";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [clickedLink, setClickedLink] = useState("");

  const handleClick = (path) => {
    setClickedLink(path);
    // Reset the clicked state after animation
    setTimeout(() => setClickedLink(""), 300);
  };

  return (
    <div className="flex flex-col bg-slate-100">
      <div className="px-2 sm:pl-14 py-3 border border-black">
        <Link href="/">
          <Image src={assets.logo} width={120} alt="image" />
        </Link>
      </div>
      <div className="w-28 sm:w-80 h-[100vh] relative py-12 border border-black">
        <div className="w-[50%] sm:w-[80%] absolute right-0">
          <Link
            href="/admin/addproduct"
            onClick={() => handleClick("/admin/addproduct")}
            className={`flex items-center border border-black gap-3 font-medium p-3 bg-white 
              ${
                pathname === "/admin/addproduct"
                  ? "bg-black text-white shadow-none translate-x-[-2px] translate-y-[2px]"
                  : "shadow-[-7px_7px_0px_#000000] hover:shadow-[-4px_4px_0px_#000000] hover:translate-x-[-3px] hover:translate-y-[3px]"
              }
              ${
                clickedLink === "/admin/addproduct"
                  ? "animate-click shadow-none translate-x-[-7px] translate-y-[7px]"
                  : ""
              }
              transition-all duration-200 active:shadow-none active:translate-x-[-7px] active:translate-y-[7px]`}
          >
            <Image src={assets.add_icon} width={28} alt="image" />
            <p>Add Blog</p>
          </Link>
          <Link
            href="/admin/bloglist"
            onClick={() => handleClick("/admin/bloglist")}
            className={`flex mt-5 items-center border border-black gap-3 font-medium p-3 bg-white 
              ${
                pathname === "/admin/bloglist"
                  ? "bg-black text-white shadow-none translate-x-[-2px] translate-y-[2px]"
                  : "shadow-[-7px_7px_0px_#000000] hover:shadow-[-4px_4px_0px_#000000] hover:translate-x-[-3px] hover:translate-y-[3px]"
              }
              ${
                clickedLink === "/admin/bloglist"
                  ? "animate-click shadow-none translate-x-[-7px] translate-y-[7px]"
                  : ""
              }
              transition-all duration-200 active:shadow-none active:translate-x-[-7px] active:translate-y-[7px]`}
          >
            <Image src={assets.blog_icon} width={28} alt="image" />
            <p>Blog List</p>
          </Link>
          <Link
            href="/admin/subscription"
            onClick={() => handleClick("/admin/subscription")}
            className={`flex mt-5 items-center border border-black gap-3 font-medium p-3 bg-white 
              ${
                pathname === "/admin/subscription"
                  ? "bg-black text-white shadow-none translate-x-[-2px] translate-y-[2px]"
                  : "shadow-[-7px_7px_0px_#000000] hover:shadow-[-4px_4px_0px_#000000] hover:translate-x-[-3px] hover:translate-y-[3px]"
              }
              ${
                clickedLink === "/admin/subscription"
                  ? "animate-click shadow-none translate-x-[-7px] translate-y-[7px]"
                  : ""
              }
              transition-all duration-200 active:shadow-none active:translate-x-[-7px] active:translate-y-[7px]`}
          >
            <Image src={assets.email_icon} width={28} alt="image" />
            <p>Subscription</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
