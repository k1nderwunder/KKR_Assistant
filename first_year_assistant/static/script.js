document.addEventListener("DOMContentLoaded", () => {
    const buildings = document.querySelectorAll(".building");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const mapWrapper = document.querySelector(".map-wrapper");
    const popup = document.getElementById("building-popup");
    const overlay = document.getElementById("popup-overlay");

    function applyAllMode() {
        buildings.forEach(b => {
            b.classList.remove("dimmed");
            b.classList.add("all-active");
        });
    }

    function clearAllMode() {
        buildings.forEach(b => b.classList.remove("all-active"));
    }

    function openPopup() {
    overlay.classList.remove("hidden");
    popup.classList.remove("hidden");
    requestAnimationFrame(() => popup.classList.add("is-open"));
    }

    function closePopup() {
        popup.classList.remove("is-open");
        overlay.classList.add("hidden");
         setTimeout(() => popup.classList.add("hidden"), 220);
    }   

    overlay.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup-close")) {
        e.stopPropagation();
        closePopup();
        }
    });


    // Клик по зданию — показываем попап рядом с объектом
    buildings.forEach(b => {
        b.addEventListener("click", (e) => {
            if (mapWrapper && popup) {
                const wrapperRect = mapWrapper.getBoundingClientRect();
                const buildingRect = b.getBoundingClientRect();

                // Позиция попапа — справа от здания
                let left = buildingRect.right - wrapperRect.left + 10;
                let top = buildingRect.top - wrapperRect.top;

                const popupWidth = 260;
                const maxLeft = mapWrapper.clientWidth - popupWidth - 10;

                // Если вылезает за правый край карты — сдвигаем влево
                if (left > maxLeft) {
                    left = buildingRect.left - wrapperRect.left - popupWidth - 10;
                }

                // Ограничиваем по вертикали
                if (top < 10) top = 10;
                const maxTop = mapWrapper.clientHeight - 10;
                if (top > maxTop) top = maxTop;

                popup.style.left = left + "px";
                popup.style.top = top + "px";

                // Формируем HTML попапа
                let html = `
                    <b>${b.dataset.title}</b><br>
                    ${b.dataset.info}
                `;

                // Если у здания задана ссылка — добавляем кнопку
                if (b.dataset.link) {
                    html += `
                        <br><br>
                        <a href="${b.dataset.link}" target="_blank" class="popup-btn">
                            🔗 Открыть сайт
                        </a>
                    `;
                }

                popup.innerHTML = `
                <button class="popup-close" type="button" aria-label="Закрыть">×</button>
                ${html}
                `;
                openPopup();

                // Не даём клику всплыть до wrapper'а
                e.stopPropagation();
            }
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

    // Закрытие popup по клику по пустому месту карты
    if (mapWrapper && popup) {
        mapWrapper.addEventListener("click", (e) => {
            if (!e.target.classList.contains("building") && !popup.contains(e.target)) {
                closePopup();
            }
        });

        // Клик вне карты — тоже закрываем
        document.addEventListener("click", (e) => {
            if (!mapWrapper.contains(e.target)) {
                closePopup();
            }
        });
    }
});

