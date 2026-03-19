import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundShapes } from "./BackgroundShapes";
import { isPortraitKioskActive } from "../portrait-kiosk";

type Props = {
    onComplete: () => void;
    durationMs?: number;
    key?: React.Key;
};

export default function NeuralModeTransition({
    onComplete,
    durationMs = 1000,
}: Props) {
    const isPortrait = typeof window !== "undefined" ? isPortraitKioskActive() : false;

    const [viewport, setViewport] = useState({
        width: typeof window !== "undefined" ? (isPortrait ? window.innerHeight : window.innerWidth) : 1440,
        height: typeof window !== "undefined" ? (isPortrait ? window.innerWidth : window.innerHeight) : 900,
    });

    useEffect(() => {
        const onResize = () => {
            const isP = isPortraitKioskActive();
            setViewport({
                width: isP ? window.innerHeight : window.innerWidth,
                height: isP ? window.innerWidth : window.innerHeight,
            });
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            onComplete();
        }, durationMs);

        return () => window.clearTimeout(timer);
    }, [onComplete, durationMs]);

    const colors = useMemo(() => ["#26D07C", "#7183F5"], []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.75, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
                <BackgroundShapes
                    width={viewport.width}
                    height={viewport.height}
                    colors={colors}
                    minInterval={700}
                    maxInterval={2200}
                    className="w-full h-full opacity-80"
                />
            </motion.div>


        </motion.div>
    );
}
