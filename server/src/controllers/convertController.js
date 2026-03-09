import { convertToWebp } from "../service/imageService.js";
import archiver from "archiver";

export const convertImages = async (req, res) => {

  try {

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded"
      });
    }

    const results = await convertToWebp(files);

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

};