import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { featureRequests, statusEnum, insertFeatureRequestSchema } from "@db/schema";
import { eq, like, and, desc } from "drizzle-orm";
import { type ZodIssue } from "zod";

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
    const statusValue = status?.toString();
    if (statusValue && statusEnum.enumValues.includes(statusValue as any)) {
      whereClause.push(eq(featureRequests.status, statusValue as typeof statusEnum.enumValues[number]));
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

    try {
      const result = insertFeatureRequestSchema.safeParse({
        ...req.body,
        submitterId: req.user!.id
      });

      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: result.error.issues.map((issue: ZodIssue) => ({
            field: issue.path.map(p => p.toString()).join('.'),
            message: issue.message
          }))
        });
      }

      const [request] = await db
        .insert(featureRequests)
        .values(result.data)
        .returning();

      res.json(request);
    } catch (error: any) {
      console.error("Error creating feature request:", error);
      res.status(500).json({
        error: "Failed to create feature request",
        message: error.message
      });
    }
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
