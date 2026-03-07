import express from "express";
import multer from "multer";
import sharp from "sharp";
import archiver from "archiver";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

/*
========================
MULTER MEMORY STORAGE
========================
*/
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 50
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  }
});

/*
========================
HOME ROUTE
========================
*/
app.get("/", (req, res) => {
  res.json({
    message: "Image Converter API running"
  });
});

/*
========================
CONVERT ROUTE
========================
*/
app.post("/convert", upload.array("images", 50), async (req, res) => {

  try {

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded"
      });
    }

    /*
    ========================
    CONVERT ALL IMAGES
    ========================
    */

    const jobs = files.map(async (file) => {

      const parsed = path.parse(file.originalname);
      const newName = parsed.name + ".webp";

      const buffer = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      return {
        name: newName,
        buffer: buffer
      };

    });

    const results = await Promise.all(jobs);

    /*
    ========================
    CREATE ZIP
    ========================
    */

    res.attachment("converted-images.zip");

    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    archive.pipe(res);

    for (const image of results) {
      archive.append(image.buffer, {
        name: image.name
      });
    }

    await archive.finalize();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Conversion failed"
    });

  }

});

/*
========================
START SERVER
========================
*/

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});