"use client";

import { BrainCircuit, Clapperboard, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import SentimentMeter from "./SentimentMeter";

export default function SentimentBox({ summary, classification, isDirectorMode, onToggleMode, isLoading, directorName }) {
    if (!summary && !isLoading) return null;

    return (
        <div className="w-full mt-8 relative group">
            <div className={cn(
                "absolute -inset-1 rounded-3xl blur opacity-25 transition duration-1000",
                isDirectorMode ? "bg-gradient-to-r from-red-600 to-orange-600" : "bg-gradient-to-r from-indigo-600 to-cyan-600",
                "group-hover:opacity-40"
            )} />

            <div className="relative bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-3 rounded-2xl border",
                            isDirectorMode ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        )}>
                            {isDirectorMode ? <Clapperboard className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {isDirectorMode ? (directorName ? `${directorName}'s Cut` : "Director's Cut") : "AI Critical Consensus"}
                            </h2>
                            <p className="text-sm text-gray-400 text-left">
                                {isDirectorMode ? "Humorous defensive spin" : "Objective sentiment analysis"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onToggleMode}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 border",
                            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95",
                            isDirectorMode
                                ? "bg-orange-600/30 hover:bg-orange-600/40 text-orange-300 border-orange-500/30"
                                : "bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border-cyan-500/30"
                        )}
                    >
                        <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        {isLoading ? (isDirectorMode ? "Generating Director's Cut..." : "Generating Critical Consensus...") : (isDirectorMode ? "Switch to Critic Mode" : "Switch to Director Mode")}
                    </button>
                </div>

                <div className="min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex items-center">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-3 h-3 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-3 h-3 bg-white/20 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg md:text-xl text-gray-200 leading-relaxed italic m-0 w-full">
                            "{summary}"
                        </p>
                    )}
                </div>

                {(!isLoading && classification) && (
                    <SentimentMeter classification={classification} />
                )}
            </div>
        </div>
    );
}
