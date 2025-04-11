document.addEventListener('DOMContentLoaded', function() {
    // Featured Connections Slider
    const initSlider = (containerId, prevBtnId, nextBtnId, options = {}) => {
        const container = document.getElementById(containerId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const cardWidth = options.cardWidth || 266;
        const visibleCards = options.visibleCards || 3;
        let currentPosition = 0;
        let isAnimating = false;
        let touchStartX = 0;
        let touchEndX = 0;

        const maxScrollPosition = () => {
            const totalCards = container.children.length;
            return -(Math.max(0, (totalCards - visibleCards)) * cardWidth);
        };

        const updateButtonStates = () => {
            prevBtn.disabled = currentPosition >= 0;
            nextBtn.disabled = currentPosition <= maxScrollPosition();
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        };

        const smoothScroll = (targetPosition) => {
            if (isAnimating) return;
            isAnimating = true;
            const startPosition = currentPosition;
            const distance = targetPosition - startPosition;
            const duration = 300;
            let startTime;

            const animation = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easing = progress => (1 - Math.cos(progress * Math.PI)) / 2;

                currentPosition = startPosition + distance * easing(progress);
                container.style.transform = `translateX(${currentPosition}px)`;

                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    isAnimating = false;
                    updateButtonStates();
                }
            };

            requestAnimationFrame(animation);
        };

        // Touch events for mobile swipe
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const currentX = e.touches[0].clientX;
            const diff = touchStartX - currentX;
            if (Math.abs(diff) > 5) { // Prevent vertical scrolling
                e.preventDefault();
            }
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
                if (swipeDistance > 0) {
                    smoothScroll(Math.min(currentPosition + cardWidth, 0));
                } else {
                    smoothScroll(Math.max(currentPosition - cardWidth, maxScrollPosition()));
                }
            }
            touchStartX = null;
        });

        // Button click handlers
        prevBtn.addEventListener('click', () => {
            smoothScroll(Math.min(currentPosition + cardWidth, 0));
        });

        nextBtn.addEventListener('click', () => {
            smoothScroll(Math.max(currentPosition - cardWidth, maxScrollPosition()));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (container.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    smoothScroll(Math.min(currentPosition + cardWidth, 0));
                } else if (e.key === 'ArrowRight') {
                    smoothScroll(Math.max(currentPosition - cardWidth, maxScrollPosition()));
                }
            }
        });

        // Add hover effect pause
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (currentPosition <= maxScrollPosition()) {
                    smoothScroll(0);
                } else {
                    smoothScroll(currentPosition - cardWidth);
                }
            }, 5000);
        };

        container.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        container.addEventListener('mouseleave', () => {
            startAutoScroll();
        });

        // Initialize
        updateButtonStates();
        startAutoScroll();
    };

    // Initialize sliders
    initSlider('cardContainer', 'prevBtn', 'nextBtn', {
        cardWidth: 266,
        visibleCards: 3
    });

    initSlider('pendingContainer', 'pendingPrevBtn', 'pendingNextBtn', {
        cardWidth: 416,
        visibleCards: 2
    });

    // Add loading states to Accept/Ignore buttons
    document.querySelectorAll('.flex-shrink-0 button').forEach(button => {
        button.addEventListener('click', function(e) {
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            
            // Simulate API call
            setTimeout(() => {
                this.closest('.flex-shrink-0').style.opacity = '0';
                setTimeout(() => {
                    this.closest('.flex-shrink-0').remove();
                }, 300);
            }, 1000);
        });
    });
});