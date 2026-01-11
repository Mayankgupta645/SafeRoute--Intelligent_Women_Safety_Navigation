import express from "express";
import db from "../db/index.js";

const router = express.Router();

// GET crimes
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, type, ST_AsGeoJSON(geom) AS geom, created_at
      FROM crime_incidents
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST crime
router.post("/", async (req, res) => {
  const { type, lat, lon } = req.body;

  try {
    await db.query(
      `INSERT INTO crime_incidents (type, geom)
       VALUES ($1, ST_SetSRID(ST_Point($2, $3), 4326))`,
      [type, lon, lat]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
