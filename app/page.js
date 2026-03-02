"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import SentimentBox from "@/components/SentimentBox";
import { AlertCircle, Play, History } from "lucide-react";

function MovieSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movieData, setMovieData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSentimentLoading, setIsSentimentLoading] = useState(false);
  const [error, setError] = useState("");

  const [isDirectorMode, setIsDirectorMode] = useState(false);
  const [lastMovieId, setLastMovieId] = useState("");
  const [cachedSentiment, setCachedSentiment] = useState({ critic: null, director: null });

  const [recentSearches, setRecentSearches] = useState([]);

  // Default examples if no recent searches exist
  const examples = [
    { title: "The Matrix", id: "tt0133093" },
    { title: "The Dark Knight", id: "tt0468569" },
    { title: "Inception", id: "tt1375666" }
  ];

  // Load Deep Link from URL on first mount
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId && urlId !== lastMovieId) {
      handleSearch(urlId, false);
    }
  }, [searchParams]);

  // Load recent searches from LocalStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = async (query, updateUrl = true) => {
    if (!query) return;

    setIsLoading(true);
    setError("");
    setMovieData(null);
    setSentimentData(null);
    setIsDirectorMode(false);
    setCachedSentiment({ critic: null, director: null });

    // Update the URL without triggering a full page reload so it's shareable
    if (updateUrl) {
      router.push(`/?id=${encodeURIComponent(query)}`, { scroll: false });
    }

    try {
      const movieRes = await fetch(`/api/movie?id=${encodeURIComponent(query)}`);
      if (!movieRes.ok) {
        const errorData = await movieRes.json();
        throw new Error(errorData.error || "Failed to fetch movie details.");
      }

      const movieJson = await movieRes.json();
      setMovieData(movieJson);
      setLastMovieId(query);

      // Add to recent searches (up to 3 distinct items)
      setRecentSearches(prev => {
        const newEntry = { title: movieJson.Title, id: movieJson.imdbID };
        const filtered = prev.filter(item => item.id !== newEntry.id);
        const updated = [newEntry, ...filtered].slice(0, 3);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });

      const reviewsRes = await fetch(`/api/reviews?id=${encodeURIComponent(query)}`);
      const reviewsJson = await reviewsRes.json();

      const reviews = reviewsJson.reviews || [];

      await fetchSentiment(reviews, false);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSentiment = async (reviews, directorMode) => {
    setIsSentimentLoading(true);
    try {
      const sentimentRes = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reviews, directorMode })
      });

      if (!sentimentRes.ok) {
        const errorText = await sentimentRes.text();
        console.error("Sentiment API Failed:", sentimentRes.status, errorText);
        throw new Error(`Failed to analyze sentiment. Status: ${sentimentRes.status}`);
      }

      const sentimentJson = await sentimentRes.json();
      setSentimentData(sentimentJson);

      // Cache the successful response
      setCachedSentiment(prev => ({
        ...prev,
        [directorMode ? 'director' : 'critic']: sentimentJson
      }));

    } catch (err) {
      console.error("fetchSentiment Error:", err);
      // Ensure the UI gracefully shows the error instead of a crash page
      setSentimentData({
        summary: `API Error: ${err.message}`,
        classification: "Mixed"
      });
    } finally {
      setIsSentimentLoading(false);
    }
  };

  const handleToggleMode = async () => {
    const nextMode = !isDirectorMode;
    setIsDirectorMode(nextMode);

    // Check cache first!
    const cacheKey = nextMode ? 'director' : 'critic';
    if (cachedSentiment[cacheKey]) {
      setSentimentData(cachedSentiment[cacheKey]);
      return;
    }

    setIsSentimentLoading(true);
    try {
      const reviewsRes = await fetch(`/api/reviews?id=${encodeURIComponent(lastMovieId)}`);
      if (!reviewsRes.ok) throw new Error("Failed to fetch reviews for toggle");

      const reviewsJson = await reviewsRes.json();
      await fetchSentiment(reviewsJson.reviews, nextMode);
    } catch (err) {
      console.error("Error toggling mode:", err);
      // Give the user a visual error indication instead of failing silently on the frontend
      setSentimentData({
        summary: "Error generating the new summary. Please try again.",
        classification: "Mixed"
      });
      setIsSentimentLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-12">

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-sm pb-2">
            AI Movie Insight Builder
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover profound AI-driven sentiment analysis, cast details, and plot summaries for any movie on IMDb.
          </p>
        </div>

        <div className="space-y-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-gray-500 text-sm py-1.5 px-2">
              {recentSearches.length > 0 ? "Recent:" : "Try an example:"}
            </span>
            {(recentSearches.length > 0 ? recentSearches : examples).map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSearch(ex.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all disabled:opacity-50"
              >
                {recentSearches.length > 0 ? <History className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-purple-400" />}
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-8 mt-24">
            <MovieCardSkeleton />
          </div>
        )}

        {movieData && !isLoading && (
          <div className="relative mt-24">
            {/* Dynamic Ambient Glow Behind Movie Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-tr from-purple-500/10 via-cyan-500/10 to-transparent blur-[120px] -z-10 rounded-full animate-pulse [animation-duration:4s]" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-bottom-12 duration-1000">
              <MovieCard movie={movieData} />

              <SentimentBox
                summary={sentimentData?.summary}
                classification={sentimentData?.classification}
                isDirectorMode={isDirectorMode}
                onToggleMode={handleToggleMode}
                isLoading={isSentimentLoading}
              />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <MovieSearchContent />
    </Suspense>
  );
}
