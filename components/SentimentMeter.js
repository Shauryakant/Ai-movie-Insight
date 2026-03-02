"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function SentimentMeter({ classification }) {
    const [width, setWidth] = useState("0%");

    let targetWidth = "50%";
    let colorClass = "bg-gray-500";
    let textColor = "text-gray-400";

    if (classification === "Positive") {
        targetWidth = "90%";
        colorClass = "bg-green-500 shadow-green-500/50";
        textColor = "text-green-400";
    } else if (classification === "Mixed") {
        targetWidth = "55%";
        colorClass = "bg-yellow-500 shadow-yellow-500/50";
        textColor = "text-yellow-400";
    } else if (classification === "Negative") {
        targetWidth = "25%";
        colorClass = "bg-red-500 shadow-red-500/50";
        textColor = "text-red-400";
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(targetWidth);
        }, 100);
        return () => clearTimeout(timer);
    }, [targetWidth]);

    return (
        <div className="w-full space-y-3 mt-8">
            <div className="flex justify-between items-end">
                <h4 className="text-white font-medium">Sentiment Meter</h4>
                <span className={cn("text-sm font-bold tracking-wider uppercase", textColor)}>
                    {classification || "Unknown"}
                </span>
            </div>
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5 relative">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-lg", colorClass)}
                    style={{ width }}
                />
            </div>
        </div>
    );
}
