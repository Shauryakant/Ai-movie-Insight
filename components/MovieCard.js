import { Star, Calendar, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MovieCard({ movie }) {
    if (!movie) return null;

    return (
        <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl">

                {/* Poster */}
                <div className="shrink-0 w-full md:w-[300px] flex justify-center">
                    {movie.Poster !== "N/A" ? (
                        <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-full max-w-[300px] h-auto object-cover rounded-2xl shadow-lg ring-1 ring-white/10"
                        />
                    ) : (
                        <div className="w-full aspect-[2/3] max-w-[300px] bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <span className="text-gray-500">No poster available</span>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col flex-1 space-y-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                            {movie.Title}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-300">
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/20">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-semibold">{movie.imdbRating} / 10</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span>{movie.Released}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <span>{movie.Runtime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <span>{movie.Genre}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Plot Summary
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {movie.Plot}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <Users className="w-5 h-5 text-purple-400" />
                                Cast
                            </h3>
                            <p className="text-gray-300 text-lg">
                                {movie.Actors}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
