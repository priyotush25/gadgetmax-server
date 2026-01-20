const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:3000",
  "https://gadget-max.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("ShopLite API is running");
});

// Fix for Chrome DevTools CSP error
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.sendStatus(204);
});

// Mock Data
let items = [
  {
    id: "1",
    name: "Modern Desk Lamp",
    price: "45",
    category: "Electronics",
    description:
      "A sleek, minimalist lamp with adjustable brightness and touch control. Perfect for modern workspaces.",
    image: "/images/desk-lamp.png",
  },
  {
    id: "2",
    name: "Art Deco Vase",
    price: "120",
    category: "Decor",
    description:
      "Handcrafted ceramic vase with unique textures and an elegant silhouette. A statement piece for any room.",
    image: "/images/vase.png",
  },
  {
    id: "3",
    name: "Premium Headphones",
    price: "299",
    category: "Audio",
    description:
      "Studio-grade sound quality with active noise cancellation and premium leather ear cushions.",
    image: "/images/headphones.png",
  },
  {
    id: "4",
    name: "Leather Journal",
    price: "35",
    category: "Stationery",
    description:
      "Genuine leather-bound journal with high-quality recycled paper. Ideal for thoughts, sketches, and plans.",
    image: "/images/journal.png",
  },
];

// Routes
app.get("/api/items", (req, res) => {
  res.json(items);
});

app.get("/api/items/:id", (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ message: "Item not found" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Mock auth logic: demo@example.com / password
  if (email === "demo@example.com" && password === "password") {
    res.cookie("auth_token", "mock_token_123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000, // 1 hour
    });
    res.json({
      message: "Login successful",
      user: { email: "demo@example.com", name: "Demo User" },
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body;
  // Mock signup logic - in a real app, you'd save to a database
  res.cookie("auth_token", "mock_token_123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3600000, // 1 hour
  });
  res.status(201).json({
    message: "Signup successful",
    user: { email, name },
  });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.auth_token;
  if (token === "mock_token_123") {
    // In a real app, you'd verify the token and fetch user from DB
    res.json({ user: { email: "demo@example.com", name: "Demo User" } });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

app.post("/api/items", (req, res) => {
  const { name, price, category, description, image } = req.body;
  const newItem = {
    id: (items.length + 1).toString(),
    name,
    price,
    category,
    description,
    image: image || "/images/hero-showcase.png",
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// if (process.env.NODE_ENV !== "production") {
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// }

module.exports = app;
