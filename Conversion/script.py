"""
Batch convert images from ./inputs to AVIF in ./outputs
and rename sequentially: 1.avif, 2.avif, ...

Requirements:
    pip install pillow pillow-avif-plugin
"""

from pathlib import Path
from PIL import Image
import pillow_avif  # registers AVIF support

INPUT_DIR = Path("inputs")
OUTPUT_DIR = Path("outputs")

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

def main():
    if not INPUT_DIR.exists():
        raise FileNotFoundError("inputs folder not found")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    images = sorted(
        p for p in INPUT_DIR.iterdir()
        if p.suffix.lower() in SUPPORTED_EXTS and p.is_file()
    )

    if not images:
        print("No supported images found.")
        return

    for index, img_path in enumerate(images, start=1):
        out_path = OUTPUT_DIR / f"{index}.avif"

        try:
            with Image.open(img_path) as im:
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGB")

                im.save(out_path, format="AVIF", quality=80)

            print(f"Converted: {img_path.name} → {out_path.name}")

        except Exception as e:
            print(f"Failed: {img_path.name} | {e}")

    print("Done.")

if __name__ == "__main__":
    main()
