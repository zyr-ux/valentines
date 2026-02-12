import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import HomeClient from "./HomeClient";

export default function Home() {
  const photoDir = process.env.GAME_PHOTOS_DIR || "public/game-photos";
  const gamePhotosDir = path.join(process.cwd(), photoDir);
  let availableImages: { src: string; width: number; height: number }[] = [];

  // Derive the public URL path by removing "public" from the directory path
  // e.g. "public/game-photos" -> "/game-photos"
  const publicUrlBase = "/" + photoDir.replace(/^public[\\/]/, "").replace(/\\/g, "/");

  try {
    const files = fs.readdirSync(gamePhotosDir);
    availableImages = files
      .filter((file) => /\.(avif|jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => {
        const filePath = path.join(gamePhotosDir, file);
        let dimensions = { width: 0, height: 0 };
        try {
          // Read file buffer to avoid type issues with string path in some environments/versions
          const buffer = fs.readFileSync(filePath);
          const { width, height } = sizeOf(buffer);
          if (width && height) {
            dimensions = { width, height };
          }
        } catch (e) {
          console.error(`Error reading dimensions for ${file}:`, e);
        }

        return {
          src: `${publicUrlBase}/${file}`,
          width: dimensions.width,
          height: dimensions.height,
        };
      });
  } catch (error) {
    console.error("Error reading game photos directory:", error);
    // Fallback or empty array if directory doesn't exist
    availableImages = [];
  }

  const bypassMinigame = process.env.BYPASS_MINIGAME === "true";
  const enableMusic = process.env.ENABLE_MUSIC === "true";

  return (
    <HomeClient
      availableImages={availableImages}
      bypassMinigame={bypassMinigame}
      enableMusic={enableMusic}
    />
  );
}
