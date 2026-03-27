export async function POST(request) {
    try {
        const { reviews, directorMode, directorName, movieTitle, movieYear } = await request.json();

        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return Response.json({ error: "A valid array of reviews is required" }, { status: 400 });
        }

        // Now using GROQ_API_KEY
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return Response.json({ error: "Groq API Key is not configured" }, { status: 500 });
        }

        // Ensure systemInstruction properly includes the JSON enforcement
        // Groq REQUIRES the word 'JSON' to be present when using json_object response_format
        const JSON_FORMAT = `\n\nYou MUST return your answer strictly as a JSON object, exactly in this JSON format:\n{"summary": "...", "classification": "Positive"}`;

        let isFallback = false;
        if (reviews.length === 1 && reviews[0].includes("No user reviews found")) {
            isFallback = true;
        }

        let systemInstruction = `You are a professional film critic.
Analyze the following audience reviews and:
Provide a highly detailed, comprehensive paragraph (at least 5-6 sentences) summarizing the overall audience sentiment. Dive deep into the nuances, mentioning specific aspects of the movie (e.g., cinematography, acting, plot) that the audience loved or hated. Use sophisticated language.
Classify sentiment strictly as one of: Positive, Mixed, or Negative.${JSON_FORMAT}`;

        if (isFallback) {
             systemInstruction = `You are a professional film critic with extensive historical knowledge of cinema.
Since no direct reviews were provided by the web scraper, you MUST use your own internal knowledge base to write a highly detailed, comprehensive paragraph (at least 5-6 sentences) summarizing the general consensus, critical reception, and audience sentiment for the movie "${movieTitle}" (${movieYear}) directed by ${directorName}.
Dive deep into why audiences and critics loved or hated it. Use sophisticated language. 
Classify the sentiment strictly as one of: Positive, Mixed, or Negative.${JSON_FORMAT}`;
        }

        if (directorMode) {
            const name = directorName || "the director";
            systemInstruction = `You are ${name}, the incredibly defensive but deeply passionate director of the film "${movieTitle}". 
Speaking in the first person, and adopting the known personality, speaking style, and quirks of ${name}, humorously summarize the audience reviews to relentlessly convince people they MUST watch the film regardless of the critics. 
Ignore the haters, praise your own vision! Still classify the actual sentiment strictly as Positive, Mixed, or Negative based on the reviews.${JSON_FORMAT}`;

            if (isFallback) {
              systemInstruction = `You are ${name}, the incredibly defensive but deeply passionate director of the film "${movieTitle}" (${movieYear}).
Since no direct reviews were provided, draw from your vast AI knowledge of how critics and audiences ACTUALLY responded to this film in the real world. 
Speaking strictly in the first person, and adopting the known personality, speaking style, and quirks of ${name}, humorously summarize the real-world discourse revolving around your film. Relentlessly convince people they MUST watch the film regardless of what the real-world critics say. 
Ignore the haters, praise your own vision! Still classify the actual sentiment strictly as Positive, Mixed, or Negative.${JSON_FORMAT}`;
            }
        }

        const payload = {
            model: "llama-3.1-8b-instant", // Fast and free on Groq
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: isFallback ? `Analyze real-world sentiment for: ${movieTitle}` : `Reviews:\n${reviews.join("\n")}` }
            ],
            temperature: 0.6,
            response_format: { type: "json_object" } // Built-in JSON mode for Groq/OpenAI
        };

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Groq API error:", response.status, err);
            throw new Error(`Failed to fetch sentiment from AI. Status: ${response.status}`);
        }

        const aiData = await response.json();

        if (!aiData.choices || aiData.choices.length === 0) {
            throw new Error("No response choices from AI.");
        }

        // Extract the text content
        const content = aiData.choices[0].message.content;

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (parseError) {
            console.error("Failed to parse Groq JSON. Raw content:", content);

            // Extreme brute-force fallback just in case
            let fallbackClassification = "Mixed";
            if (content.match(/Positive/i)) fallbackClassification = "Positive";
            else if (content.match(/Negative/i)) fallbackClassification = "Negative";

            parsed = {
                summary: content,
                classification: fallbackClassification
            };
        }

        // Final safety net
        if (!parsed.summary) parsed.summary = "No summary provided by AI.";
        if (!parsed.classification) parsed.classification = "Mixed";

        return Response.json(parsed);

    } catch (error) {
        console.error("Sentiment API Error:", error);
        return Response.json({
            error: "Internal Server Error analyzing sentiment.",
            details: error.message
        }, { status: 500 });
    }
}
