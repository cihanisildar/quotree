import React from "react";
import { motion, useInView, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Afacad } from "next/font/google";

const font = Afacad({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
});


interface CardInfo {
  imageSrc: string;
  title: string;
  description: string;
}

interface AnimatedCardGalleryProps {
  cards: CardInfo[];
  className?: string;
  onCardClick: (index: number) => void;
  selectedIndex: number;
}

export default function AnimatedCardGallery({
  cards,
  className,
  onCardClick,
  selectedIndex,
}: AnimatedCardGalleryProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(
        `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 ${font.className}`,
        className
      )}
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={cardVariants}>
          <Card
            className={cn(
              "w-full h-80 bg-white border-2 border-black rounded-none overflow-hidden transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer relative",
              selectedIndex === index && "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            )}
            onClick={() => onCardClick(index)}
          >
            <div className="absolute top-0 left-0 w-full h-8 bg-[#deb887] border-b-2 border-black"></div>
            <div className="absolute top-8 left-0 right-0 bottom-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_calc(100%_-_1px),#e5e5e5_calc(100%_-_1px))] bg-[length:100%_1.5rem] bg-[0_1.5rem]">
              <CardHeader className="p-0">
                <div className="h-32 flex items-center justify-center">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col justify-between h-36">
                <CardTitle className="text-2xl mb-2 text-center text-black">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-md text-black text-center line-clamp-3">
                  {card.description}
                </CardDescription>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export const FeatureIndicator: React.FC<{ total: number; current: number }> = ({
  total,
  current,
}) => (
  <div className="flex justify-center mt-4 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-3 h-3 rounded-full mx-1 transition-all duration-300",
          i === current ? "bg-black scale-125" : "bg-gray-300"
        )}
      />
    ))}
  </div>
);
