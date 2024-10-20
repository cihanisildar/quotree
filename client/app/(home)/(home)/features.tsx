"use client";

import AnimatedCardGallery, {
  FeatureIndicator,
} from "@/components/animated_view";
import {
  folder_image,
  innovative_ideas,
  manager_desk,
  online_sharing,
  vector_shape,
} from "@/images";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Cherry_Swash } from "next/font/google";
import Image from "next/image";
import React, { useState } from "react";

interface FeatureInfo {
  imageSrc: string;
  title: string;
  description: string;
  longDescription: string;
}

const font = Cherry_Swash({
  subsets: ["latin"],
  weight: ["400"],
});

const FeaturesPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features: FeatureInfo[] = [
    {
      imageSrc: innovative_ideas,
      title: "Quote Capture",
      description: "Easily save quotes from books, movies, or any source.",
      longDescription:
        "Our Quote Capture feature allows you to effortlessly save quotes from various sources. Whether you're reading a book, watching a movie, or browsing the web, you can quickly capture and store inspiring quotes with just a few taps.",
    },
    {
      imageSrc: folder_image,
      title: "Intuitive Foldering",
      description:
        "Organize your quotes with customizable folders and subfolders.",
      longDescription:
        "Keep your quotes organized with our Intuitive Foldering system. Create custom folders and subfolders to categorize your quotes by theme, author, or any other criteria you choose. This feature makes it easy to manage and retrieve your growing collection of quotes.",
    },
    {
      imageSrc: manager_desk,
      title: "Smart Tagging",
      description:
        "Add custom tags to your quotes for easy searching and filtering.",
      longDescription:
        "Our Smart Tagging feature enables you to add custom tags to your quotes, making them easily searchable and filterable. This powerful tool allows you to quickly find relevant quotes based on keywords, themes, or any other criteria you've tagged them with.",
    },
    {
      imageSrc: online_sharing,
      title: "Quick Sharing",
      description:
        "Share your favorite quotes on social media with just a click.",
      longDescription:
        "With Quick Sharing, you can instantly share your favorite quotes on various social media platforms. Whether you want to inspire your followers or start a thoughtful discussion, sharing quotes has never been easier or more seamless.",
    },
  ];

  const handlePrevFeature = () => {
    setSelectedFeature(
      (prev) => (prev - 1 + features.length) % features.length
    );
  };

  const handleNextFeature = () => {
    setSelectedFeature((prev) => (prev + 1) % features.length);
  };

  return (
    <div
      className={`min-h-screen w-full py-8 mt-5 bg-[#EDE6DD] ${font.className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex items-center justify-around">
          <div>
            <Image src={vector_shape} alt="vector" width={150} />
            {/* <Image src={vector_shape} alt="vector" width={150} /> */}
          </div>
          <h1 className={`text-7xl text-center mb-8 text-[#1E1928]`}>
            Features
          </h1>{" "}
          <div>
            <Image src={vector_shape} alt="vector" width={150} />
            {/* <Image src={vector_shape} alt="vector" width={150} /> */}
          </div>{" "}
        </div>

        <AnimatedCardGallery
          cards={features}
          className="container mx-auto"
          onCardClick={setSelectedFeature}
          selectedIndex={selectedFeature}
        />
        <FeatureIndicator total={features.length} current={selectedFeature} />
        <div className="container mx-auto mt-12 bg-[#FFF9DB] p-8 rounded-lg shadow-lg relative border-2 border-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-[#deb887] border-b-2 border-black"></div>
          <div className="absolute top-8 left-0 right-0 bottom-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%_-_1px),#e5e5e5_calc(100%_-_1px))] bg-[length:1.5rem_100%] bg-[1.5rem_0]"></div>
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center px-12 mt-8"
              >
                <div className="md:w-1/2 pr-8">
                  <h2 className="text-5xl mb-4 text-black font-serif">
                    {features[selectedFeature].title}
                  </h2>
                  <p className="text-md text-black font-sans">
                    {features[selectedFeature].longDescription}
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Image
                      src={features[selectedFeature].imageSrc}
                      alt={features[selectedFeature].title}
                      width={400}
                      height={300}
                      objectFit="cover"
                      className="grayscale"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={handlePrevFeature}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 border-2 border-black z-20"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
          <button
            onClick={handleNextFeature}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200 border-2 border-black z-20"
          >
            <ChevronRight size={24} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
