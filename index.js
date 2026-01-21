const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const serverless = require("serverless-http"); // << important
require("dotenv").config();

const app = express();

// Allowed origins
const allowedOrigins = new Set([
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "../public/images"))); // static images

// Mock data
let items = [
  { id: "1", name: "Modern Desk Lamp", price: "45", category: "Electronics", description: "A sleek lamp.", image: "/images/desk-lamp.png" },
  { id: "2", name: "Art Deco Vase", price: "120", category: "Decor", description: "Handcrafted vase.", image: "/images/vase.png" },
];

// Routes
app.get("/items", (req, res) => res.json(items));
app.get("/items/:id", (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ message: "Item not found" });
});
app.post("/items", (req, res) => {
  const { name, price, category, description, image } = req.body;
  const newItem = {
    id: (items.length + 1).toString(),
    name, price, category, description,
    image: image || "/images/hero-showcase.png"
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Auth routes
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if(email === "demo@example.com" && password === "password") {
    res.cookie("auth_token", "mock_token_123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000
    });
    res.json({ message: "Login successful", user: { email, name: "Demo User" } });
  } else res.status(401).json({ message: "Invalid credentials" });
});

app.get("/auth/me", (req, res) => {
  const token = req.cookies.auth_token;
  if(token === "mock_token_123") res.json({ user: { email: "demo@example.com", name: "Demo User" } });
  else res.status(401).json({ message: "Not authenticated" });
});

// Export as serverless function for Vercel
module.exports = serverless(app);
