document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector("navbar");
    if (!navbar) return;

    let baseWidth = window.innerWidth;
    let baseOuterWidth = window.outerWidth;

    function getZoomLevel() {
        return window.outerWidth / window.innerWidth;
    }

    function adjustNavbar() {
        const zoomLevel = getZoomLevel();
        
        if (zoomLevel > 0.5 && zoomLevel < 3) {
            navbar.style.transform = `scale(${1 / zoomLevel})`;
            navbar.style.transformOrigin = "top right";
            navbar.style.width = `${100 * zoomLevel}%`;
        }
    }

    adjustNavbar();

    window.addEventListener("resize", adjustNavbar);
});
