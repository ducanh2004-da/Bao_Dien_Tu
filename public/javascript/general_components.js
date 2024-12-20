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

// <========================Tag input========================>
document.addEventListener("DOMContentLoaded", () => {
    const addTagButton = document.getElementById("add-tag-btn");

    addTagButton.addEventListener("click", addTag);

    tagInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTag();
            event.preventDefault();
        }
    });
});

const tagInput = document.getElementById("tag-input");
const tagContainer = document.getElementById("tag-container");

function createTagElement(tagText) {
    const tag = document.createElement("div");
    tag.classList.add("tag");

    const tagContent = document.createElement("span");
    tagContent.textContent = tagText;
    tag.appendChild(tagContent);

    const removeButton = document.createElement("span");
    removeButton.classList.add("remove-tag");
    removeButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\">\n" +
        "  <path d=\"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z\"/>\n" +
        "</svg>";
    removeButton.addEventListener("click", () => {
        tagContainer.removeChild(tag);
    });

    tag.appendChild(removeButton);

    return tag;
}

function addTag() {
    const tagText = tagInput.value.trim();
    if (tagText) {
        const tagElement = createTagElement(tagText);
        tagContainer.appendChild(tagElement);
        tagInput.value = "";
        tagInput.focus();
    }
}

function getAllTags() {
    const tags = [];
    const tagContainer = document.getElementById("tag-container");
    const tagElements = tagContainer.getElementsByClassName("tag");
    for (let tagElement of tagElements) {
        const tagText = tagElement.querySelector("span").textContent;
        tags.push(tagText);
    }
    return tags;
}

// <========================Sidebar========================>
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const toggleSidebar = document.getElementById("toggle-sidebar");

    toggleSidebar.addEventListener("click", function () {
        sidebar.classList.toggle("active");
        mainContent.classList.toggle("content-blur");
    });

    mainContent.addEventListener("click", function () {
        if (sidebar.classList.contains("active")) {
            sidebar.classList.remove("active");
            mainContent.classList.remove("content-blur");
        }
    });
});

// <========================Form validation========================>
window.addEventListener('load', () => {
    let isFormDirty = false;

    // Select all forms on the page
    const forms = document.querySelectorAll('form');

    // Add an event listener to each form to detect changes
    forms.forEach((form) => {
        form.addEventListener('input', () => {
            isFormDirty = true;
        });

        // Reset the dirty state if the form is successfully submitted
        form.addEventListener('submit', () => {
            isFormDirty = false;
        });
    });

    // Listen for the beforeunload event
    window.addEventListener('beforeunload', (event) => {
        if (isFormDirty) {
            event.preventDefault();
            event.returnValue = ''; // Required for compatibility with some browsers
        }
    });
});

