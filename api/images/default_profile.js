// api/images/[imageName].js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { imageName } = req.query;  // Get the image name from the URL

  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

  try {
    const imageData = fs.readFileSync(imagePath);

    // Determine the content type based on the file extension.  A more robust solution
    // might use a library like 'mime-types' for accurate content type detection.
    let contentType = 'image/jpeg'; // Default
    if (imageName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (imageName.endsWith('.gif')) {
      contentType = 'image/gif';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for a year
    res.status(200).send(imageData); // Send the image data
  } catch (error) {
    console.error('Error serving image:', error);
    return res.status(404).json({ error: 'Image not found' });
  }
}