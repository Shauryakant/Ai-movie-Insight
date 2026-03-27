async function test() {
    const targetUrl = 'https://www.imdb.com/title/tt1375666/reviews';
    const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`;
    console.log("Fetching...", proxyUrl);
    try {
        const response = await fetch(proxyUrl);
        const html = await response.text();
        console.log("Status:", response.status);
        console.log("HTML len:", html.length);
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);
        console.log("Number of reviews found:", $('div.ipc-html-content-inner-div').length);
        if ($('div.ipc-html-content-inner-div').length > 0) {
            console.log("Snippet:", $('div.ipc-html-content-inner-div').first().text().slice(0, 100));
        }
    } catch(e) {
        console.error("Fetch error:", e.message);
    }
}
test();
