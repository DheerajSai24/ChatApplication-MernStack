import { getGeminiResponse, isGeminiConfigured } from "../lib/gemini.js";

export const chatWithAI = async (req, res) => {
  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return res.status(503).json({ 
        message: "Chatty AI is currently unavailable. Please configure GEMINI_API_KEY." 
      });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get AI response
    const aiResponse = await getGeminiResponse(message.trim());

    res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    res.status(500).json({ 
      message: "Failed to get AI response",
      error: error.message 
    });
  }
};

export const checkAIStatus = async (req, res) => {
  res.status(200).json({
    available: isGeminiConfigured(),
    message: isGeminiConfigured() 
      ? "Chatty AI is ready to assist you." 
      : "Chatty AI is currently unavailable."
  });
};

export const rewriteMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!isGeminiConfigured()) {
      return res.status(503).json({ message: "AI service is not available" });
    }

    const prompt = `You are an expert at improving chat messages. Rewrite the following message to be clear, natural, and well-expressed while maintaining the original intent and tone.

Guidelines:
- Fix grammar, spelling, and punctuation errors
- Improve clarity and readability
- Keep the same tone (casual, formal, friendly, etc.)
- Make it sound natural and conversational
- Keep it concise - don't make it longer unless necessary
- Preserve emojis if present
- If the message is already well-written, make minimal changes
- Return ONLY the rewritten message, no explanations or quotes

Original message: "${message}"

Rewritten message:`;

    const rewrittenText = await getGeminiResponse(message, prompt);
    
    // Clean up the response - remove quotes if AI added them
    let cleanedText = rewrittenText.trim();
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1);
    }
    
    res.json({ 
      original: message,
      rewritten: cleanedText
    });
  } catch (error) {
    console.error("Error in rewriteMessage:", error);
    res.status(500).json({ 
      message: "Failed to rewrite message",
      error: error.message 
    });
  }
};

export const translateMessage = async (req, res) => {
  try {
    const { message, targetLanguage } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!targetLanguage) {
      return res.status(400).json({ message: "Target language is required" });
    }

    if (!isGeminiConfigured()) {
      return res.status(503).json({ message: "AI service is not available" });
    }

    const prompt = `Translate the following message to ${targetLanguage}. Maintain the tone, style, and any emojis. Return ONLY the translation without any explanations or quotes.

Message: "${message}"

Translation:`;

    const translation = await getGeminiResponse(message, prompt);
    
    let cleanedText = translation.trim();
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1);
    }
    
    res.json({ 
      original: message,
      translated: cleanedText,
      targetLanguage
    });
  } catch (error) {
    console.error("Error in translateMessage:", error);
    res.status(500).json({ 
      message: "Failed to translate message",
      error: error.message 
    });
  }
};

export const completeMessage = async (req, res) => {
  try {
    const { partialMessage } = req.body;

    if (!partialMessage || typeof partialMessage !== 'string' || partialMessage.trim().length === 0) {
      return res.status(400).json({ message: "Partial message is required" });
    }

    if (!isGeminiConfigured()) {
      return res.status(503).json({ message: "AI service is not available" });
    }

    const prompt = `You are a smart message completion assistant. Complete the following partial message in a natural, conversational way. Keep it brief (5-15 words). Return ONLY the completion that continues from where the user left off, no explanations.

Partial message: "${partialMessage}"

Completion:`;

    const completion = await getGeminiResponse(partialMessage, prompt);
    
    let cleanedText = completion.trim();
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1);
    }
    
    res.json({ 
      partial: partialMessage,
      completion: cleanedText
    });
  } catch (error) {
    console.error("Error in completeMessage:", error);
    res.status(500).json({ 
      message: "Failed to complete message",
      error: error.message 
    });
  }
};

export const summarizeConversation = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    if (!isGeminiConfigured()) {
      return res.status(503).json({ message: "AI service is not available" });
    }

    // Format messages for better analysis
    const formattedMessages = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    const prompt = `Summarize the following conversation into 2-3 key points. Be concise and highlight the most important topics discussed. Return only the summary in bullet points.

Conversation:
${formattedMessages}

Summary:`;

    const summary = await getGeminiResponse(formattedMessages, prompt);
    
    res.json({ 
      messageCount: messages.length,
      summary: summary.trim()
    });
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    res.status(500).json({ 
      message: "Failed to summarize conversation",
      error: error.message 
    });
  }
};
