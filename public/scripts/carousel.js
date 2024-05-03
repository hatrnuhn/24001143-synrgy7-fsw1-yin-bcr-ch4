var slider = tns({
    container: '.my-slider',
    items: 1,
    slideBy: 1,
    loop: true,
    speed: 500,
    controlsContainer: ".testy__carousel-btn-container",
    prevButton: "#carousel-btn-prev",
    nextButton: "#carousel-btn-next",
    responsive: {
        640: {
            items: 3,
            center: true,
            startIndex: 1,
        }
    },
});

// Function to add class for center item
function addCenterClass() {
    const info = slider.getInfo();
    const indexCurr = info.index;
    const elements = document.getElementsByClassName("center-slide");
    while (elements.length > 0) {
        elements[0].classList.remove("center-slide");
    }
    info.slideItems[indexCurr].classList.add("center-slide");
}

// Add class for center item initially
addCenterClass();

// Event listener for indexChanged event
slider.events.on("indexChanged", addCenterClass);