export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return Response.json({ error: "IMDb ID is required" }, { status: 400 });
    }

    // Mock array of 5–7 realistic audience reviews
    const mockReviews = [
        "A visually stunning masterpiece that keeps you on the edge of your seat from start to finish.",
        "The pacing was a bit off in the second act, but the performances were top-notch and made up for it.",
        "I had high expectations, but honestly, it felt a little derivative and predictable. Still an okay watch.",
        "Absolutely mind-blowing! The cinematography and score alone make this one of the best films of the year.",
        "It wasn't awful, but I struggled to connect with the main characters. The plot had too many holes.",
        "An emotional rollercoaster. The ending left me in tears. Highly recommended for fans of the genre."
    ];

    return Response.json({ reviews: mockReviews });
}
