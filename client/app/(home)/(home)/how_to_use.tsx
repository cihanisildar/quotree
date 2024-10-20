import FeatureSection from "@/components/how_to_use_cards";
import { get_inspired, share_with_other, todo_notes } from "@/images";
import Image from "next/image";
import React from "react";

const HowToUsePage = () => {
  const features = [
    {
      title: "Inspired",
      description:
        "Discover inspiration in your favorite quotes with the ability to tag them, making it easy to revisit and share what moves you.",

      imageSrc: get_inspired,
      imageAlt: "Tagging feature",
      imageOnRight: true,
    },
    {
      title: "Folderize",
      description:
        "Keep your quotes organized with custom collections and folders.",
      imageSrc: todo_notes, // Replace with actual image
      imageAlt: "Organization feature",
      imageOnRight: false,
    },
    {
      title: "Tagging",
      description:
        "Smart Tagging lets you add custom tags to easily search and filter your quotes by keywords or themes.",
      imageSrc: todo_notes, // Replace with actual image
      imageAlt: "Search feature",
      imageOnRight: true,
    },
    {
      title: "Sharing",
      description:
        "Share your favorite quotes with friends or on social media platforms.",
      imageSrc: share_with_other, // Replace with actual image
      imageAlt: "Sharing feature",
      imageOnRight: false,
    },
  ];

  return (
    <div>
      <div className={`min-h-screen py-20 `}>
        <div className="space-y-6">
          <h1 className="text-sm font-extralight text-center opacity-80  text-[#1E1928]">
            YOUR QUOTE LIBRARY
          </h1>{" "}
          <h1 className="text-4xl font-semibold text-center  text-[#1E1928]">
            Personal inspiration, enhanced by organization.
          </h1>{" "}
        </div>
        {features.map((feature, index) => (
          <FeatureSection
            key={index}
            title={feature.title}
            description={feature.description}
            imageSrc={feature.imageSrc}
            imageAlt={feature.imageAlt}
            imageOnRight={feature.imageOnRight}
          />
        ))}
        {/* <div className="max-w-6xl mx-auto space-y-8 py-8">
            <div className="storybook-fix relative flex bg-[#FFF9DB] gap-10 h-full max-h-96 min-h-96 w-full min-w-72 items-center justify-center overflow-hidden rounded-md border-2 border-[#1E1928] flex-col">
              <Marquee className="text-sm text-gray-300">
                <BuiltInTagContent />
              </Marquee>
              <Marquee reverse className="text-sm text-gray-300">
                <CustomTagContent />
              </Marquee>
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default HowToUsePage;
