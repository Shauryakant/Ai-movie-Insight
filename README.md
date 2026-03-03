# AI Movie Insight Builder

## Overview
A production-ready full-stack web application that allows users to search for any movie using its IMDb ID and instantly receive deep metadata alongside AI-driven audience sentiment analysis.

This project was built with a complete focus on **modern UX**, **performance**, and **resilience**, featuring deep linking, client-side caching, and graceful AI error handling.

## Core Features
- **Real Audience Insights:** Uses a custom `cheerio` backend scraper to extract the latest verified user reviews directly from IMDb without requiring external review APIs.
- **Dynamic Director Persona:** The AI dynamically identifies the actual director of the searched movie (e.g., Christopher Nolan) and adopts their specific speaking style and personality when summarizing sentiment in "Director's Cut" mode.
- **Instant Discoverability:** "Try an Example" links sync directly to the URL (`?id=tt...`) for deep-linking and easy sharing.
- **Client-Side Caching:** Sentiment responses (Critic vs. Director mode) are cached in React state. Toggling back and forth does not trigger redundant API calls, saving quota and eliminating load times.
- **Persistent State:** Recent searches are stored in `localStorage` so users don't lose their history upon refresh.
- **Dynamic Ambient UI:** Uses a modern glassmorphic design system with a pulsing, active background aura.
- **Bulletproof JSON Parsing:** Robust regex extractors and brute-force fallbacks ensure the frontend **never crashes** if the AI model hallucinates or fails to return perfectly structured JSON.

## Architecture & Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **APIs Used:**
  - **OMDb API**: Fetches reliable metadata (Poster, Plot, Cast, Rating).
  - **Cheerio HTML Parser**: Powers the custom backend server-side scraper to fetch live audience reviews from IMDb automatically.
  - **Groq API (Llama-3.1-8b-instant)**: Handles the heavy lifting for the sentiment analysis. Chosen for its massive free-tier limits (14,400 daily requests) and blazing-fast LPU inference speed.
- **Icons:** Lucide React

### Tech Stack Rationale
- **Next.js & React:** Chosen for its seamless full-stack capabilities. Route Handlers (`/api`) allow us to perfectly securely hide the Groq and OMDb API keys from the client without needing to stand up a separate backend server like Express. The App Router provides excellent component mental models.
- **Tailwind CSS:** Allowed for rapid, highly-customizable UI development to hit the "premium outlook" and "animations" criteria without writing bloated custom CSS files.
- **Groq API:** Chose Groq over OpenAI/Gemini due to its unprecedented inference speed and generous free tier, ensuring the app won't hit rate-limiting walls during live interviewer testing.

All external data fetching is securely handled via Next.js Route Handlers (`/api/*`), ensuring API keys are never exposed to the client browser.

---

## 🚀 Setup Instructions for Local Development

To run this project locally, you will need two free API keys:

### 1. Get Your API Keys
1. **OMDb API Key:** Get a free key at [omdbapi.com](http://www.omdbapi.com/apikey.aspx).
2. **Groq API Key:** Get a free API key at [console.groq.com/keys](https://console.groq.com/keys).

### 2. Configure Environment Variables
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-link>
   cd ai-movie-insight
   ```
2. Create a `.env.local` file in the root directory and add your keys:
   ```env
   OMDB_API_KEY=your_omdb_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

### 3. Install & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the app!

---

## 🌍 Vercel Deployment Instructions

Since this app uses the Next.js App Router, it is natively ready for Vercel deployment.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click "Add New Project".
3. Import your GitHub repository.
4. **CRITICAL:** Before clicking Deploy, expand the **Environment Variables** section and add:
   - Name: `OMDB_API_KEY` | Value: `<your_key>`
   - Name: `GROQ_API_KEY` | Value: `<your_key>`
5. Click **Deploy**. Vercel will build the app and provide a live URL!

---

## Assumptions & Future Improvements
- **Future Feature:** Implement fuzzy text search instead of strict IMDb IDs by pre-flighting requests to a search index.
