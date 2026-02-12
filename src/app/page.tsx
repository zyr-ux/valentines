import fs from "fs";
import path from "path";
import HomeClient from "./HomeClient";

export default function Home() {
  const photoDir = process.env.GAME_PHOTOS_DIR || "public/game-photos";
  const gamePhotosDir = path.join(process.cwd(), photoDir);
  let availableImages: string[] = [];

  // Derive the public URL path by removing "public" from the directory path
  // e.g. "public/game-photos" -> "/game-photos"
  const publicUrlBase = "/" + photoDir.replace(/^public[\\/]/, "").replace(/\\/g, "/");

  try {
    const files = fs.readdirSync(gamePhotosDir);
    availableImages = files
      .filter((file) => /\.(avif|jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => `${publicUrlBase}/${file}`);
  } catch (error) {
    console.error("Error reading game photos directory:", error);
    // Fallback or empty array if directory doesn't exist
    availableImages = [];
  }

  return <HomeClient availableImages={availableImages} />;
}
