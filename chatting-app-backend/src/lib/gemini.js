import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

// Initialize Gemini AI
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Google Gemini AI configured successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Gemini AI:", error.message);
  }
} else {
  console.log("⚠️  Gemini API key not configured - Chatty AI will be disabled");
}

export const getGeminiResponse = async (message, customPrompt = null) => {
  if (!genAI) {
    throw new Error("Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file");
  }

  try {
    // Use gemini-2.0-flash model with optimized settings
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,  // Balanced creativity and accuracy
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Use custom prompt if provided, otherwise use default Chatty AI context
    const prompt = customPrompt || `You are Chatty AI, a professional and intelligent chat assistant integrated into a messaging application called "Chatty". 
Provide clear, concise, and accurate responses. Keep your answers brief (2-4 sentences maximum) and professional.
Do not use emojis. Maintain a helpful and respectful tone.
Focus on providing valuable information and assistance.

User message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

export const isGeminiConfigured = () => {
  return genAI !== null;
};
