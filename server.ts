import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI:", err);
    }
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "AgriSphere Africa", timestamp: new Date().toISOString() });
  });

  // AI Crop Diagnostic & Advisory Endpoint
  app.post("/api/ai/crop-advisory", async (req, res) => {
    try {
      const { cropType, location, symptoms, soilType } = req.body;
      
      if (!ai) {
        // High quality fallback response when API key is not yet set
        return res.json({
          advisory: {
            diagnosis: `Potential Maize Streak Virus or early Armyworm stress detected in ${cropType || "crop"} in ${location || "East Africa"}.`,
            confidence: "88%",
            treatment: [
              "Apply neem oil or eco-friendly bio-pesticide early in the morning.",
              "Ensure proper crop rotation with leguminous plants like cowpeas to replenish nitrogen.",
              "Maintain drip irrigation balance; avoid waterlogging around stem base."
            ],
            preventativeMeasures: [
              "Plant disease-resistant certified seed varieties.",
              "Use yellow sticky traps to monitor pest vector populations.",
              "Apply organic compost to strengthen root resistance."
            ],
            yieldImpactEstimate: "-5% to -12% if untreated within 7 days",
            recommendedNutrients: "NPK 17-17-17 with secondary Zinc trace elements"
          },
          aiPowered: false,
          note: "Standard agricultural advisory baseline. Connect GEMINI_API_KEY for real-time tailored AI diagnostic analysis."
        });
      }

      const prompt = `You are an expert African agricultural specialist and agronomist for AgriSphere Africa. Analyze the following crop report:
- Crop Type: ${cropType || "Unknown"}
- Location/Region: ${location || "Sub-Saharan Africa"}
- Soil Type: ${soilType || "Clay loam"}
- Reported Symptoms/Condition: ${symptoms || "Yellowing leaves with spots"}

Provide a structured analysis including:
1. Diagnosis & Root Cause
2. Immediate Organic & Scientific Treatment Steps (list of 3 items)
3. Preventative Measures for Next Harvest (list of 3 items)
4. Estimated Potential Impact on Yield
5. Soil & Fertilizer Recommendation`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        advisoryText: response.text,
        aiPowered: true
      });
    } catch (error: any) {
      console.error("Crop Advisory API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI crop advisory" });
    }
  });

  // AI Market Price Intelligence Endpoint
  app.post("/api/ai/market-prediction", async (req, res) => {
    try {
      const { commodity, region } = req.body;

      if (!ai) {
        return res.json({
          trend: "Bullish (+6.4%)",
          forecastReason: `High regional demand for ${commodity || "White Maize"} in ${region || "East Africa"} combined with seasonal supply shifts.`,
          optimalSellWindow: "Next 14-21 days",
          aiPowered: false
        });
      }

      const prompt = `Provide a concise 3-sentence African agricultural market analysis and price forecast for ${commodity || "Grain"} in ${region || "East Africa"}. Include expected supply trends, optimal sell timeframe, and demand factors.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        analysis: response.text,
        aiPowered: true
      });
    } catch (error: any) {
      console.error("Market Prediction API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate market prediction" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AgriSphere Africa Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
