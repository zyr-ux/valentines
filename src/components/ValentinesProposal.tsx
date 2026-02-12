import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "@fireworks-js/react";
import Image from "next/image";

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
});



type ValentinesProposalProps = {
  availableImages: { src: string; width: number; height: number }[];
};

export default function ValentinesProposal({ availableImages }: ValentinesProposalProps) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{
    top: string;
    left: string;
  } | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const getRandomPosition = () => {
    const randomTop = Math.random() * 80;
    const randomLeft = Math.random() * 80;
    return { top: `${randomTop}%`, left: `${randomLeft}%` };
  };

  // Calculate grid columns for dynamic background
  // We want roughly square tiles, so sqrt is a good approximation
  // Minimum 2 cols, maximum 8 to prevent too small tiles
  const gridCols = Math.max(2, Math.min(8, Math.ceil(Math.sqrt(availableImages.length))));

  // Determine grid columns based on screen size (approximate for calculation)
  // We'll use 6 cols for mobile, 12 for desktop in CSS, but for capping we can assume 6 to be safe or dynamic
  const MAX_COLS = 6;

  // Create a larger set of images for the grid
  const [displayImages, setDisplayImages] = useState<{ src: string; width: number; height: number; span: { col: number; row: number } }[]>([]);

  useEffect(() => {
    // Duplicate images x4 for coverage
    const baseImages = [...availableImages, ...availableImages, ...availableImages, ...availableImages];

    const calculatedImages = baseImages.map((img) => {
      const aspectRatio = img.width / img.height;
      let baseCol = 1;
      let baseRow = 1;

      // Determine base shape (Unit Size)
      if (aspectRatio > 1.4) {
        // Wide
        baseCol = 2;
        baseRow = 1;
      } else if (aspectRatio < 0.7) {
        // Tall
        baseCol = 1;
        baseRow = 2;
      } else {
        // Square
        baseCol = 1;
        baseRow = 1;
      }

      // Apply Random Scale
      // 60% chance 1x, 30% chance 2x, 10% chance 3x
      const rand = Math.random();
      let scale = 1;
      if (rand > 0.6) scale = 2;
      if (rand > 0.9) scale = 3;

      let colSpan = baseCol * scale;
      let rowSpan = baseRow * scale;

      // Cap at MAX_COLS to prevent layout breakage on small screens
      if (colSpan > MAX_COLS) colSpan = MAX_COLS;

      return {
        ...img,
        span: { col: colSpan, row: rowSpan }
      };
    });

    setDisplayImages(calculatedImages);
  }, [availableImages]);


  useEffect(() => {
    if (step < 2) {
      // Change step after 5 seconds
      const timer = setTimeout(() => {
        setStep((prevStep) => prevStep + 1);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleYesClick = () => {
    setShowFireworks(true);
    setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.h2
            key="step-0"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Congratulations! You have completed the game.
          </motion.h2>
        )}
        {step === 1 && (
          <motion.h2
            key="step-1"
            className={`text-4xl font-semibold mb-4 ${playfairDisplay.className}`}
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I have a surprise for you!
          </motion.h2>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            transition={{ duration: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            {/* Image Unit Grid Background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div
                className="grid grid-cols-6 md:grid-cols-12 auto-rows-[16.666vw] md:auto-rows-[8.333vw] w-full grid-flow-dense"
              >
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      gridColumn: `span ${img.span.col}`,
                      gridRow: `span ${img.span.row}`,
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={`Memory ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 16vw, 8vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            <h2
              className={`text-5xl font-semibold mb-8 ${playfairDisplay.className}`}
            >
              Will you be my Valentine?
            </h2>
            <Image
              src="/sunflowers.png"
              alt="Sunflowers"
              width={200}
              height={200}
            />
            <div className="flex space-x-4 mt-10">
              <button
                className="px-6 py-2 text-lg font-semibold text-black bg-gradient-to-r from-yellow-400 to-green-500 rounded-xl hover:from-yellow-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleYesClick}
              >
                Yes, I will!
              </button>
              <button
                className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-95 transition-all duration-300 shadow-lg"
                style={
                  position
                    ? {
                      position: "absolute",
                      top: position.top,
                      left: position.left,
                    }
                    : {}
                }
                onMouseEnter={() => setPosition(getRandomPosition())}
                onClick={() => setPosition(getRandomPosition())}
              >
                No, I won&apos;t
              </button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step-3"
            className={`text-4xl font-semibold mb-4 flex flex-col justify-center items-center ${playfairDisplay.className}`}
            transition={{ duration: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            I love you so much Mao ! 💕
            <p className="text-sm mt-4">Did you like the game? Look at the hapi hapi cat :)</p>
            <Image
              src="/hamster_jumping.gif"
              alt="Hamster Feliz"
              width={200}
              height={200}
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showFireworks && (
        <div className="absolute w-full h-full">
          <Fireworks
            options={{
              autoresize: true,
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
