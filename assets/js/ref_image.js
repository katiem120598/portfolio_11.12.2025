document.addEventListener("DOMContentLoaded", function () {
    const referenceImage = document.querySelector("img.reference-image");
    const dependentImages = document.querySelectorAll("img.dependent-image");
    const fillerContainers = document.querySelectorAll(".filler-container");
    const fillerLinks = document.querySelectorAll(".filler-link");
    const imageWrapper = document.querySelector(".image-wrapper");
    const zoomWrapper = document.querySelector(".scrapbook-zoom-wrapper");
    
    let lastWidth = 0;
    let lastHeight = 0;
    let isUpdating = false;
    let updateTimeout = null;

    const updatePositions = () => {
        if (!referenceImage || isUpdating) return;
        
        isUpdating = true;

        const isMobile = window.innerWidth <= 768;
        
        // Reset reference image position first to get accurate measurements
        if (isMobile) {
            referenceImage.style.position = "absolute";
            referenceImage.style.left = "0px";
            referenceImage.style.top = "0px";
        } else {
            referenceImage.style.position = "";
            referenceImage.style.left = "";
            referenceImage.style.top = "";
        }

        const refBounds = referenceImage.getBoundingClientRect();
        
        if (refBounds.width === 0 || refBounds.height === 0) {
            isUpdating = false;
            return;
        }

        // On mobile portrait, leave extra space on the right for navigation tabs
        const isPortrait = window.innerHeight > window.innerWidth;
        const mobileWidthMultiplier = isPortrait ? 0.75 : 0.85; // Smaller in portrait to fit tabs
        const viewportHeight = window.innerHeight * (isMobile ? 0.85 : 0.9);
        const viewportWidth = window.innerWidth * (isMobile ? mobileWidthMultiplier : 0.8);
        const naturalHeight = referenceImage.naturalHeight;
        const naturalWidth = referenceImage.naturalWidth;

        if (naturalHeight === 0 || naturalWidth === 0) {
            isUpdating = false;
            return;
        }

        const heightScale = viewportHeight / naturalHeight;
        const widthScale = viewportWidth / naturalWidth;
        const scale = Math.min(heightScale, widthScale);

        let newWidth = naturalWidth * scale;
        let newHeight = naturalHeight * scale;

        referenceImage.style.width = `${newWidth}px`;
        referenceImage.style.height = `${newHeight}px`;
        
        // Force a reflow to apply styles, then get ACTUAL rendered dimensions
        // (CSS max-width/max-height constraints may reduce the size)
        const actualRefBounds = referenceImage.getBoundingClientRect();
        const actualWidth = actualRefBounds.width;
        const actualHeight = actualRefBounds.height;

        const wrapperBounds = imageWrapper ? imageWrapper.getBoundingClientRect() : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        
        let refOffsetTop, refOffsetLeft;
        
        if (isMobile) {
            // Use window dimensions for centering on mobile
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;
            
            // Use ACTUAL rendered dimensions for centering
            refOffsetLeft = (containerWidth - actualWidth) / 2;
            refOffsetTop = (containerHeight - actualHeight) / 2;
            
            // Ensure positive values (don't go negative)
            refOffsetLeft = Math.max(0, refOffsetLeft);
            refOffsetTop = Math.max(0, refOffsetTop);
            
            referenceImage.style.position = "absolute";
            referenceImage.style.left = `${refOffsetLeft}px`;
            referenceImage.style.top = `${refOffsetTop}px`;
            referenceImage.style.zIndex = "1";
            
            // Use actual dimensions for filler positioning
            newWidth = actualWidth;
            newHeight = actualHeight;
        } else {
            const updatedRefBounds = referenceImage.getBoundingClientRect();
            refOffsetTop = updatedRefBounds.top - wrapperBounds.top;
            refOffsetLeft = updatedRefBounds.left - wrapperBounds.left;
        }

        fillerContainers.forEach((container, index) => {
            const fillerElement = container.querySelector(".filler-image");

            if (!fillerElement) {
                return;
            }

            const topPercentage = parseFloat(container.dataset.top || 0);
            const leftPercentage = parseFloat(container.dataset.left || 0);
            const widthPercentage = parseFloat(container.dataset.width || 20);
            const heightPercentage = parseFloat(container.dataset.height || 20);

            const absoluteTop = refOffsetTop + (topPercentage / 100) * newHeight;
            const absoluteLeft = refOffsetLeft + (leftPercentage / 100) * newWidth;
            const absoluteWidth = (widthPercentage / 100) * newWidth;
            const absoluteHeight = (heightPercentage / 100) * newHeight;

            container.style.position = "absolute";
            container.style.top = `${absoluteTop}px`;
            container.style.left = `${absoluteLeft}px`;
            container.style.width = `${absoluteWidth}px`;
            container.style.height = `${absoluteHeight}px`;
            container.style.transform = "translate3d(0,0,0)";
            container.style.zIndex = "150";

            fillerElement.style.width = "100%";
            fillerElement.style.height = "100%";
            fillerElement.style.objectFit = "cover";

            if (fillerLinks[index]) {
                const link = fillerLinks[index];
                link.style.position = "absolute";
                link.style.top = `${absoluteTop}px`;
                link.style.left = `${absoluteLeft}px`;
                link.style.width = `${absoluteWidth}px`;
                link.style.height = `${absoluteHeight}px`;
                link.style.zIndex = "101";
                link.style.background = "rgba(0, 0, 0, 0)";
            }
        });

        if (isMobile) {
            // On mobile, position tabs absolutely to the right of the reference image
            const tabHeight = Math.max(40, 0.12 * newHeight);
            const tabSpacing = 5;
            let tabTop = refOffsetTop + (newHeight * 0.15);
            
            dependentImages.forEach((image, index) => {
                image.style.position = "absolute";
                image.style.top = `${tabTop}px`;
                image.style.left = `${refOffsetLeft + newWidth + 5}px`;
                image.style.height = `${tabHeight}px`;
                image.style.width = "auto";
                image.style.zIndex = "200";
                
                tabTop += tabHeight + tabSpacing;
            });
        } else {
            // Desktop: use original relative positioning
            let cumulativeHeight = -0.39 * newHeight;
            let cumulativeWidth = 0;

            dependentImages.forEach((image) => {
                image.style.position = "relative";
                image.style.top = `${cumulativeHeight + 0.05 * newHeight}px`;
                image.style.left = `-${cumulativeWidth + 0.005 * newWidth}px`;
                image.style.height = `${0.17 * newHeight}px`;

                cumulativeHeight += image.clientHeight + 0.002 * newHeight;
                cumulativeWidth += image.clientWidth;
            });
        }

        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
        isUpdating = false;
    };

    const debouncedUpdate = () => {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            updatePositions();
        }, 50);
    };

    const handleVideoMetadataLoad = (video) => {
        if (video.readyState >= 2) {
            updatePositions();
        } else {
            video.addEventListener("loadedmetadata", () => {
                updatePositions();
            });
        }
    };

    const handleImageLoad = () => {
        if (referenceImage.complete && referenceImage.naturalWidth > 0) {
            updatePositions();

            fillerContainers.forEach((container) => {
                const video = container.querySelector("video.filler-image");
                if (video) {
                    handleVideoMetadataLoad(video);
                }
            });
        } else {
            referenceImage.addEventListener("load", () => {
                updatePositions();

                fillerContainers.forEach((container) => {
                    const video = container.querySelector("video.filler-image");
                    if (video) {
                        handleVideoMetadataLoad(video);
                    }
                });
            });
        }
    };

    const resizeObserver = new ResizeObserver(() => {
        debouncedUpdate();
    });

    if (referenceImage) {
        resizeObserver.observe(referenceImage);
    }

    if (imageWrapper) {
        resizeObserver.observe(imageWrapper);
    }

    handleImageLoad();

    window.addEventListener("resize", debouncedUpdate);
    
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            updatePositions();
        }, 300);
    });

    if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', debouncedUpdate);
    }
});
