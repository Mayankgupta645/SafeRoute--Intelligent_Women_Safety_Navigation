import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/route", async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon } = req.query;

    // ✅ FIXED validation (this was failing)
    if (
      startLat === undefined ||
      startLon === undefined ||
      endLat === undefined ||
      endLon === undefined
    ) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?alternatives=true&steps=true&geometries=geojson`;

    const response = await fetch(osrmUrl);
    const osrmData = await response.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      return res.status(404).json({ error: "No routes found" });
    }

    // ✅ TEMP crime score (DB integration later)
    const routes = osrmData.routes.map(r => ({
      geometry: r.geometry,
      distance: r.distance,
      duration: r.duration,
      legs: r.legs,
      crime_score: Math.random() * 5
    }));

    res.json({ routes });

  } catch (err) {
    console.error("ROUTE ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
