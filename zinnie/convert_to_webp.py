#!/usr/bin/env python3
"""
Image to WebP Converter
Converts all images in the pictures directory to WebP format for better web performance.
"""

import os
from PIL import Image
import sys

def convert_image_to_webp(input_path, output_path, quality=85):
    """
    Convert an image to WebP format.
    
    Args:
        input_path (str): Path to the input image
        output_path (str): Path to save the WebP image
        quality (int): WebP quality (0-100, default 85)
    """
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary (WebP doesn't support transparency in all cases)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode in ('RGBA', 'LA'):
                    background.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
                    img = background
            
            # Convert to RGB if not already
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as WebP
            img.save(output_path, 'WebP', quality=quality, optimize=True)
            return True
    except Exception as e:
        print(f"Error converting {input_path}: {str(e)}")
        return False

def main():
    # Define the pictures directory
    pictures_dir = os.path.join(os.path.dirname(__file__), 'pictures')
    
    if not os.path.exists(pictures_dir):
        print(f"Pictures directory not found: {pictures_dir}")
        sys.exit(1)
    
    # Supported image formats
    supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.gif'}
    
    # Track conversion statistics
    converted_count = 0
    skipped_count = 0
    error_count = 0
    
    print(f"Converting images in: {pictures_dir}")
    print("=" * 50)
    
    # Iterate through all files in the pictures directory
    for filename in os.listdir(pictures_dir):
        file_path = os.path.join(pictures_dir, filename)
        
        # Skip if not a file
        if not os.path.isfile(file_path):
            continue
        
        # Get file extension
        _, ext = os.path.splitext(filename.lower())
        
        # Skip if not a supported image format
        if ext not in supported_formats:
            continue
        
        # Skip if already a WebP file
        if ext == '.webp':
            print(f"Skipping (already WebP): {filename}")
            skipped_count += 1
            continue
        
        output_path = os.path.join(os.path.dirname(__file__), 'webp')
        # Create output filename
        base_name = os.path.splitext(filename)[0]
        # Handle special characters and spaces in filenames
        webp_name = base_name.replace(' ', '_') + '.webp'
        webp_path = os.path.join(output_path, webp_name)
        
        # Convert the image
        print(f"Converting: {filename} -> {webp_name}")
        
        if convert_image_to_webp(file_path, webp_path):
            converted_count += 1
            
            # Get file sizes for comparison
            original_size = os.path.getsize(file_path)
            webp_size = os.path.getsize(webp_path)
            compression_ratio = ((original_size - webp_size) / original_size) * 100
            
            print(f"  ✓ Success! Size reduction: {compression_ratio:.1f}% "
                  f"({original_size:,} -> {webp_size:,} bytes)")
        else:
            error_count += 1
            print(f"  ✗ Failed to convert {filename}")
    
    # Print summary
    print("\n" + "=" * 50)
    print("CONVERSION SUMMARY:")
    print(f"Successfully converted: {converted_count}")
    print(f"Skipped (already WebP): {skipped_count}")
    print(f"Errors: {error_count}")
    print(f"Total files processed: {converted_count + skipped_count + error_count}")
    
    if converted_count > 0:
        print(f"\n✓ All conversions complete!")
        print("You can now update your HTML to use the .webp files for better performance.")
    elif error_count == 0 and skipped_count > 0:
        print(f"\n✓ All images are already in WebP format!")
    else:
        print(f"\n⚠ Some errors occurred during conversion.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nConversion cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
        sys.exit(1)