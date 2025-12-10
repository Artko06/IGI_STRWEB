document.addEventListener('DOMContentLoaded', function () {
    const animationContainer = document.getElementById('scroll-animation-container');
    if (!animationContainer) return;

    const bottles = [
        document.getElementById('bottle1'),
        document.getElementById('bottle2'),
        document.getElementById('bottle3')
    ];

    window.addEventListener('scroll', () => {
        const { top, height } = animationContainer.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - top) / (window.innerHeight + height);

        bottles.forEach((bottle, index) => {
            if (!bottle) return;

            const startScroll = index * 0.1;
            const endScroll = 0.5 + index * 0.1;

            let progress = (scrollPercent - startScroll) / (endScroll - startScroll);
            progress = Math.max(0, Math.min(1, progress));

            const fallDistance = window.innerHeight * 0.7;
            const translateY = progress * fallDistance;

            const rotation = progress * 360;

            bottle.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
            bottle.style.opacity = 1 - progress * 0.5;
        });
    });
});
