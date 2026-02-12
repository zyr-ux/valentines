"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhotoPairGame from "../components/PhotoPairGame";
import ValentinesProposal from "@/components/ValentinesProposal";
import TextFooter from "@/components/TextFooter";
import OrientationGuard from "@/components/OrientationGuard";

const ANIM_DURATION = 2;

type HomeClientProps = {
    availableImages: string[];
};

export default function HomeClient({ availableImages }: HomeClientProps) {
    const [showValentinesProposal, setShowValentinesProposal] = useState(
        process.env.NEXT_PUBLIC_BYPASS_MINIGAME === "true"
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleShowProposal = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowValentinesProposal(true);
        }, ANIM_DURATION * 1000);
    };

    return (
        <OrientationGuard>
            <main className="flex items-center justify-center min-h-screen bg-black overflow-hidden relative">
                {!showValentinesProposal ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isTransitioning ? 0 : 1 }}
                        transition={{ duration: ANIM_DURATION }}
                        className="flex flex-col items-center"
                    >
                        <PhotoPairGame
                            handleShowProposal={handleShowProposal}
                            availableImages={availableImages}
                        />
                        <div className="mt-4 md:mt-0">
                            <TextFooter />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: ANIM_DURATION }}
                    >
                        <ValentinesProposal availableImages={availableImages} />
                    </motion.div>
                )}
            </main>
        </OrientationGuard>
    );
}
