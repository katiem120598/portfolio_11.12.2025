document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");
    const loadingText = document.getElementById("loading-text");

    let dotCount = 0;

    // Animate dots while preloading
    const dotAnimation = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        loadingText.textContent = "loading" + ".".repeat(dotCount);
    }, 100);

    // Function to hide preloader after all images are loaded
    function hidePreloader() {
        // Stop the dot animation
        clearInterval(dotAnimation);
        
        // Add hidden class for fade-out transition
        preloader.classList.add("preloader-hidden");

        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }

    // Get all images on the page
    const images = document.querySelectorAll("img");
    let loadedCount = 0;
    const totalImages = images.length;

    // If no images, hide preloader immediately
    if (totalImages === 0) {
        hidePreloader();
        return;
    }

    // Function to check if all images are loaded
    function checkAllLoaded() {
        loadedCount++;
        if (loadedCount >= totalImages) {
            hidePreloader();
        }
    }

    // Check each image
    images.forEach(img => {
        if (img.complete) {
            // Image already loaded (from cache)
            checkAllLoaded();
        } else {
            // Wait for image to load
            img.addEventListener("load", checkAllLoaded);
            img.addEventListener("error", checkAllLoaded); // Count errors too to avoid hanging
        }
    });
});
