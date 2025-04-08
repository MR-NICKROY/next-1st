import React from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.div
      initial={{ backgroundColor: "#000000" }}
      whileHover={{ backgroundColor: "#1a1a1a" }}
      transition={{ duration: 0.3 }}
      className="flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row py-5 items-center"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image src={assets.logo_light} alt="" width={120} />
      </motion.div>
      <motion.p
        className="text-sm text-white"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        All right reserved. Copyright @blogger
      </motion.p>
      <div className="flex cursor-pointer">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Image src={assets.facebook_icon} alt="" width={40} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Image src={assets.twitter_icon} alt="" width={40} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Image src={assets.googleplus_icon} alt="" width={40} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Footer;
