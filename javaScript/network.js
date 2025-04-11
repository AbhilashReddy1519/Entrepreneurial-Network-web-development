document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('cardContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cardWidth = 266; // 250px card + 16px gap
    const visibleCards = 3;
    let currentPosition = 0;

    prevBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + cardWidth, 0);
        container.style.transform = `translateX(${currentPosition}px)`;
    });

    nextBtn.addEventListener('click', () => {
        const maxScroll = -(container.scrollWidth - visibleCards * cardWidth);
        currentPosition = Math.max(currentPosition - cardWidth, maxScroll);
        container.style.transform = `translateX(${currentPosition}px)`;
    });
});