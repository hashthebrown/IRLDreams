const axios = require("axios");
const express = require("express");
const path = require("path");
const OpenAi = require("openai");

const OPENAI_API_KEY =
  ;
// Replace with your OPENAI API KEY

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your OpenAI API key
const ELEVENLABS_API_KEY =
  ; // Replace with your ElevenLabs API key

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // To parse JSON bodies

const openai = new OpenAi({
  apiKey: OPENAI_API_KEY,
});

// Endpoint to generate audio prompt using OpenAI API
app.get("/generate-audio-prompt", async (req, res) => {
  const { text } = req.query; // Get the 'text' query parameter

  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }

  try {
    // Construct the prompt for the OpenAI API
    const prompt = `${text}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates detailed audio descriptions for scenes described by the user through prompt. Your description should be clear and concise, not exceeding 370 characters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4",
      max_completion_tokens: 100, // Increase this value
      temperature: 0.5,
    });

    const audioPrompt = completion.choices[0].message.content.trim();
    res.json({ audioPrompt });
  } catch (error) {
    console.error("Error generating audio prompt:", error);
    res.status(500).json({ error: "Error generating audio prompt" });
  }
});

app.get("/generate-next-prompt", async (req, res) => {
  const { context } = req.query;

  if (!context) {
    return res.status(400).json({ error: "Context parameter is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant generating short, connected prompts. Summarize the scene in no more than 370 characters, and continue the context with a meaningful next part of the story.",
        },
        {
          role: "user",
          content: `Here is the context of the scene: "${context}". What happens next? Describe the next part of the scene as part of a connected story.`,
        },
      ],
      model: "gpt-4",
      max_completion_tokens: 100, // Increase this value too
      temperature: 0.5,
    });

    const nextPrompt = response.choices[0].message.content.trim();
    res.json({ nextPrompt });
  } catch (error) {
    console.error("Error generating next prompt:", error);
    res.status(500).json({ error: "Error generating next prompt" });
  }
});

app.get("/generate-sound", async (req, res) => {
  const { text } = req.query;
  console.log("Generating sound for:", text);

  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }

  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/sound-generation", // Replace with correct endpoint
      {
        text: text,
        duration_seconds: 20,
        prompt_influence: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        responseType: "stream",
      }
    );

    res.set("Content-Type", "audio/mp3");
    response.data.pipe(res);
  } catch (error) {
    console.error("Error generating sound:", error);
    res.status(500).json({ error: "Error generating sound effect" });
  }
});

// Endpoint to generate images using OpenAI API
app.get("/generate-images", async (req, res) => {
  const { text } = req.query; // Get the 'text' query parameter

  if (!text) {
    return res.status(400).json({ error: "Text parameter is required" });
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: text,
      n: 1,
      size: "1024x1024",
    });

    const imageUrls = response.data.map((image) => image.url);
    res.json({ imageUrls }); // Return the generated image URLs
  } catch (error) {
    console.error("Error generating images:", error);
    res.status(500).json({ error: "Error generating images" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

