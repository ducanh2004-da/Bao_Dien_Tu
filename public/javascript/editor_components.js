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

document.addEventListener("DOMContentLoaded", () => {
    const tagInput = document.getElementById("tag-input");
    const addTagButton = document.getElementById("add-tag-btn");
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

    addTagButton.addEventListener("click", addTag);

    tagInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTag();
            event.preventDefault();
        }
    });
});