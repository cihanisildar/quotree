"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";

import SubscriptionTiers from "@/components/subscription_tiers";
import { AnimatedNumber } from "@/components/ui/animated_number";
import { hero_image, shining_text_effect } from "@/images";
import FeaturesPage from "./features";
import HowToUsePage from "./how_to_use";

export default function Home() {
  const [usersValue, setUsersValue] = useState(0);
  const [quotesValue, setQuotesValue] = useState(0);

  useEffect(() => {
    setUsersValue(2082);
    setQuotesValue(100000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="">
      <motion.div
        className="grid grid-cols-5 py-24 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="col-span-2 space-y-6 flex flex-col items-start justify-center text-[#1E1928]">
          <motion.h1
            className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
            variants={itemVariants}
          >
            Capture and Share Your Favorite{" "}
            <span className="text-[#f0e68c] underline relative">
              <Image
                src={shining_text_effect}
                alt="shining_effect"
                width={50}
                className="absolute -right-14 top-0 z-50"
              />
              Quotes
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground md:text-md"
            variants={itemVariants}
          >
            QuoteKeeper helps you collect, organize, and share inspiring quotes
            from your favorite books and authors.
          </motion.p>
          <motion.div className="flex gap-2" variants={itemVariants}>
            <button className="flex justify-start items-center gap-2 px-4 py-2 rounded-[8px] text-white bg-[#292A2D] border hover:bg-black/80">
              Get Started
              <FaArrowRight />
            </button>
            <button className="px-4 py-2 border border-black rounded-[8px]">
              Learn more{" "}
            </button>
          </motion.div>
          <motion.div
            className="flex flex-col gap-2 mt-4 border-t pt-4 border-gray-200"
            variants={itemVariants}
          >
            <p className="text-sm font-medium text-gray-600 underline">
              Join our growing community:
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <AnimatedNumber
                    className="inline-flex items-center text-sm font-semibold text-zinc-800 dark:text-zinc-50"
                    springOptions={{
                      bounce: 0,
                      duration: 2000,
                    }}
                    value={usersValue}
                  />
                  <PlusIcon size={12} />
                </div>
                <span className="text-sm font-medium">active users</span>
              </div>
              <span>/</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <AnimatedNumber
                    className="inline-flex items-center text-sm font-semibold text-zinc-800 dark:text-zinc-50"
                    springOptions={{
                      bounce: 0,
                      duration: 2000,
                    }}
                    value={quotesValue}
                  />
                  <PlusIcon size={12} />
                </div>
                <span className="text-sm font-medium">quotes shared</span>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="col-span-3 relative flex items-center justify-center -z-20"
          variants={imageVariants}
        >
          <Image src={hero_image} alt="hero_image" priority />
        </motion.div>
      </motion.div>
      {/* <FeaturesPage /> */}
      <HowToUsePage />
      <SubscriptionTiers />
    </div>
  );
}
