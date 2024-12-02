import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { featureRequests } from "@db/schema";
import { eq, like, and, desc } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Feature request routes
  app.get("/api/feature-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const { search, status } = req.query;
    const user = req.user!;
    
    const whereClause: any[] = [];
    
    // Filter by submitter for non-admin users
    if (!user.isAdmin) {
      whereClause.push(eq(featureRequests.submitterId, user.id));
    }

    // Search filter
    if (search) {
      whereClause.push(
        like(featureRequests.title, `%${search}%`)
      );
    }

    // Status filter
    if (status && ["open", "in_review", "approved", "rejected", "in_progress", "completed"].includes(status)) {
      whereClause.push(eq(featureRequests.status, status as "open" | "in_review" | "approved" | "rejected" | "in_progress" | "completed"));
    }

    const requests = await db
      .select()
      .from(featureRequests)
      .where(whereClause.length ? and(...whereClause) : undefined)
      .orderBy(desc(featureRequests.createdAt));

    res.json(requests);
  });

  app.post("/api/feature-requests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    const [request] = await db
      .insert(featureRequests)
      .values({
        ...req.body,
        submitterId: req.user!.id,
      })
      .returning();

    res.json(request);
  });

  app.patch("/api/feature-requests/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    if (!req.user!.isAdmin) {
      return res.status(403).send("Not authorized");
    }

    const [request] = await db
      .update(featureRequests)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(featureRequests.id, parseInt(req.params.id)))
      .returning();

    res.json(request);
  });
}
