document.addEventListener("DOMContentLoaded", () => {
    const infoBox = document.getElementById("building-info");
    const buildings = document.querySelectorAll(".building");
    const filterBtns = document.querySelectorAll(".filter-btn");

    function applyAllMode() {
        buildings.forEach(b => {
            b.classList.remove("dimmed");
            b.classList.add("all-active"); 
        });
    }

    function clearAllMode() {
        buildings.forEach(b => b.classList.remove("all-active"));
    }

    // Клик по зданию
    buildings.forEach(b => {
        b.addEventListener("click", () => {
            infoBox.innerHTML = `<b>${b.dataset.title}</b><br>${b.dataset.info}`;
        });
    });

    // Фильтры
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            // активная кнопка
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const type = btn.dataset.filter;

            if (type === "all") {
                clearAllMode();
                applyAllMode(); 
                return;
            }

            clearAllMode();

            buildings.forEach(b => {
                if (b.classList.contains(type)) {
                    b.classList.remove("dimmed");
                } else {
                    b.classList.add("dimmed");
                }
            });
        });
    });

    // включаем начальный режим (all)
    applyAllMode();
});
