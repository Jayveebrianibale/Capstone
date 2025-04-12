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
      className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center">
        <Player autoplay loop src={loaderAnimation} className="w-[100%]" />
      </div>
    </motion.div>
  );
};

export default FullScreenLoader;
