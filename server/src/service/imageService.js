import sharp from "sharp";
import path from "path";

export const convertToWebp = async (files) => {
  // Tentukan ambang batas (misal: 100KB). 
  // Jika di bawah ini, kita anggap sudah cukup kecil untuk web.
  const SIZE_THRESHOLD = 100 * 1024; 

  const jobs = files.map(async (file) => {
    const parsed = path.parse(file.originalname);
    const newName = parsed.name + ".webp";

    let imageProcessor = sharp(file.buffer);
    
    // Logika Adaptif:
    if (file.size > SIZE_THRESHOLD) {
      // Jika file besar, lakukan optimasi/kompresi
      imageProcessor = imageProcessor.webp({ 
        quality: 85, // Naikkan ke 85 agar tidak terlalu blur
        effort: 4    // Meningkatkan efisiensi kompresi tanpa merusak visual
      });
    } else {
      // Jika file sudah kecil, gunakan lossless atau kualitas maksimal (100)
      // Ini hanya merubah format ke WebP tanpa mengurangi data visual secara drastis
      imageProcessor = imageProcessor.webp({ 
        quality: 100, 
        lossless: false // Tetap lossy tapi 100% quality agar ukurannya tetap efisien
      });
    }

    const buffer = await imageProcessor.toBuffer();

    return {
      name: newName,
      buffer
    };
  });

  return Promise.all(jobs);
};