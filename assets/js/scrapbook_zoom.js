document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".scrapbook-zoom-wrapper");
    if (!wrapper) return;
    
    const pinkContainer = document.querySelector(".pinkcontainer");

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
    
    function updateOverflow() {
        if (pinkContainer) {
            if (scale > 1) {
                pinkContainer.style.overflow = "auto";
            } else {
                pinkContainer.style.overflow = "";
            }
        }
    }

    function resetZoom() {
        scale = 1;
        lastScale = 1;
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
        wrapper.style.transition = "transform 0.2s ease-out";
        wrapper.style.transform = "";
        updateOverflow();
        setTimeout(() => {
            wrapper.style.transition = "";
        }, 200);
    }

    window.addEventListener("orientationchange", function() {
        resetZoom();
    });

    window.addEventListener("resize", function() {
        if (scale > 1) {
            resetZoom();
        }
    });

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
        updateOverflow();
    }

    function clampTranslation() {
        if (scale <= 1) {
            translateX = 0;
            translateY = 0;
            return;
        }

        // Use wrapper bounds (includes tabs) for full pan area
        const wrapperRect = wrapper.getBoundingClientRect();
        const parentRect = wrapper.parentElement.getBoundingClientRect();
        
        // Calculate max translation - use wrapper width to include tabs
        const scaledWidth = wrapperRect.width;
        const scaledHeight = wrapperRect.height;
        
        // Allow panning to see the full content including tabs
        // Asymmetric clamping: allow more panning to the left (negative X) to see tabs on right
        const maxXRight = Math.max(0, (scaledWidth - parentRect.width) / 2);
        const maxXLeft = maxXRight; // Allow equal panning in both directions
        const maxY = Math.max(0, (scaledHeight - parentRect.height) / 2);

        translateX = Math.max(-maxXRight, Math.min(maxXLeft, translateX));
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
            // Use wrapper bounds for double-click zoom centering
            const rect = wrapper.getBoundingClientRect();
            translateX = (rect.left + rect.width / 2 - e.clientX) * 0.5;
            translateY = (rect.top + rect.height / 2 - e.clientY) * 0.5;
            clampTranslation();
        }
        
        wrapper.style.transition = "transform 0.3s ease-out";
        applyTransform();
        setTimeout(() => {
            wrapper.style.transition = "";
        }, 300);
    });
});
