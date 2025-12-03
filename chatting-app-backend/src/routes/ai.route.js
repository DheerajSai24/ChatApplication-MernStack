import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  chatWithAI, 
  checkAIStatus, 
  rewriteMessage,
  translateMessage,
  completeMessage,
  summarizeConversation
} from "../controllers/ai.controller.js";

const router = express.Router();

// Check if AI is available
router.get("/status", protectRoute, checkAIStatus);

// Chat with AI
router.post("/chat", protectRoute, chatWithAI);

// Rewrite message with AI
router.post("/rewrite", protectRoute, rewriteMessage);

// Translate message
router.post("/translate", protectRoute, translateMessage);

// Complete message (Smart Compose)
router.post("/complete", protectRoute, completeMessage);

// Summarize conversation
router.post("/summarize", protectRoute, summarizeConversation);

export default router;
