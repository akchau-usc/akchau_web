"""generate_thumbs.py
Create thumbnails for images under photos/* and save them to photos/<album>/thumbs/<name>_thumb.jpg

Usage:
    py -m pip install Pillow
    py generate_thumbs.py
"""
from PIL import Image, ImageOps
from pathlib import Path

ROOT = Path(__file__).parent
PHOTOS_DIR = ROOT / 'photos'
THUMB_SIZE = (400, 400)

def make_thumb(src_path: Path, dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with Image.open(src_path) as im:
            # Apply EXIF orientation so thumbnails have correct rotation
            im = ImageOps.exif_transpose(im)
            im.thumbnail(THUMB_SIZE)
            # convert to RGB and save as JPEG for consistent small size
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            im.save(dest_path, format='JPEG', quality=75, optimize=True)
            print(f"Thumb created: {dest_path}")
    except Exception as e:
        print(f"Failed to create thumb for {src_path}: {e}")

def main():
    if not PHOTOS_DIR.exists():
        print(f"Photos directory not found: {PHOTOS_DIR}")
        return

    for album in PHOTOS_DIR.iterdir():
        if not album.is_dir():
            continue
        thumbs_dir = album / 'thumbs'
        for img in album.iterdir():
            if not img.is_file():
                continue
            if img.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.gif', '.webp'):
                continue
            # skip thumbnails
            if img.parent.name == 'thumbs' or img.stem.endswith('_thumb'):
                continue
            dest = thumbs_dir / f"{img.stem}_thumb.jpg"
            make_thumb(img, dest)

if __name__ == '__main__':
    main()
