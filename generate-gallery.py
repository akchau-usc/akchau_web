#!/usr/bin/env python3
# generate_gallery.py
# Run with: python generate_gallery.py

import os
import json
import re
from datetime import datetime
from pathlib import Path

# Configuration
PHOTOS_FOLDER = "./photos/sf"
OUTPUT_FILE = "./gallery-sf-test.js"
GALLERY_TITLE = "San Francisco"
GALLERY_DESCRIPTION = "Exploring the beautiful city by the bay"

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'}

def generate_photo_title(filename):
    """Convert filename to readable title"""
    name_without_ext = Path(filename).stem
    
    # Replace common patterns
    title = name_without_ext
    title = re.sub(r'DSCF', 'San Francisco Shot', title)
    title = re.sub(r'IMG', 'SF Photo', title)
    title = re.sub(r'DSC', 'SF Capture', title)
    title = re.sub(r'[_-]', ' ', title)
    
    # Add descriptive names for generic patterns
    if re.match(r'^(San Francisco Shot|SF Photo|SF Capture)\s*\d*$', title):
        numbers = re.findall(r'\d+', name_without_ext)
        if numbers:
            title = f"{GALLERY_TITLE} View {numbers[0]}"
    
    # Capitalize words
    title = ' '.join(word.capitalize() for word in title.split())
    
    return title

def generate_placeholder(filename):
    """Generate placeholder text with emoji"""
    icons = ['📸', '🌉', '🏙️', '🌅', '🌊', '🚋', '🌫️', '🏔️']
    import random
    icon = random.choice(icons)
    title = generate_photo_title(filename)
    return f"{icon} {title}"

def scan_photos_folder():
    """Scan folder for image files"""
    try:
        if not os.path.exists(PHOTOS_FOLDER):
            print(f"❌ Error: Photos folder '{PHOTOS_FOLDER}' not found!")
            return []
        
        files = os.listdir(PHOTOS_FOLDER)
        image_files = [f for f in files if Path(f).suffix in IMAGE_EXTENSIONS]
        
        if not image_files:
            print(f"⚠️  No image files found in '{PHOTOS_FOLDER}'")
            return []
        
        print(f"✅ Found {len(image_files)} images in '{PHOTOS_FOLDER}':")
        for i, file in enumerate(sorted(image_files), 1):
            print(f"   {i}. {file}")
        
        return sorted(image_files)
    
    except Exception as e:
        print(f"❌ Error reading photos folder: {e}")
        return []

def generate_gallery_js(image_files):
    """Generate the JavaScript gallery file"""
    images_array = []
    
    for filename in image_files:
        title = generate_photo_title(filename)
        src = f"photos/sf/{filename}"
        placeholder = generate_placeholder(filename)
        
        images_array.append({
            "title": title,
            "src": src,
            "placeholder": placeholder,
            "description": f"Beautiful {GALLERY_TITLE.lower()} photography",
            "date": "Recent",
            "location": GALLERY_TITLE,
            "settings": "Various settings"
        })
    
    # Convert to JavaScript format
    images_json = json.dumps(images_array, indent=4)
    
    js_content = f'''// gallery-sf.js - Auto-generated gallery for {GALLERY_TITLE}
// Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
// Total photos: {len(image_files)}

let currentImageIndex = 0;

// Image data - Auto-generated from photos/sf folder
const images = {images_json};

// Function to open lightbox with specific image
function openLightbox(index) {{
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {{
        // Image loaded successfully, display it
        lightboxImage.innerHTML = `<img src="${{images[index].src}}" alt="${{images[index].title}}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    }};
    img.onerror = function() {{
        // Image failed to load, show placeholder
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${{images[index].placeholder}}</div>`;
    }};
    img.src = images[index].src;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}}

// Function to close lightbox
function closeLightbox() {{
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}}

// Function to show next image
function nextImage() {{
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {{
        lightboxImage.innerHTML = `<img src="${{images[currentImageIndex].src}}" alt="${{images[currentImageIndex].title}}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    }};
    img.onerror = function() {{
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${{images[currentImageIndex].placeholder}}</div>`;
    }};
    img.src = images[currentImageIndex].src;
}}

// Function to show previous image
function previousImage() {{
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {{
        lightboxImage.innerHTML = `<img src="${{images[currentImageIndex].src}}" alt="${{images[currentImageIndex].title}}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    }};
    img.onerror = function() {{
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${{images[currentImageIndex].placeholder}}</div>`;
    }};
    img.src = images[currentImageIndex].src;
}}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {{
    
    // Close lightbox when clicking outside the image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {{
        lightbox.addEventListener('click', function(e) {{
            if (e.target === this) {{
                closeLightbox();
            }}
        }});
    }}

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {{
        if (lightbox && lightbox.classList.contains('active')) {{
            if (e.key === 'Escape') {{
                closeLightbox();
            }} else if (e.key === 'ArrowRight') {{
                nextImage();
            }} else if (e.key === 'ArrowLeft') {{
                previousImage();
            }}
        }}
    }});

    // Animate cards on load
    const cards = document.querySelectorAll('.photo-card');
    cards.forEach((card, index) => {{
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {{
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }}, index * 100);
    }});

    // Update gallery stats with actual photo count
    updateGalleryStats(images.length, 1, '2024', 'Canon');
}});

// Function to preload images for better performance
function preloadImages() {{
    images.forEach(imageData => {{
        const img = new Image();
        img.src = imageData.src;
    }});
}}

// Call preload when page loads
window.addEventListener('load', preloadImages);

// Function to update gallery stats dynamically
function updateGalleryStats(photoCount, locationCount, year, camera) {{
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {{
        stats[0].textContent = photoCount;
        stats[1].textContent = locationCount;
        stats[2].textContent = year;
        stats[3].textContent = camera;
    }}
}}

// Touch/swipe support for mobile devices
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {{
    if (document.getElementById('lightbox').classList.contains('active')) {{
        startX = e.touches[0].clientX;
    }}
}});

document.addEventListener('touchend', function(e) {{
    if (document.getElementById('lightbox').classList.contains('active')) {{
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }}
}});

function handleSwipe() {{
    const swipeThreshold = 50; // Minimum distance for a swipe
    const difference = startX - endX;
    
    if (Math.abs(difference) > swipeThreshold) {{
        if (difference > 0) {{
            // Swipe left - next image
            nextImage();
        }} else {{
            // Swipe right - previous image
            previousImage();
        }}
    }}
}}

console.log('{GALLERY_TITLE} Gallery loaded with', images.length, 'photos');
'''

    return js_content

def main():
    print('🔄 Generating gallery for San Francisco photos...\n')
    
    # Scan the photos folder
    image_files = scan_photos_folder()
    
    if not image_files:
        print('\n❌ No images found. Please check your photos folder.')
        return
    
    # Generate the JavaScript content
    js_content = generate_gallery_js(image_files)
    
    # Write to file
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f'\n✅ Successfully generated \'{OUTPUT_FILE}\'')
        print(f'📊 Gallery includes {len(image_files)} photos')
        print(f'📁 Photos path: photos/sf/')
        print(f'\n🚀 Next steps:')
        print(f'   1. Link \'{OUTPUT_FILE}\' to your gallery-sf.html file')
        print(f'   2. Make sure photos/sf/ folder is accessible from your website')
        print(f'   3. Update photo titles in the generated file if needed')
        
    except Exception as e:
        print(f'❌ Error writing gallery file: {e}')

if __name__ == "__main__":
    main()