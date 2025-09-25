import os
import json

# Configuration
photo_folders = {
    'san-francisco': '/Users/annachau/Documents/personal website/akchau_web/photos/palos verdes',
}

image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP')

def get_photos_from_folder(folder_path):
    if not os.path.exists(folder_path):
        print(f"Folder {folder_path} doesn't exist, skipping...")
        return []
    
    try:
        files = os.listdir(folder_path)
        image_files = [f for f in files if f.endswith(image_extensions)]
        return [f"{folder_path}/{file}" for file in image_files]
    except Exception as e:
        print(f"Error reading folder {folder_path}: {e}")
        return []

def generate_gallery_code():
    galleries = {}
    
    for key, folder_path in photo_folders.items():
        galleries[key] = get_photos_from_folder(folder_path)
        print(f"Found {len(galleries[key])} photos in {folder_path}")
    
    # Generate JavaScript code
    gallery_code = f"const galleries = {json.dumps(galleries, indent=4)};"
    
    # Write to file
    with open('gallery-config.js', 'w') as f:
        f.write(gallery_code)
    
    print("\nGallery configuration written to gallery-config.js")
    print("Copy the contents of this file into your index.html")
    
    # Also output to console
    print("\n" + "="*50)
    print("COPY THIS INTO YOUR INDEX.HTML:")
    print("="*50)
    print(gallery_code)

if __name__ == "__main__":
    generate_gallery_code()