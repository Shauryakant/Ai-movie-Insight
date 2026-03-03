const { GET } = require('../app/api/reviews/route.js'); // NOTE: It uses ES modules, so require might fail. We should use import.

async function test() {
    const req = { url: 'http://localhost/api/reviews?id=tt0468569' };
    const res = await GET(req);
    const json = await res.json();
    console.log("Response:", Object.keys(json));
    if (json.reviews) {
        console.log("Reviews found:", json.reviews.length);
        console.log("First review snippet:", json.reviews[0].substring(0, 100));
    } else {
        console.log("Error:", json);
    }
}
test();
