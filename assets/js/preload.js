document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");
    const loadingText = document.getElementById("loading-text");
    const pageKey = "hasVisited_" + window.location.pathname;

    // Check if the user has already visited this specific page
    const hasVisitedBefore = sessionStorage.getItem(pageKey);

    if (hasVisitedBefore) {
        preloader.style.display = "none";
        return;
    }

    let dotCount = 0;

    // Animate dots while preloading
    const dotAnimation = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        loadingText.textContent = "loading" + ".".repeat(dotCount);
    }, 100);

    // Wait for ALL images and resources to fully load
    window.onload = function () {
        // Stop the dot animation
        clearInterval(dotAnimation);
        
        // Add hidden class for fade-out transition
        preloader.classList.add("preloader-hidden");

        setTimeout(() => {
            preloader.style.display = "none";
            // Mark this page as visited
            sessionStorage.setItem(pageKey, "true");
        }, 500);
    };
});
