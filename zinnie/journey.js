// Journey page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll-triggered animations
    const milestones = document.querySelectorAll('.milestone');
    const dots = document.querySelectorAll('.milestone-dot');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Add sparkle effect when milestone comes into view
                if (entry.target.classList.contains('milestone')) {
                    addSparkleEffect(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all milestones
    milestones.forEach(milestone => {
        observer.observe(milestone);
    });

    // Dot click interactions
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const milestoneId = this.getAttribute('data-milestone');
            const milestone = document.querySelector(`[data-milestone="${milestoneId}"]`);
            
            if (milestone) {
                // Smooth scroll to milestone
                milestone.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Add highlight effect
                highlightMilestone(milestone);
            }
        });

        // Hover effects for dots
        dot.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
            addPulseEffect(this);
        });

        dot.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add parallax effect to floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shape');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform += ` translateY(${yPos}px)`;
        });
    });
});

function addSparkleEffect(milestone) {
    const sparkles = ['✨', '🌟', '💫', '⭐'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '1.5rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.opacity = '0';
            sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
            
            milestone.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }, i * 200);
    }
    
    // Add sparkle animation to CSS if not already present
    if (!document.getElementById('sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-10px) scale(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-30px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function highlightMilestone(milestone) {
    // Add temporary highlight class
    milestone.classList.add('milestone-highlight');
    
    // Add highlight styles if not already present
    if (!document.getElementById('highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'highlight-styles';
        style.textContent = `
            .milestone-highlight .milestone-content {
                transform: scale(1.05) !important;
                border-color: #d668a0 !important;
                box-shadow: 0 20px 40px rgba(214, 104, 160, 0.5) !important;
                animation: highlightPulse 1s ease-in-out !important;
            }
            
            @keyframes highlightPulse {
                0%, 100% { transform: scale(1.05); }
                50% { transform: scale(1.08); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove highlight after animation
    setTimeout(() => {
        milestone.classList.remove('milestone-highlight');
    }, 1000);
}

function addPulseEffect(dot) {
    // Add temporary pulse effect
    dot.style.animation = 'dotPulse 0.6s ease-in-out';
    
    // Add pulse animation if not already present
    if (!document.getElementById('pulse-styles')) {
        const style = document.createElement('style');
        style.id = 'pulse-styles';
        style.textContent = `
            @keyframes dotPulse {
                0%, 100% { filter: drop-shadow(0 2px 6px rgba(214, 104, 160, 0.4)); }
                50% { filter: drop-shadow(0 4px 20px rgba(214, 104, 160, 0.8)); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Reset animation
    setTimeout(() => {
        dot.style.animation = '';
    }, 600);
}

// Add smooth scrolling for the entire page
document.documentElement.style.scrollBehavior = 'smooth';