
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots-container');
    const slideCounter = document.querySelector('.slide-counter');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;
    let intervalId;

    const config = {
        loop: true,
        navs: true,
        pags: true,
        auto: true,
        stopMouseHover: true,
        delay: localStorage.getItem('sliderDelay') || 5000
    };

    function createDots() {
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function updateCounter() {
        if (slideCounter) {
            slideCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
        }
    }

    function goToSlide(index) {
        if (config.loop) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
        }
        currentIndex = index;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        updateCounter();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        if (config.auto) {
            intervalId = setInterval(nextSlide, config.delay);
        }
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    function initSlider() {
        if (config.pags) {
            createDots();
            updateDots();
        }

        updateCounter();

        if (!config.navs) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        if (config.auto) {
            startAutoSlide();
            if (config.stopMouseHover) {
                slider.addEventListener('mouseenter', stopAutoSlide);
                slider.addEventListener('mouseleave', startAutoSlide);
            }
        }
    }

    function initSliderSettings() {
        const settingsForm = document.getElementById('slider-settings-form');
        if (!settingsForm) return;

        const delayInput = document.getElementById('slider-delay');
        delayInput.value = config.delay;

        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newDelay = parseInt(delayInput.value, 10);

            if (!isNaN(newDelay) && newDelay >= 1000) {
                updateSliderDelay(newDelay);
                alert('Интервал слайдера обновлен до ' + newDelay + ' мс.');
            } else {
                alert('Пожалуйста, введите корректное значение (не менее 1000 мс).');
            }
        });
    }

    function updateSliderDelay(newDelay) {
        config.delay = newDelay;
        localStorage.setItem('sliderDelay', newDelay);
        stopAutoSlide();
        startAutoSlide();
    }

    initSlider();
    initSliderSettings();
});
