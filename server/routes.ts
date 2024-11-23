import type { Express } from "express";
import { db } from "../db";
import { clubs, sessions } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Get all clubs
  app.get("/api/clubs", async (req, res) => {
    try {
      const allClubs = await db.select().from(clubs);
      res.json(allClubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  // Get single club
  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await db.select().from(clubs).where(eq(clubs.id, parseInt(req.params.id))).limit(1);
      if (club.length === 0) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch club" });
    }
  });

  // Get sessions for a club
  app.get("/api/clubs/:id/sessions", async (req, res) => {
    try {
      const clubSessions = await db
        .select()
        .from(sessions)
        .where(eq(sessions.clubId, parseInt(req.params.id)));
      res.json(clubSessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });
}
