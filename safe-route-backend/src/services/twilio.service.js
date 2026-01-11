import twilio from "twilio";

// 🔍 DEBUG: Log what we're actually getting
console.log("🔍 Loading Twilio credentials...");
console.log("  ACCOUNT_SID length:", process.env.TWILIO_ACCOUNT_SID?.length || 0);
console.log("  AUTH_TOKEN length:", process.env.TWILIO_AUTH_TOKEN?.length || 0);
console.log("  PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const twilioPhone = process.env.TWILIO_PHONE_NUMBER?.trim();

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing or empty");
}

const client = twilio(accountSid, authToken);

export const makeSOSCall = async (toNumber) => {
  if (!toNumber) {
    throw new Error("Phone number (to) is missing");
  }

  // 🔍 DEBUG: Check environment variables
  console.log("🔍 Twilio Config Check:");
  console.log("  ACCOUNT_SID:", accountSid ? "✅ Set" : "❌ Missing");
  console.log("  AUTH_TOKEN:", authToken ? "✅ Set" : "❌ Missing");
  console.log("  PHONE_NUMBER:", twilioPhone || "❌ MISSING!");
  
  if (!twilioPhone) {
    throw new Error("TWILIO_PHONE_NUMBER environment variable is not set");
  }

  return await client.calls.create({
    to: toNumber,
    from: twilioPhone,
    twiml: `<Response>
              <Say voice="alice">
                This is an emergency alert. The user needs immediate help.
              </Say>
            </Response>`
  });
};