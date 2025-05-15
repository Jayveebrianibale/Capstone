import React from "react";
import { useLoading } from "./LoadingContext";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import loaderAnimation from "../assets/loader2.json";

const FullScreenLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <motion.div 
      className="fixed inset-0 flex justify-center items-center bg-white/30 dark:bg-gray-900/60 backdrop-blur-[6px] z-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center ml-0 md:ml-64">
        <Player autoplay loop src={loaderAnimation} className="w-[100%]" />
      </div>
    </motion.div>
  );
};

export default FullScreenLoader;
