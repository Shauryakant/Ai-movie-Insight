const fetch = require('node-fetch'); // if nextjs, fetch is global

async function testFetch() {
    try {
        const res = await fetch('https://www.imdb.com/title/tt0133093/reviews', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Length:", text.length);
        if (text.includes('review-container')) {
            console.log("Reviews found!");
        } else {
            console.log("Reviews NOT found. Might be blocked.");
        }
    } catch (e) {
        console.error(e);
    }
}
testFetch();
