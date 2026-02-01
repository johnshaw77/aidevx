// 主題切換功能
document.addEventListener("DOMContentLoaded", function () {
  const themeTogglers = document.querySelectorAll(
    "#theme-toggle-light, #theme-toggle-dark"
  );
  const htmlElement = document.documentElement;
  const body = document.body;

  // 檢測系統首選主題
  function detectSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "theme-dark"
      : "theme-light";
  }

  // 切換主題並更新 UI
  function setTheme(theme) {
    // 同時更新 HTML 和 body 元素的主題類
    htmlElement.classList.remove("theme-light", "theme-dark");
    htmlElement.classList.add(theme);
    body.classList.remove("theme-light", "theme-dark");
    body.classList.add(theme);

    localStorage.setItem("theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "theme-dark" ? "#111827" : "#ffffff");

    // 強制刷新部分元素的樣式
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.style.display = "none";
      setTimeout(() => (card.style.display = ""), 10);
    });
  }

  // 檢查本地存儲中的主題設置，如果沒有則使用系統主題
  const savedTheme = localStorage.getItem("theme") || detectSystemTheme();
  setTheme(savedTheme);

  // 主題切換事件監聽
  themeTogglers.forEach((toggler) => {
    toggler.addEventListener("click", function (e) {
      e.preventDefault();

      const newTheme = body.classList.contains("theme-light")
        ? "theme-dark"
        : "theme-light";
      setTheme(newTheme);
    });
  });

  // 監聽系統主題變化
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        // 僅當用戶未手動設置主題時
        setTheme(e.matches ? "theme-dark" : "theme-light");
      }
    });

  // 初始化提示工具
  if (typeof bootstrap !== "undefined") {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) =>
        new bootstrap.Tooltip(tooltipTriggerEl, {
          delay: { show: 500, hide: 100 },
        })
    );
  }

  // Hero Section 滑鼠互動效果
  const heroSection = document.querySelector(".hero-section");
  const heroShapes = document.querySelectorAll(".hero-shape");
  const heroTitle = document.querySelector(".hero-title");

  if (heroSection && heroShapes.length > 0) {
    heroSection.addEventListener("mousemove", function (e) {
      // 取得滑鼠位置相對於區塊的百分比
      const x = e.clientX / heroSection.offsetWidth;
      const y = e.clientY / heroSection.offsetHeight;

      // 移動幾何形狀元素
      heroShapes.forEach((shape, index) => {
        const intensity = (index + 1) * 10; // 不同形狀有不同的移動強度
        const xMove = (x - 0.5) * intensity; // -0.5 到 0.5 之間的範圍
        const yMove = (y - 0.5) * intensity;

        shape.style.transform = `translate(${xMove}px, ${yMove}px) ${getShapeRotation(
          shape
        )}`;
      });

      // 標題微妙跟隨效果
      if (heroTitle) {
        heroTitle.style.transform = `translate(${(x - 0.5) * 10}px, ${
          (y - 0.5) * 10
        }px)`;
      }
    });

    // 重置形狀位置當滑鼠離開區域時
    heroSection.addEventListener("mouseleave", function () {
      heroShapes.forEach((shape) => {
        shape.style.transform = getShapeRotation(shape);
      });

      if (heroTitle) {
        heroTitle.style.transform = "translate(0, 0)";
      }
    });
  }

  // 幫助取得形狀的原始旋轉樣式
  function getShapeRotation(shape) {
    if (shape.classList.contains("hero-shape-1")) {
      return "rotate(0deg)";
    } else if (shape.classList.contains("hero-shape-3")) {
      return "rotate(45deg)";
    } else if (shape.classList.contains("hero-shape-4")) {
      return "rotate(0deg)";
    }
    return "";
  }

  // 載入時的淡入動畫
  function animateHeroElements() {
    const heroElements = document.querySelectorAll(
      ".hero-title, .hero-subtitle, .hero-btn"
    );
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 1s ease, transform 1s ease";

        setTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, 100);
      }, index * 200);
    });
  }

  // 頁面載入時執行淡入動畫
  if (document.querySelector(".hero-title")) {
    animateHeroElements();
  }

  // 打字機動畫效果
  function initTypewriterAnimation() {
    const heroTitleText = document.getElementById("hero-title-text");
    const heroSubtitleText = document.getElementById("hero-subtitle-text");

    if (heroTitleText && heroSubtitleText) {
      const titleText = "歡迎來到我的數位空間";
      const subtitleText = "探索我的專案、想法與創作";

      // 確保 GSAP 和 TextPlugin 已載入
      if (typeof gsap !== "undefined" && gsap.plugins.TextPlugin) {
        // 重置初始狀態
        gsap.set([heroTitleText, heroSubtitleText], { text: "" });

        // 主標題打字動畫
        const titleTimeline = gsap.timeline({
          delay: 0.5,
          onComplete: () => {
            // 當主標題動畫完成後，開始副標題動畫
            subtitleTimeline.play();
          },
        });

        titleTimeline.to(heroTitleText, {
          duration: 2.5,
          text: {
            value: titleText,
            delimiter: "", // 逐字元顯示
          },
          ease: "none",
        });

        // 副標題打字動畫
        const subtitleTimeline = gsap.timeline({ paused: true });

        subtitleTimeline.to(heroSubtitleText, {
          duration: 2,
          text: {
            value: subtitleText,
            delimiter: "",
          },
          ease: "none",
        });
      } else {
        // 如果 GSAP 或 TextPlugin 未載入，直接顯示文字
        heroTitleText.textContent = titleText;
        heroSubtitleText.textContent = subtitleText;
        console.warn("GSAP or TextPlugin is not loaded.");
      }
    }
  }

  // 初始化打字機動畫
  initTypewriterAnimation();
});

// 滾動時導航項目高亮顯示
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar .nav-link");

  function highlightNavItem() {
    let scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavItem);

  // 平滑滾動
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // 科技感 UI 效果
  function initTechEffects() {
    // 為所有 portfolio-card 添加科技風格類別
    const portfolioCards = document.querySelectorAll(".portfolio-card");
    portfolioCards.forEach((card, index) => {
      card.classList.add("tech-grid-bg", "border-glow");

      // 為部分卡片添加數據流動畫
      if (index % 3 === 1) {
        card.classList.add("data-flow");
      }
    });

    // 為所有 avatar 添加粒子效果
    const avatars = document.querySelectorAll(
      ".avatar:not(.particle-effect):not(.data-flow)"
    );
    avatars.forEach((avatar) => {
      avatar.classList.add("particle-effect");
    });

    // 創建背景動畫效果
    animateBackgroundGlow();
  }

  // 背景發光動畫
  function animateBackgroundGlow() {
    // 為特定科技元素添加動態效果
    const techElements = document.querySelectorAll(
      ".avatar.bg-primary-lt, .avatar.bg-primary, .avatar.bg-green-lt, .avatar.bg-purple-lt"
    );

    techElements.forEach((el) => {
      // 隨機脈衝效果
      setInterval(() => {
        const glowIntensity = 0.2 + Math.random() * 0.3; // 20-50% 強度
        el.style.boxShadow = `0 0 15px rgba(var(--tblr-primary-rgb), ${glowIntensity})`;

        setTimeout(() => {
          el.style.boxShadow = "";
        }, 700 + Math.random() * 300); // 700-1000ms 持續時間
      }, 2000 + Math.random() * 3000); // 2-5s 間隔
    });
  }

  // 初始化科技效果
  initTechEffects();
});
