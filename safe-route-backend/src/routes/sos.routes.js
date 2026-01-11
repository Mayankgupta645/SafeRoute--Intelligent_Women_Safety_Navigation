import express from "express";
import { makeSOSCall } from "../services/twilio.service.js";
import { createSOS } from "../services/sos.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // 🔍 DEBUG LOGGING
  console.log("=== SOS REQUEST ===");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Body type:", typeof req.body);
  console.log("==================");

  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("❌ Empty body received");
      return res.status(400).json({
        error: "Request body is empty. Make sure Content-Type is application/json"
      });
    }

    const { phone, lat, lon, source } = req.body;
    console.log("Extracted data:", { phone, lat, lon, source });

    // ✅ Validation
    if (!phone) {
      console.error("❌ Phone number missing");
      return res.status(400).json({
        error: "Phone number is required"
      });
    }

    // ✅ Save to database if location provided
    let sosRecord = null;
    if (lat && lon) {
      console.log("💾 Saving to database...");
      sosRecord = await createSOS({ lat, lon, source: source || "Manual" });
      console.log("✅ SOS saved to database:", sosRecord);
    } else {
      console.log("⚠️ No location provided, skipping database save");
    }

    // ✅ Make Twilio call
    console.log("📞 Making Twilio call to:", phone);
    await makeSOSCall(phone);
    console.log("✅ SOS call placed successfully");

    res.json({
      success: true,
      message: "SOS call placed successfully",
      sos: sosRecord
    });

  } catch (err) {
    console.error("❌ SOS ERROR:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;