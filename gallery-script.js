// Gallery JavaScript - Save as gallery-script.js

let currentImageIndex = 0;

// Image data - Replace placeholder with actual image paths
const images = [
    { 
        title: "Golden Gate Bridge at Sunset", 
        src: "/Users/annachau/Documents/personal website/akchau_web/photos/palos verdes/DSCF3136.JPG",
        placeholder: "📸 Golden Gate Bridge at Sunset" 
    },
    { 
        title: "Downtown SF Skyline", 
        src: "photos/downtown-skyline.jpg",
        placeholder: "🏙️ Downtown SF Skyline" 
    },
    { 
        title: "Alcatraz Island", 
        src: "photos/alcatraz.jpg",
        placeholder: "🌊 Alcatraz Island" 
    },
    { 
        title: "Cable Car on Lombard Street", 
        src: "photos/cable-car.jpg",
        placeholder: "🚋 Cable Car on Lombard Street" 
    },
    { 
        title: "Fog Rolling Over Hills", 
        src: "photos/morning-fog.jpg",
        placeholder: "🌫️ Fog Rolling Over Hills" 
    },
    { 
        title: "Bay Bridge Night Lights", 
        src: "photos/bay-bridge-night.jpg",
        placeholder: "🌉 Bay Bridge Night Lights" 
    }
];

// Function to open lightbox with specific image
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {
        // Image loaded successfully, display it
        lightboxImage.innerHTML = `<img src="${images[index].src}" alt="${images[index].title}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    };
    img.onerror = function() {
        // Image failed to load, show placeholder
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${images[index].placeholder}</div>`;
    };
    img.src = images[index].src;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Function to show next image
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {
        lightboxImage.innerHTML = `<img src="${images[currentImageIndex].src}" alt="${images[currentImageIndex].title}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    };
    img.onerror = function() {
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${images[currentImageIndex].placeholder}</div>`;
    };
    img.src = images[currentImageIndex].src;
}

// Function to show previous image
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Check if actual image exists, otherwise show placeholder
    const img = new Image();
    img.onload = function() {
        lightboxImage.innerHTML = `<img src="${images[currentImageIndex].src}" alt="${images[currentImageIndex].title}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 10px;">`;
    };
    img.onerror = function() {
        lightboxImage.innerHTML = `<div style="width: 600px; height: 400px; background: linear-gradient(135deg, #a2b0f0, #ad7edc); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; border-radius: 10px;">${images[currentImageIndex].placeholder}</div>`;
    };
    img.src = images[currentImageIndex].src;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    
    // Close lightbox when clicking outside the image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                previousImage();
            }
        }
    });

    // Animate cards on load
    const cards = document.querySelectorAll('.photo-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add loading effect to gallery stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'scale(0.5)';
        stat.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'scale(1)';
        }, 500 + (index * 200));
    });
});

// Function to preload images for better performance
function preloadImages() {
    images.forEach(imageData => {
        const img = new Image();
        img.src = imageData.src;
    });
}

// Call preload when page loads
window.addEventListener('load', preloadImages);

// Function to update gallery stats dynamically
function updateGalleryStats(photoCount, locationCount, year, camera) {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = photoCount;
        stats[1].textContent = locationCount;
        stats[2].textContent = year;
        stats[3].textContent = camera;
    }
}

// Touch/swipe support for mobile devices
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {
    if (document.getElementById('lightbox').classList.contains('active')) {
        startX = e.touches[0].clientX;
    }
});

document.addEventListener('touchend', function(e) {
    if (document.getElementById('lightbox').classList.contains('active')) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const difference = startX - endX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            previousImage();
        }
    }
}

// Function to dynamically add photos to gallery
function addPhotoToGallery(imageData, insertBefore = null) {
    images.push(imageData);
    
    const photoGrid = document.querySelector('.photo-grid');
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.onclick = () => openLightbox(images.length - 1);
    
    photoCard.innerHTML = `
        <div class="photo-container">
            <img src="${imageData.src}" alt="${imageData.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span>${imageData.placeholder}</span>'">
        </div>
        <div class="photo-info">
            <h3>${imageData.title}</h3>
            <p>${imageData.description || 'Beautiful capture from San Francisco.'}</p>
            <div class="photo-meta">
                <span>📅 ${imageData.date || 'Recent'}</span>
                <span>📍 ${imageData.location || 'San Francisco'}</span>
                <span>⚙️ ${imageData.settings || 'Various settings'}</span>
            </div>
        </div>
    `;
    
    if (insertBefore) {
        photoGrid.insertBefore(photoCard, insertBefore);
    } else {
        photoGrid.appendChild(photoCard);
    }
    
    // Animate the new card
    photoCard.style.opacity = '0';
    photoCard.style.transform = 'translateY(30px)';
    setTimeout(() => {
        photoCard.style.opacity = '1';
        photoCard.style.transform = 'translateY(0)';
    }, 100);
}

// Example usage of adding a new photo:
// addPhotoToGallery({
//     title: "New San Francisco Photo",
//     src: "photos/new-photo.jpg",
//     placeholder: "📸 New Photo",
//     description: "A beautiful new capture",
//     date: "June 2025",
//     location: "Fisherman's Wharf",
//     settings: "f/5.6, 1/200s"
// });