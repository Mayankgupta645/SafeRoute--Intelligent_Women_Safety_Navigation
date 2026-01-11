import express from "express";


const router = express.Router();

router.get("/geocode", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing query" });

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q + ", India"
    )}&format=json&limit=1`;

    const r = await fetch(url, {
      headers: { "User-Agent": "SafeRoute-App" }
    });

    const data = await r.json();

    if (!data.length) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json({
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      display_name: data[0].display_name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

export default router;
