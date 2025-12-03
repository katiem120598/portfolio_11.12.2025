document.addEventListener("DOMContentLoaded", function () {
    const referenceImage = document.querySelector("img.reference-image");
    const dependentImages = document.querySelectorAll("img.dependent-image");
    const fillerContainers = document.querySelectorAll(".filler-container");
    const fillerLinks = document.querySelectorAll(".filler-link");
    const imageWrapper = document.querySelector(".image-wrapper");
    
    let lastWidth = 0;
    let lastHeight = 0;
    let isUpdating = false;
    let updateTimeout = null;

    const updatePositions = () => {
        if (!referenceImage || isUpdating) return;
        
        isUpdating = true;

        const refBounds = referenceImage.getBoundingClientRect();
        
        if (refBounds.width === 0 || refBounds.height === 0) {
            isUpdating = false;
            return;
        }

        const viewportHeight = window.innerHeight * 0.9;
        const viewportWidth = window.innerWidth * 0.8;
        const naturalHeight = referenceImage.naturalHeight;
        const naturalWidth = referenceImage.naturalWidth;

        if (naturalHeight === 0 || naturalWidth === 0) {
            isUpdating = false;
            return;
        }

        const heightScale = viewportHeight / naturalHeight;
        const widthScale = viewportWidth / naturalWidth;
        const scale = Math.min(heightScale, widthScale);

        const newWidth = naturalWidth * scale;
        const newHeight = naturalHeight * scale;

        referenceImage.style.width = `${newWidth}px`;
        referenceImage.style.height = `${newHeight}px`;

        const updatedRefBounds = referenceImage.getBoundingClientRect();
        const wrapperBounds = imageWrapper ? imageWrapper.getBoundingClientRect() : { top: 0, left: 0 };

        fillerContainers.forEach((container, index) => {
            const fillerElement = container.querySelector(".filler-image");

            if (!fillerElement) {
                return;
            }

            const topPercentage = parseFloat(container.dataset.top || 0);
            const leftPercentage = parseFloat(container.dataset.left || 0);
            const widthPercentage = parseFloat(container.dataset.width || 20);
            const heightPercentage = parseFloat(container.dataset.height || 20);

            const absoluteTop = (updatedRefBounds.top - wrapperBounds.top) + (topPercentage / 100) * updatedRefBounds.height;
            const absoluteLeft = (updatedRefBounds.left - wrapperBounds.left) + (leftPercentage / 100) * updatedRefBounds.width;
            const absoluteWidth = (widthPercentage / 100) * updatedRefBounds.width;
            const absoluteHeight = (heightPercentage / 100) * updatedRefBounds.height;

            container.style.position = "absolute";
            container.style.top = `${absoluteTop}px`;
            container.style.left = `${absoluteLeft}px`;
            container.style.width = `${absoluteWidth}px`;
            container.style.height = `${absoluteHeight}px`;
            container.style.transform = "translate3d(0,0,0)";

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
        }, 100);
    });

    if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', debouncedUpdate);
    }
});
