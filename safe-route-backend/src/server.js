import "./config/env.js";  // ← Load env FIRST, before anything else
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔍 Environment Check:");
  console.log("  TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID ? "✅ Loaded" : "❌ Missing");
  console.log("  TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✅ Loaded" : "❌ Missing");
  console.log("  TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER ? "✅ Loaded" : "❌ Missing");
});