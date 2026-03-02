"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
                type="text"
                className={cn(
                    "w-full pl-10 pr-28 sm:pl-12 sm:pr-32 py-4 rounded-2xl bg-white/5 border border-white/10",
                    "text-white placeholder:text-gray-400 text-base sm:text-lg",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
                    "backdrop-blur-xl transition-all duration-300 shadow-2xl"
                )}
                placeholder="Enter IMDb ID (e.g. tt0133093)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={cn(
                    "absolute inset-y-2 right-2 px-6 rounded-xl font-medium",
                    "bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                )}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}
