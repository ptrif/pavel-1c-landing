(function () {
    const TELEGRAM_URL = "https://t.me/BezB_B";

    document.addEventListener("click", function (event) {
      const button = event.target.closest("[data-telegram-cta]");
      if (!button) return;

      const telegramWindow = window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
      if (telegramWindow) telegramWindow.opener = null;
    });
  })();

(function () {
    const header = document.querySelector(".custom-header");
    const burger = document.querySelector(".custom-header__burger");
    const mobileMenu = document.querySelector(".custom-header__mobile");
    const mobileLinks = document.querySelectorAll(".custom-header__mobile a, .custom-header__mobile button");

    if (!header || !burger || !mobileMenu) return;

    function setMenuState(isOpen) {
      header.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      mobileMenu.inert = !isOpen;
    }

    burger.addEventListener("click", function () {
      setMenuState(!header.classList.contains("is-open"));
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (header.classList.contains("is-open") && !header.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !header.classList.contains("is-open")) return;

      setMenuState(false);
      burger.focus();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180 && header.classList.contains("is-open")) {
        setMenuState(false);
      }
    });
  })();

(function () {
    const player = document.querySelector(".result-video-player");
    if (!player) return;

    const playButton = player.querySelector(".result-video-play");

    playButton.addEventListener("click", function () {
      const videoUrl = player.dataset.videoUrl;

      /*
        Когда появится видео, вставь ссылку в HTML выше:
        data-video-url="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"

        Примеры:
        YouTube embed:
        https://www.youtube.com/embed/VIDEO_ID?autoplay=1

        Vimeo embed:
        https://player.vimeo.com/video/VIDEO_ID?autoplay=1

        MP4-файл лучше вставлять отдельным <video>, скажи мне — я адаптирую код.
      */

      if (!videoUrl) {
        player.classList.add("is-empty-video");
        playButton.animate(
          [
            { transform: "translate(-50%, -50%) scale(1)" },
            { transform: "translate(-50%, -50%) scale(1.08)" },
            { transform: "translate(-50%, -50%) scale(1)" }
          ],
          {
            duration: 320,
            easing: "ease-out"
          }
        );
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.src = videoUrl;
      iframe.title = "Видео";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;

      player.innerHTML = "";
      player.appendChild(iframe);
    });
  })();

(function () {
    const carousel = document.querySelector(".tariffs-carousel");
    if (!carousel) return;

    const slots = {
      left: carousel.querySelector(".tariff-slot-left"),
      center: carousel.querySelector(".tariff-slot-center"),
      right: carousel.querySelector(".tariff-slot-right")
    };

    const prevButton = carousel.querySelector(".tariffs-prev");
    const nextButton = carousel.querySelector(".tariffs-next");

    const tariffs = [
      {
        title: "Быстрый старт",
        price: "9 900 ₽",
        popular: false,
        time: "3 дня",
        items: [
          { type: "check", text: "Автоматизация 2-х самых критичных сценариев (например, создание заказа)" },
          { type: "check", text: "Настройка на вашем локальном ПК" },
          { type: "no", text: "Инструкция для разработчиков, как запускать тесты" },
          { type: "no", text: "Полный цикл: от настройки CI/CD до обучения ваших сотрудников" }
        ]
      },
      {
        title: "Стандарт",
        price: "15 900 ₽",
        popular: true,
        time: "7–10 дней",
        items: [
          { type: "check", text: "Покрытие основных бизнес-процессов (до 10 сценариев)" },
          { type: "check", text: "Настройка регулярного запуска тестов" },
          { type: "check", text: "Инструкция для разработчиков, как запускать тесты" },
          { type: "check", text: "Настройка на вашем локальном ПК" },
          { type: "no", text: "Сопровождение и актуализация тестов — 1 месяц" },
          { type: "no", text: "Полный цикл: от настройки CI/CD до обучения ваших сотрудников" }
        ]
      },
      {
        title: "Под ключ",
        price: "45 000 ₽",
        popular: false,
        time: "Индивидуально",
        items: [
          { type: "check", text: "Полный цикл: от настройки CI/CD до обучения ваших сотрудников" },
          { type: "check", text: "Сопровождение и актуализация тестов — 1 месяц" },
          { type: "check", text: "Разработка RPA-роботов для автоматизации рутины (заполнение документов, сверка данных) — по запросу" }
        ]
      }
    ];

    let order = [0, 1, 2];
    let isAnimating = false;

    function icon(type) {
      if (type === "check") {
        return `
          <span class="tariff-icon tariff-icon-check">
            <svg viewBox="0 0 30 30" fill="none">
              <path d="M7.51147 15.2492L11.7441 20.2399L22.4885 9.75977" stroke="currentColor" stroke-width="2.60869" stroke-linecap="round"/>
            </svg>
          </span>
        `;
      }

      return `
        <span class="tariff-icon tariff-icon-no">
          <svg viewBox="0 0 30 30" fill="none">
            <path d="M20.4968 7.95736C20.8831 7.56283 21.5162 7.55561 21.9108 7.94173C22.3053 8.32813 22.3118 8.96122 21.9255 9.3558L16.3991 14.9993L21.9255 20.6439C22.3118 21.0385 22.3054 21.6716 21.9108 22.0579C21.5163 22.4441 20.8831 22.4377 20.4968 22.0433L14.9997 16.429L9.50362 22.0433C9.1173 22.4377 8.48414 22.444 8.08956 22.0579C7.69503 21.6716 7.68781 21.0385 8.07393 20.6439L13.6003 14.9993L8.07393 9.3558C7.68781 8.96123 7.695 8.32813 8.08956 7.94173C8.48414 7.55561 9.11729 7.56283 9.50362 7.95736L14.9997 13.5706L20.4968 7.95736Z" fill="currentColor"/>
          </svg>
        </span>
      `;
    }

    function cardHTML(tariff, isCenter) {
      const itemsHTML = tariff.items.map(function (item) {
        return `
          <li class="${item.type === "check" ? "is-included" : "is-excluded"}">
            ${icon(item.type)}
            <span>${item.text}</span>
          </li>
        `;
      }).join("");

      return `
        <h3>${tariff.title}</h3>
        <div class="tariff-price">${tariff.price}</div>

        <p class="tariff-label">Что входит в тариф:</p>

        <ul class="tariff-list">
          ${itemsHTML}
        </ul>

        <div class="tariff-time">Срок: <b>${tariff.time}</b></div>

        <button class="tariff-button ${isCenter ? "tariff-button-primary" : "tariff-button-outline"}" type="button" data-telegram-cta>Выбрать</button>
      `;
    }

    function render() {
      slots.left.querySelector(".tariff-card-inner").innerHTML = cardHTML(tariffs[order[0]], false);
      slots.center.querySelector(".tariff-card-inner").innerHTML = cardHTML(tariffs[order[1]], true);
      slots.right.querySelector(".tariff-card-inner").innerHTML = cardHTML(tariffs[order[2]], false);

      const popular = slots.center.querySelector(".tariff-popular");
      popular.hidden = !tariffs[order[1]].popular;
    }

    function change(direction) {
      if (isAnimating) return;
      isAnimating = true;

      Object.values(slots).forEach(function (slot) {
        slot.classList.add("is-changing");
      });

      window.setTimeout(function () {
        if (direction === "next") {
          order.push(order.shift());
        } else {
          order.unshift(order.pop());
        }

        render();

        window.setTimeout(function () {
          Object.values(slots).forEach(function (slot) {
            slot.classList.remove("is-changing");
          });
          isAnimating = false;
        }, 40);
      }, 180);
    }

    prevButton.addEventListener("click", function () {
      change("prev");
    });

    nextButton.addEventListener("click", function () {
      change("next");
    });

    render();
  })();

(function () {
    const TIME_PER_SCENARIO_HOURS = 0.3166667;

    const releases = document.getElementById("releases");
    const scenarios = document.getElementById("scenarios");
    const rate = document.getElementById("rate");

    const releasesValue = document.getElementById("releasesValue");
    const scenariosValue = document.getElementById("scenariosValue");
    const rateValue = document.getElementById("rateValue");

    const hoursResult = document.getElementById("hoursResult");
    const moneyResult = document.getElementById("moneyResult");

    const resultBoxes = document.querySelectorAll(".roi-result-box");
    const outputs = document.querySelectorAll(".roi-control output");

    function formatNumber(value) {
      return Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, " ");
    }

    function updateRangeProgress(input) {
      const min = Number(input.min);
      const max = Number(input.max);
      const value = Number(input.value);
      const progress = ((value - min) / (max - min)) * 100;
      input.style.setProperty("--progress", progress + "%");
    }

    function pulseElements() {
      resultBoxes.forEach((box) => {
        box.classList.remove("is-changing");
        void box.offsetWidth;
        box.classList.add("is-changing");
      });

      outputs.forEach((output) => {
        output.classList.remove("is-changing");
        void output.offsetWidth;
        output.classList.add("is-changing");
      });

      window.clearTimeout(window.roiPulseTimeout);
      window.roiPulseTimeout = window.setTimeout(() => {
        resultBoxes.forEach((box) => box.classList.remove("is-changing"));
        outputs.forEach((output) => output.classList.remove("is-changing"));
      }, 180);
    }

    function calculate(shouldPulse) {
      const releasesCount = Number(releases.value);
      const scenariosCount = Number(scenarios.value);
      const hourlyRate = Number(rate.value);

      const hoursPerYear = releasesCount * scenariosCount * TIME_PER_SCENARIO_HOURS * 12;
      const moneyPerYear = hoursPerYear * hourlyRate;

      releasesValue.textContent = formatNumber(releasesCount);
      scenariosValue.textContent = formatNumber(scenariosCount);
      rateValue.textContent = formatNumber(hourlyRate) + " ₽ / час";

      hoursResult.textContent = formatNumber(hoursPerYear);
      moneyResult.textContent = formatNumber(moneyPerYear);

      updateRangeProgress(releases);
      updateRangeProgress(scenarios);
      updateRangeProgress(rate);

      if (shouldPulse) {
        pulseElements();
      }
    }

    [releases, scenarios, rate].forEach((input) => {
      input.addEventListener("input", () => calculate(true));
    });

    calculate(false);
  })();
