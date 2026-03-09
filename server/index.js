import express from "express";
import cors from "cors";
import convertRoutes from "./src/routes/convertRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: [
    "https://rflifhri.github.io", 
    "http://localhost:5173" // Agar tetap bisa ngetes di local
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Image Converter API running"
  });
});

app.use("/convert", convertRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});