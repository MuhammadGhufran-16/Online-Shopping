import { sanitizeFileName } from "./storageApi";

export const uploadProductImages = async (files = [], productId) => {
  // Store images locally in /images/ directory
  // Return array of image paths like ["/images/sugarImg.jpg"]
  const imagePaths = files.map((file, index) => {
    const extensionSafeName = sanitizeFileName(file.name);
    // Using productId and index to avoid filename conflicts
    return `/images/${productId}_${index}_${extensionSafeName}`;
  });
  
  return Promise.resolve(imagePaths);
};