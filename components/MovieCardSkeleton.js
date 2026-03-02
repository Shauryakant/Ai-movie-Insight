import { cn } from "@/lib/utils";

export default function MovieCardSkeleton() {
    return (
        <div className="w-full relative group animate-pulse">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl blur opacity-20" />
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl">

                {/* Poster Skeleton */}
                <div className="shrink-0 w-full md:w-[300px] flex justify-center">
                    <div className="w-full aspect-[2/3] max-w-[300px] bg-white/10 rounded-2xl shadow-lg ring-1 ring-white/5" />
                </div>

                {/* Metadata Skeleton */}
                <div className="flex flex-col flex-1 space-y-6">
                    <div className="space-y-4">
                        {/* Title */}
                        <div className="h-12 bg-white/10 rounded-xl w-3/4" />

                        {/* Pills */}
                        <div className="flex gap-4">
                            <div className="h-8 w-24 bg-white/10 rounded-full" />
                            <div className="h-8 w-24 bg-white/10 rounded-full" />
                            <div className="h-8 w-32 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/10">
                        {/* Plot */}
                        <div className="space-y-3">
                            <div className="h-6 w-32 bg-white/10 rounded-lg" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-white/5 rounded" />
                                <div className="h-4 w-full bg-white/5 rounded" />
                                <div className="h-4 w-4/5 bg-white/5 rounded" />
                            </div>
                        </div>

                        {/* Cast */}
                        <div className="space-y-3">
                            <div className="h-6 w-24 bg-white/10 rounded-lg" />
                            <div className="h-4 w-3/4 bg-white/5 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
