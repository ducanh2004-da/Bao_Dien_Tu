// <========================Heart button========================>
$('a.like-button').on('click', function(e) {
    $(this).toggleClass('liked');

    setTimeout(() => {
        $(e.target).removeClass('liked')
    }, 1000)
});

// <========================Scroll to top button========================>
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