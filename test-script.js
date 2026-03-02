const apiKey = process.env.GEMINI_API_KEY;

const JSON_FORMAT = `\nReturn strictly in JSON format as follows:
{"summary": "...", "classification": "Positive"}`;

const systemInstruction = `You are the incredibly defensive but deeply passionate director of this film. 
Speaking in the first person, humorously summarize these audience reviews to relentlessly convince people they MUST watch the film regardless of the critics. 
Ignore the haters, praise the vision! Still classify the actual sentiment strictly as Positive, Mixed, or Negative based on the reviews.${JSON_FORMAT}`;

const payload = {
    model: "llama3-8b-8192",
    messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: `Reviews:\nTest review 1\nTest review 2` }
    ],
    temperature: 0.6,
    response_format: { type: "json_object" }
};

async function run() {
    console.log("Fetching...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("HTTP ERROR", response.status, await response.text());
        return;
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

run();
