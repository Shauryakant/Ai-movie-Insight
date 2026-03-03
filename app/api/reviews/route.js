import * as cheerio from 'cheerio';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return Response.json({ error: "IMDb ID is required" }, { status: 400 });
    }

    try {
        const url = `https://www.imdb.com/title/${id}/reviews`;

        const response = await fetch(url, {
            headers: {
                // Must mock a standard browser so IMDb doesn't block the request
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`IMDb responded with status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const reviews = [];

        // IMDb's current class for the review body text
        $('div.ipc-html-content-inner-div').each((i, el) => {
            const text = $(el).text().trim();
            // Filter out very short strings that might just be artifacts
            if (text.length > 20) {
                reviews.push(text);
            }
        });

        // Limit to top 4 reviews and truncate each to avoid Groq string token rate limits (429 Error)
        const finalReviews = reviews.slice(0, 4).map(r => r.length > 400 ? r.substring(0, 400) + "..." : r);

        if (finalReviews.length === 0) {
            // Fallback just in case IMDb changes their layout or the movie has no reviews
            return Response.json({
                reviews: ["No user reviews found for this movie. It might be too new or unpopular."]
            });
        }

        return Response.json({ reviews: finalReviews });
    } catch (error) {
        console.error("Scraping Error:", error);
        return Response.json({ error: "Failed to scrape reviews" }, { status: 500 });
    }
}
