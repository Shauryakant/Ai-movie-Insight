const cheerio = require('cheerio');

async function testScrape() {
    try {
        const id = 'tt0133093'; // The Matrix
        const url = `https://www.imdb.com/title/${id}/reviews`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const html = await res.text();
        const $ = cheerio.load(html);

        const reviews = [];

        $('div.ipc-html-content-inner-div').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 20) reviews.push(text);
        });

        console.log(`Found ${reviews.length} reviews.`);
        if (reviews.length > 0) {
            console.log("Review 1:", reviews[0].substring(0, 100));
            console.log("Review 2:", reviews[1].substring(0, 100));
        }
    } catch (err) {
        console.error("Scrape failed:", err);
    }
}

testScrape();
