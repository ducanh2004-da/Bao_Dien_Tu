// <========================Slider========================>
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