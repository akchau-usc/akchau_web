// Cat-designed website functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Typing animation for main title
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    
    if (typingText && cursor) {
        const originalText = typingText.getAttribute('data-text') || typingText.textContent;
        
        // Make sure cursor is visible and text is preserved initially
        cursor.style.opacity = '1';
        
        function typeWriter() {
            // Clear text and start typing animation
            typingText.textContent = '';
            cursor.style.opacity = '1';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    typingText.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Hide cursor briefly, then wait 10 seconds and start over
                    setTimeout(() => {
                        cursor.style.opacity = '0';
                        setTimeout(() => {
                            typeWriter();
                        }, 10000);
                    }, 1000);
                }
            }, 120);
        }
        
        // Start the typing animation after a delay, but don't clear text until we're ready
        setTimeout(() => {
            if (typingText && originalText) {
                typeWriter();
            }
        }, 2000);
    }
    
    // Gallery typing animation
    const galleryTyping = document.querySelector('.typing-gallery');
    
    if (galleryTyping) {
        const galleryText = galleryTyping.getAttribute('data-text') || galleryTyping.textContent;
        
        function typeGallery() {
            // Only clear text if we have the data-text attribute, preserving fallback
            if (galleryTyping.getAttribute('data-text')) {
                galleryTyping.textContent = '';
            }
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < galleryText.length) {
                    galleryTyping.textContent += galleryText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Wait 8 seconds then start over
                    setTimeout(typeGallery, 8000);
                }
            }, 120);
        }
        
        // Start gallery typing
        setTimeout(typeGallery, 1000);
    }
    
    // Add realistic clothesline physics
    const photos = document.querySelectorAll('.photo-hanging');
    
    photos.forEach((photo, index) => {
        // Add random initial swing delay
        photo.style.animationDelay = `${Math.random() * 2}s`;
        
        // Enhanced hover effect with momentum
        photo.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            
            // Add some random rotation for realism
            const randomRotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
            this.style.transform = `rotate(${randomRotation}deg) scale(1.1) translateY(-10px)`;
            
            // Slight delay for neighboring photos to react
            const neighbors = getNeighbors(index);
            neighbors.forEach((neighbor, i) => {
                if (neighbor) {
                    setTimeout(() => {
                        neighbor.style.transform += ` rotate(${(Math.random() - 0.5) * 4}deg)`;
                    }, i * 100);
                }
            });
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.animation = '';
            
            // Reset neighbors
            const neighbors = getNeighbors(index);
            neighbors.forEach(neighbor => {
                if (neighbor) {
                    neighbor.style.transform = '';
                }
            });
        });
        
        // Add click interaction for fun
        photo.addEventListener('click', function() {
            // Create a "meow" bubble
            createMeowBubble(this);
            
            // Add bounce effect
            this.style.animation = 'photoClick 0.6s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
    
    function getNeighbors(index) {
        const allPhotos = Array.from(photos);
        return [
            allPhotos[index - 1],
            allPhotos[index + 1]
        ].filter(photo => photo);
    }
    
    function createMeowBubble(photo) {
        const meows = ['meow! 🐱', 'purr~ 💕', 'mrow! 😸', '*happy cat noises*', 'nya! ✨'];
        const bubble = document.createElement('div');
        bubble.textContent = meows[Math.floor(Math.random() * meows.length)];
        bubble.className = 'meow-bubble';
        
        const rect = photo.getBoundingClientRect();
        bubble.style.position = 'fixed';
        bubble.style.left = rect.left + rect.width/2 + 'px';
        bubble.style.top = rect.top - 20 + 'px';
        bubble.style.transform = 'translateX(-50%)';
        bubble.style.background = 'rgba(214, 104, 160, 0.9)';
        bubble.style.color = 'white';
        bubble.style.padding = '8px 15px';
        bubble.style.borderRadius = '20px';
        bubble.style.fontSize = '0.9rem';
        bubble.style.zIndex = '1000';
        bubble.style.pointerEvents = 'none';
        bubble.style.animation = 'meowFloat 2s ease-out forwards';
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 2000);
    }
    
    // Random paw prints that appear occasionally
    function createRandomPawPrint() {
        const paw = document.createElement('div');
        paw.innerHTML = '🐾';
        paw.className = 'random-paw';
        paw.style.position = 'fixed';
        paw.style.fontSize = '1.5rem';
        paw.style.opacity = '0.3';
        paw.style.pointerEvents = 'none';
        paw.style.zIndex = '1';
        paw.style.left = Math.random() * window.innerWidth + 'px';
        paw.style.top = Math.random() * window.innerHeight + 'px';
        paw.style.animation = 'pawFade 3s ease-out forwards';
        
        document.body.appendChild(paw);
        
        setTimeout(() => {
            if (paw.parentNode) {
                paw.parentNode.removeChild(paw);
            }
        }, 3000);
    }
    
    // Add random paw prints every 10-20 seconds
    setInterval(createRandomPawPrint, Math.random() * 15000 + 10000);
    
    // Lazy loading for gallery images
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.remove('lazy-load');
                        
                        // Add loaded class for smooth transition
                        img.onload = () => {
                            img.classList.add('loaded');
                        };
                        
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Enhanced photo interaction for lazy loaded images
    function setupPhotoInteractions() {
        const photos = document.querySelectorAll('.photo-hanging');
        
        photos.forEach((photo, index) => {
            // Click to view full size
            photo.addEventListener('click', function() {
                const fullSrc = this.getAttribute('data-full-src');
                const img = this.querySelector('img');
                
                if (fullSrc && img.classList.contains('loaded')) {
                    // Create full-size overlay
                    createFullSizeOverlay(fullSrc, img.alt);
                }
                
                // Create meow bubble (existing functionality)
                createMeowBubble(this);
                
                // Add bounce effect
                this.style.animation = 'photoClick 0.6s ease-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            });
        });
    }
    
    function createFullSizeOverlay(src, alt) {
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: photoZoomIn 0.3s ease-out;
        `;
        
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        
        // Close on click
        overlay.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        });
        
        // Add zoom animation styles
        if (!document.getElementById('photo-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'photo-overlay-styles';
            style.textContent = `
                @keyframes photoZoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                .lazy-load {
                    opacity: 0.6;
                    transition: opacity 0.3s ease;
                }
                
                .loaded {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Setup photo interactions after page load
    setTimeout(setupPhotoInteractions, 1000);
});

// Add CSS animations if not already present
if (!document.getElementById('cat-animations')) {
    const style = document.createElement('style');
    style.id = 'cat-animations';
    style.textContent = `
        @keyframes photoClick {
            0% { transform: scale(1); }
            50% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1); }
        }
        
        @keyframes meowFloat {
            0% {
                opacity: 0;
                transform: translateX(-50%) translateY(0);
            }
            20% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateX(-50%) translateY(-50px);
            }
        }
        
        @keyframes pawFade {
            0% {
                opacity: 0;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 0.3;
                transform: scale(1) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0.5) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}