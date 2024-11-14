//Get the button
let btnScrollToTop = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        if (!btnScrollToTop.classList.contains("show")) {
            btnScrollToTop.classList.add("show");
        }
    } else {
        btnScrollToTop.classList.remove("show");
    }
}

// When the user clicks on the button, scroll to the top of the document
btnScrollToTop.addEventListener("click", backToTop);

function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

const slider = document.getElementById("slider");
const btnLatest = document.getElementById("latest");
const btnMostViews = document.getElementById("most-views");

btnLatest.addEventListener("click", () => {
    slideTo("left");
});
btnMostViews.addEventListener("click", () => {
    slideTo("right");
});

function slideTo(position) {
    if (position === "left") {
        slider.style.transform = "translateX(0%)";
        btnMostViews.classList.add("inactive");
        btnMostViews.classList.remove("active");
        btnLatest.classList.remove("inactive");
        btnLatest.classList.add("active");


    } else if (position === "right") {
        slider.style.transform = "translateX(100%)";
        btnMostViews.classList.remove("inactive");
        btnMostViews.classList.add("active");
        btnLatest.classList.add("inactive");
        btnLatest.classList.remove("active");
    }
}