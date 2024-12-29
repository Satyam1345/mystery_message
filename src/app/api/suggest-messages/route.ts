// // Import necessary packages
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Set up the API key for the Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

// Initialize the Google Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the API route handler
export async function POST(request: Request) {
  console.log(request)
  try {
    // The provided prompt
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    // Start a chat session with the Gemini model
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // Send the prompt message and get a streaming response
    const result = await chat.sendMessageStream(prompt);
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error in suggest-message route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get a response from Gemini API" },
      { status: 500 }
    );
  }
}
