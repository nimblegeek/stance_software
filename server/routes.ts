import type { Express } from "express";
import { db } from "../db";
import { clubs, sessions, insertClubSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { register, login } from "./auth";
import express from "express";

export function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  /**
   * @api {get} /api/clubs Get all clubs
   * @apiName GetClubs
   * @apiGroup Clubs
   * @apiDescription Retrieves all clubs with their upcoming sessions
   * @apiSuccess {Object[]} clubs List of clubs with upcoming sessions
   */
  app.get("/api/clubs", async (req, res) => {
    try {
      const allClubs = await db.select().from(clubs);
      const clubsWithSessions = await Promise.all(
        allClubs.map(async (club) => {
          const upcomingSessions = await db
            .select()
            .from(sessions)
            .where(eq(sessions.clubId, club.id))
            .limit(2);
          return { ...club, upcomingSessions };
        })
      );
      res.json(clubsWithSessions);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  /**
   * @api {get} /api/clubs/:id Get club by ID
   * @apiName GetClub
   * @apiGroup Clubs
   * @apiParam {Number} id Club's unique ID
   * @apiSuccess {Object} club Club's data
   */
  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await db.select().from(clubs).where(eq(clubs.id, parseInt(req.params.id))).limit(1);
      if (club.length === 0) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club[0]);
    } catch (error) {
      console.error("Error fetching club:", error);
      res.status(500).json({ error: "Failed to fetch club" });
    }
  });

  /**
   * @api {post} /api/clubs Create new club
   * @apiName CreateClub
   * @apiGroup Clubs
   * @apiBody {Object} club Club data
   * @apiSuccess {Object} club Created club data
   */
  app.post("/api/clubs", async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const [newClub] = await db.insert(clubs).values(validatedData).returning();
      res.status(201).json(newClub);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid club data", details: error.errors });
      }
      console.error("Error creating club:", error);
      res.status(500).json({ error: "Failed to create club" });
    }
  });

  /**
   * @api {put} /api/clubs/:id Update club
   * @apiName UpdateClub
   * @apiGroup Clubs
   * @apiParam {Number} id Club's unique ID
   * @apiBody {Object} club Updated club data
   * @apiSuccess {Object} club Updated club data
   */
  app.put("/api/clubs/:id", async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const [updatedClub] = await db
        .update(clubs)
        .set(validatedData)
        .where(eq(clubs.id, parseInt(req.params.id)))
        .returning();
      
      if (!updatedClub) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      res.json(updatedClub);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid club data", details: error.errors });
      }
      console.error("Error updating club:", error);
      res.status(500).json({ error: "Failed to update club" });
    }
  });

  /**
   * @api {delete} /api/clubs/:id Delete club
   * @apiName DeleteClub
   * @apiGroup Clubs
   * @apiParam {Number} id Club's unique ID
   * @apiSuccess {Object} message Success message
   */
  app.delete("/api/clubs/:id", async (req, res) => {
    try {
      const [deletedClub] = await db
        .delete(clubs)
        .where(eq(clubs.id, parseInt(req.params.id)))
        .returning();
      
      if (!deletedClub) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      res.json({ message: "Club deleted successfully" });
    } catch (error) {
      console.error("Error deleting club:", error);
      res.status(500).json({ error: "Failed to delete club" });
    }
  });

  /**
   * @api {get} /api/clubs/:id/sessions Get club sessions
   * @apiName GetClubSessions
   * @apiGroup Clubs
   * @apiParam {Number} id Club's unique ID
   * @apiSuccess {Object[]} sessions List of club sessions
   */
  app.get("/api/clubs/:id/sessions", async (req, res) => {
    try {
      const clubSessions = await db
        .select()
        .from(sessions)
        .where(eq(sessions.clubId, parseInt(req.params.id)));
      res.json(clubSessions);
    } catch (error) {
      console.error("Error fetching club sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });
}