// 打字機動畫效果
document.addEventListener("DOMContentLoaded", function () {
  console.log("Typewriter animation script loaded");

  function initTypewriterAnimation() {
    console.log("初始化打字機動畫");
    const heroTitleText = document.getElementById("hero-title-text");
    const heroSubtitleText = document.getElementById("hero-subtitle-text");

    if (heroTitleText && heroSubtitleText) {
      console.log("找到標題元素，準備動畫");
      const titleText = "歡迎來到我的數位空間";
      const subtitleText = "探索我的專案、想法與創作";

      // 確保 GSAP 已載入
      if (typeof gsap !== "undefined") {
        console.log("GSAP 已載入");

        // 確保 TextPlugin 已註冊
        if (gsap.registerPlugin) {
          console.log("註冊 TextPlugin");
          gsap.registerPlugin(TextPlugin);
        }

        // 重置初始狀態
        gsap.set([heroTitleText, heroSubtitleText], { text: "" });

        // 主標題打字動畫
        const titleTimeline = gsap.timeline({
          delay: 0.5,
          onStart: () => console.log("開始主標題動畫"),
          onComplete: () => {
            console.log("主標題動畫完成，開始副標題");
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
          onComplete: () => console.log("所有打字動畫完成"),
        });
      } else {
        // 如果 GSAP 未載入，直接顯示文字
        console.error("GSAP 未載入，直接顯示文字");
        heroTitleText.textContent = titleText;
        heroSubtitleText.textContent = subtitleText;
      }
    } else {
      console.error("找不到標題元素 #hero-title-text 或 #hero-subtitle-text");
    }
  }

  // 延遲一下確保 GSAP 和 DOM 都已準備好
  setTimeout(initTypewriterAnimation, 500);
});
