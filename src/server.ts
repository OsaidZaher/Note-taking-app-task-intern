//single file for all back end logic

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// env check
console.log("SUPABASE_URL is set:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_KEY is set:", !!process.env.SUPABASE_KEY);
console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);

// Supabase Client for db
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

// JWT Authentication Middleware using nextFunction and responses
const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = user;
    next();
  });
};

// Login Route
app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    console.log("Login attempt for:", username);

    if (username !== "intern" || password !== "letmein") {
      console.log("Invalid credentials: Hardcoded check failed");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // select the only row in all of the users table which is the hardcoded value
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    console.log("Supabase query result:", { data, error });

    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error: error.message });
      return;
    }

    if (!data) {
      console.log("User not found in database");
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Create JWT token with user ID from database and expiry token
    const token = jwt.sign(
      { userId: data.id, username: data.username },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    console.log("Login successful, token issued");
    res.json({ token });
  } catch (error) {
    console.error("Unexpected error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Notes Routes
app.get(
  "/api/notes",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, error } = await supabase.from("notes").select("*");
      if (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      res.json(data);
    } catch (error) {
      console.error("Unexpected error fetching notes:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.post(
  "/api/notes",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const userId = req.user.userId; // Get user ID from token

      // Use created_at instead of createdAt to match your database schema
      const { error } = await supabase.from("notes").insert([
        {
          title,
          content,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(201).json({ message: "Note created" });
    } catch (error) {
      console.error("Unexpected error creating note:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete(
  "/api/notes/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      res.json({ message: "Note deleted" });
    } catch (error) {
      console.error("Unexpected error deleting note:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Start Server on a different port than Next.js
const PORT = process.env.PORT || 5000; // Using port 5000 to avoid conflict with Next.js
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
