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