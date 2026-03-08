import sharp from "sharp";
import path from "path";

export const convertToWebp = async (files) => {

  const jobs = files.map(async (file) => {

    const parsed = path.parse(file.originalname);
    const newName = parsed.name + ".webp";

    const buffer = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    return {
      name: newName,
      buffer
    };

  });

  return Promise.all(jobs);

};