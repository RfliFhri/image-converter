import express from "express";
import cors from "cors";
import convertRoutes from "./src/routes/convertRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
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