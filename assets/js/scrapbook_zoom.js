document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".scrapbook-zoom-wrapper") || document.querySelector(".image-wrapper");
    if (!wrapper) return;

    let scale = 1;
    let lastScale = 1;
    let translateX = 0;
    let translateY = 0;
    let lastTranslateX = 0;
    let lastTranslateY = 0;
    let initialDistance = 0;
    let initialMidpoint = { x: 0, y: 0 };
    let isPinching = false;

    const MIN_SCALE = 1;
    const MAX_SCALE = 3;

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getMidpoint(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    function applyTransform() {
        wrapper.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    }

    function clampTranslation() {
        if (scale <= 1) {
            translateX = 0;
            translateY = 0;
            return;
        }

        const rect = wrapper.getBoundingClientRect();
        const parentRect = wrapper.parentElement.getBoundingClientRect();
        
        const maxX = (rect.width * scale - parentRect.width) / 2;
        const maxY = (rect.height * scale - parentRect.height) / 2;

        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }

    wrapper.addEventListener("touchstart", function(e) {
        if (e.touches.length === 2) {
            isPinching = true;
            e.preventDefault();
            
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialMidpoint = getMidpoint(e.touches[0], e.touches[1]);
            lastScale = scale;
            lastTranslateX = translateX;
            lastTranslateY = translateY;
        }
    }, { passive: false });

    wrapper.addEventListener("touchmove", function(e) {
        if (e.touches.length === 2 && isPinching) {
            e.preventDefault();
            
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const currentMidpoint = getMidpoint(e.touches[0], e.touches[1]);
            
            const scaleChange = currentDistance / initialDistance;
            scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, lastScale * scaleChange));
            
            if (scale > 1) {
                translateX = lastTranslateX + (currentMidpoint.x - initialMidpoint.x);
                translateY = lastTranslateY + (currentMidpoint.y - initialMidpoint.y);
                clampTranslation();
            } else {
                translateX = 0;
                translateY = 0;
            }
            
            applyTransform();
        }
    }, { passive: false });

    wrapper.addEventListener("touchend", function(e) {
        if (e.touches.length < 2) {
            isPinching = false;
            
            if (scale < 1.1) {
                scale = 1;
                translateX = 0;
                translateY = 0;
                wrapper.style.transition = "transform 0.2s ease-out";
                applyTransform();
                setTimeout(() => {
                    wrapper.style.transition = "";
                }, 200);
            }
        }
    });

    wrapper.addEventListener("dblclick", function(e) {
        e.preventDefault();
        
        if (scale > 1) {
            scale = 1;
            translateX = 0;
            translateY = 0;
        } else {
            scale = 2;
            const rect = wrapper.getBoundingClientRect();
            translateX = (rect.width / 2 - e.clientX) * 0.5;
            translateY = (rect.height / 2 - e.clientY) * 0.5;
            clampTranslation();
        }
        
        wrapper.style.transition = "transform 0.3s ease-out";
        applyTransform();
        setTimeout(() => {
            wrapper.style.transition = "";
        }, 300);
    });
});
