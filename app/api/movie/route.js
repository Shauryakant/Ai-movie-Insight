export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return Response.json({ error: "IMDb ID is required" }, { status: 400 });
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return Response.json({ error: "OMDb API Key is not configured" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`OMDb API responded with status: ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === "False") {
            return Response.json({ error: data.Error || "Movie not found" }, { status: 404 });
        }

        return Response.json(data);
    } catch (error) {
        console.error("OMDb API Error:", error);
        return Response.json({ error: "Failed to fetch movie data" }, { status: 500 });
    }
}
