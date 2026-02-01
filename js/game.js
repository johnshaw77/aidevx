/**
 * 繁體拼音練習遊戲邏輯
 */

// 遊戲狀態
let gameState = {
  currentDifficulty: "easy",
  currentDictionary: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  skippedCount: 0,
  timeRemaining: 60,
  timer: null,
  isGameRunning: false,
  useNoTone: false, // 是否使用無音調拼音（預設為否）
  testedCharacters: [], // 記錄測試過的字及其拼音
};

/**
 * 初始化遊戲
 * @param {string} difficulty - 難度等級
 * @param {boolean} useNoTone - 是否使用無音調拼音
 */
function initGame(difficulty, useNoTone = false) {
  // 清空遊戲狀態
  resetGameState();

  // 設置難度、音調模式和對應字典
  gameState.currentDifficulty = difficulty;
  gameState.useNoTone = useNoTone;
  gameState.currentDictionary = getDictionary(difficulty, useNoTone);

  // 打亂字典順序
  shuffleDictionary();

  // 設置計時器時間（根據難度調整）
  switch (difficulty) {
    case "easy":
      gameState.timeRemaining = 360;
      break;
    case "medium":
      gameState.timeRemaining = 90;
      break;
    case "hard":
      gameState.timeRemaining = 120;
      break;
  }

  // 更新界面顯示
  updateTimerDisplay();
  updateScoreDisplay();
  updateProgressDisplay();
  updatePinyinModeDisplay();

  // 顯示第一個漢字
  showNextCharacter();

  // 設置遊戲狀態為運行中
  gameState.isGameRunning = true;

  // 啟動計時器
  startTimer();

  // 聚焦到拼音輸入框
  document.getElementById("pinyin-input").focus();
}

/**
 * 重置遊戲狀態
 */
function resetGameState() {
  gameState.currentIndex = 0;
  gameState.score = 0;
  gameState.correctCount = 0;
  gameState.wrongCount = 0;
  gameState.skippedCount = 0;
  gameState.isGameRunning = false;
  gameState.testedCharacters = []; // 清空測試過的字

  // 清除計時器
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }

  // 清空輸入框
  document.getElementById("pinyin-input").value = "";
  document
    .getElementById("pinyin-input")
    .classList.remove("correct-answer", "wrong-answer");

  // 隱藏正確拼音
  document.getElementById("correct-pinyin").classList.add("d-none");

  // 重置按鈕顯示
  document.getElementById("next-btn").classList.add("d-none");
  document.getElementById("skip-btn").classList.remove("d-none");
}

/**
 * 打亂字典順序（Fisher-Yates 洗牌算法）
 */
function shuffleDictionary() {
  const dictionary = gameState.currentDictionary;
  for (let i = dictionary.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dictionary[i], dictionary[j]] = [dictionary[j], dictionary[i]];
  }
}

/**
 * 顯示下一個漢字
 */
function showNextCharacter() {
  if (gameState.currentIndex >= gameState.currentDictionary.length) {
    // 如果已經顯示完所有字，重新打亂字典
    shuffleDictionary();
    gameState.currentIndex = 0;
  }

  const currentItem = gameState.currentDictionary[gameState.currentIndex];

  // 更新漢字顯示
  document.getElementById("character").textContent = currentItem.character;

  // 更新正確拼音（但保持隱藏）
  document.getElementById("correct-pinyin").textContent = currentItem.pinyin;

  // 如果有原始拼音（使用無音調模式時），同時顯示原始拼音
  if (gameState.useNoTone && currentItem.originalPinyin) {
    document
      .getElementById("correct-pinyin")
      .setAttribute("data-original", currentItem.originalPinyin);
  } else {
    document.getElementById("correct-pinyin").removeAttribute("data-original");
  }

  document.getElementById("correct-pinyin").classList.add("d-none");

  // 清空輸入框並重置樣式
  const pinyinInput = document.getElementById("pinyin-input");
  pinyinInput.value = "";
  pinyinInput.classList.remove("correct-answer", "wrong-answer");
  pinyinInput.disabled = false;
  pinyinInput.focus();

  // 隱藏下一個按鈕，顯示跳過按鈕
  document.getElementById("next-btn").classList.add("d-none");
  document.getElementById("skip-btn").classList.remove("d-none");

  // 更新進度顯示
  updateProgressDisplay();
}

/**
 * 檢查答案
 */
function checkAnswer() {
  if (!gameState.isGameRunning) return;

  const userInput = document
    .getElementById("pinyin-input")
    .value.trim()
    .toLowerCase();
  const correctPinyin =
    gameState.currentDictionary[gameState.currentIndex].pinyin.toLowerCase();

  // 準備音效（可選）
  // let sound;

  if (userInput === correctPinyin) {
    // 正確答案處理
    handleCorrectAnswer();
    // sound = document.getElementById('correct-sound');
  } else {
    // 錯誤答案處理
    handleWrongAnswer();
    // sound = document.getElementById('wrong-sound');
  }

  // 播放音效（可選）
  // if (sound) sound.play();

  // 禁用輸入框
  document.getElementById("pinyin-input").disabled = true;

  // 顯示下一個按鈕，隱藏跳過按鈕
  document.getElementById("next-btn").classList.remove("d-none");
  document.getElementById("skip-btn").classList.add("d-none");

  // 自動聚焦到下一個按鈕
  document.getElementById("next-btn").focus();
}

/**
 * 處理正確答案
 */
function handleCorrectAnswer() {
  const pinyinInput = document.getElementById("pinyin-input");

  // 添加正確樣式
  pinyinInput.classList.add("correct-answer");

  // 更新計分
  const pointsEarned = calculatePoints();
  gameState.score += pointsEarned;
  gameState.correctCount++;

  // 更新分數顯示
  updateScoreDisplay();

  // 記錄當前測試的字及拼音
  const currentItem = gameState.currentDictionary[gameState.currentIndex];
  gameState.testedCharacters.push({
    character: currentItem.character,
    pinyin:
      gameState.useNoTone && currentItem.originalPinyin
        ? currentItem.originalPinyin
        : currentItem.pinyin,
    isCorrect: true,
  });

  // 顯示正確的拼音
  const correctPinyinElement = document.getElementById("correct-pinyin");
  correctPinyinElement.classList.remove("d-none");

  // 如果是無音調模式，同時顯示有音調的版本
  if (
    gameState.useNoTone &&
    correctPinyinElement.hasAttribute("data-original")
  ) {
    const originalPinyin = correctPinyinElement.getAttribute("data-original");
    correctPinyinElement.innerHTML = `${correctPinyinElement.textContent} <small class="text-muted">(${originalPinyin})</small>`;
  }
}

/**
 * 處理錯誤答案
 */
function handleWrongAnswer() {
  const pinyinInput = document.getElementById("pinyin-input");

  // 添加錯誤樣式
  pinyinInput.classList.add("wrong-answer");

  // 更新錯誤計數
  gameState.wrongCount++;

  // 記錄當前測試的字及拼音
  const currentItem = gameState.currentDictionary[gameState.currentIndex];
  gameState.testedCharacters.push({
    character: currentItem.character,
    pinyin:
      gameState.useNoTone && currentItem.originalPinyin
        ? currentItem.originalPinyin
        : currentItem.pinyin,
    isCorrect: false,
  });

  // 顯示正確的拼音
  const correctPinyinElement = document.getElementById("correct-pinyin");
  correctPinyinElement.classList.remove("d-none");

  // 如果是無音調模式，同時顯示有音調的版本
  if (
    gameState.useNoTone &&
    correctPinyinElement.hasAttribute("data-original")
  ) {
    const originalPinyin = correctPinyinElement.getAttribute("data-original");
    correctPinyinElement.innerHTML = `${correctPinyinElement.textContent} <small class="text-muted">(${originalPinyin})</small>`;
  }
}

/**
 * 計算得分（根據難度和剩餘時間）
 */
function calculatePoints() {
  let basePoints;

  // 根據難度設置基礎分數
  switch (gameState.currentDifficulty) {
    case "easy":
      basePoints = 10;
      break;
    case "medium":
      basePoints = 15;
      break;
    case "hard":
      basePoints = 20;
      break;
    default:
      basePoints = 10;
  }

  // 加上時間獎勵（剩餘時間越多，獎勵越多）
  const timeBonus = Math.floor(gameState.timeRemaining / 10);

  return basePoints + timeBonus;
}

/**
 * 跳過當前字
 */
function skipCharacter() {
  if (!gameState.isGameRunning) return;

  // 更新跳過計數
  gameState.skippedCount++;

  // 記錄當前測試的字及拼音
  const currentItem = gameState.currentDictionary[gameState.currentIndex];
  gameState.testedCharacters.push({
    character: currentItem.character,
    pinyin:
      gameState.useNoTone && currentItem.originalPinyin
        ? currentItem.originalPinyin
        : currentItem.pinyin,
    isCorrect: null,
  });

  // 顯示正確答案
  const correctPinyinElement = document.getElementById("correct-pinyin");
  correctPinyinElement.classList.remove("d-none");

  // 如果是無音調模式，同時顯示有音調的版本
  if (
    gameState.useNoTone &&
    correctPinyinElement.hasAttribute("data-original")
  ) {
    const originalPinyin = correctPinyinElement.getAttribute("data-original");
    correctPinyinElement.innerHTML = `${correctPinyinElement.textContent} <small class="text-muted">(${originalPinyin})</small>`;
  }

  // 禁用輸入框
  document.getElementById("pinyin-input").disabled = true;

  // 顯示下一個按鈕，隱藏跳過按鈕
  document.getElementById("next-btn").classList.remove("d-none");
  document.getElementById("skip-btn").classList.add("d-none");

  // 自動聚焦到下一個按鈕
  document.getElementById("next-btn").focus();
}

/**
 * 提示功能（顯示部分拼音）
 */
function showHint() {
  if (!gameState.isGameRunning) return;

  const correctPinyin =
    gameState.currentDictionary[gameState.currentIndex].pinyin;
  const pinyinInput = document.getElementById("pinyin-input");

  // 如果是詞組或句子，顯示第一個字的拼音
  if (gameState.currentDifficulty !== "easy") {
    const firstWord = correctPinyin.split(" ")[0];
    pinyinInput.value = firstWord + " ";
  } else {
    // 如果是單字，顯示首字母
    pinyinInput.value = correctPinyin.charAt(0);
  }

  // 聚焦並將光標移到末尾
  pinyinInput.focus();
  pinyinInput.selectionStart = pinyinInput.value.length;
  pinyinInput.selectionEnd = pinyinInput.value.length;
}

/**
 * 進入下一題
 */
function nextCharacter() {
  if (!gameState.isGameRunning) return;

  // 移動到下一個索引
  gameState.currentIndex++;

  // 顯示下一個字
  showNextCharacter();
}

/**
 * 啟動計時器
 */
function startTimer() {
  gameState.timer = setInterval(function () {
    gameState.timeRemaining--;

    // 更新計時器顯示
    updateTimerDisplay();

    // 時間用完，結束遊戲
    if (gameState.timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

/**
 * 更新計時器顯示
 */
function updateTimerDisplay() {
  document.getElementById("timer").textContent = gameState.timeRemaining;
}

/**
 * 更新分數顯示
 */
function updateScoreDisplay() {
  document.getElementById("score").textContent = gameState.score;
}

/**
 * 更新進度顯示
 */
function updateProgressDisplay() {
  document.getElementById("progress").textContent = `${
    gameState.currentIndex + 1
  }/${gameState.currentDictionary.length}`;
}

/**
 * 更新拼音模式顯示
 * 在遊戲界面顯示目前使用的是有音調還是無音調模式
 */
function updatePinyinModeDisplay() {
  const modeElement = document.getElementById("pinyin-mode");
  if (modeElement) {
    modeElement.textContent = gameState.useNoTone ? "無音調模式" : "有音調模式";
  }
}

/**
 * 結束遊戲
 */
function endGame() {
  // 停止計時器
  clearInterval(gameState.timer);
  gameState.timer = null;

  // 設置遊戲狀態為非運行
  gameState.isGameRunning = false;

  // 隱藏遊戲區域，顯示結果區域
  document.getElementById("game-area").classList.add("d-none");
  document.getElementById("result-area").classList.remove("d-none");

  // 更新結果顯示
  document.getElementById("final-score").textContent = gameState.score;
  document.getElementById("correct-count").textContent = gameState.correctCount;
  document.getElementById("wrong-count").textContent = gameState.wrongCount;
  document.getElementById("skipped-count").textContent = gameState.skippedCount;

  // 顯示是否使用無音調模式
  const pinyinModeElement = document.getElementById("result-pinyin-mode");
  if (pinyinModeElement) {
    pinyinModeElement.textContent = gameState.useNoTone
      ? "無音調模式"
      : "有音調模式";
  }

  // 顯示測試過的漢字及其拼音
  const charListElement = document.getElementById("tested-characters-list");
  if (charListElement) {
    charListElement.innerHTML = "";

    if (gameState.testedCharacters.length === 0) {
      charListElement.innerHTML = "<p class='text-center'>沒有測試到任何字</p>";
    } else {
      // 將字按照正確、錯誤和跳過分組
      const correctChars = gameState.testedCharacters.filter(
        (item) => item.isCorrect === true
      );
      const wrongChars = gameState.testedCharacters.filter(
        (item) => item.isCorrect === false
      );
      const skippedChars = gameState.testedCharacters.filter(
        (item) => item.isCorrect === null
      );

      // 創建字元列表
      if (correctChars.length > 0) {
        charListElement.innerHTML += `<h5 class="text-success mt-3">正確回答</h5>`;
        charListElement.innerHTML += createCharacterList(correctChars);
      }

      if (wrongChars.length > 0) {
        charListElement.innerHTML += `<h5 class="text-danger mt-4">錯誤回答</h5>`;
        charListElement.innerHTML += createCharacterList(wrongChars);
      }

      if (skippedChars.length > 0) {
        charListElement.innerHTML += `<h5 class="text-warning mt-4">跳過的字</h5>`;
        charListElement.innerHTML += createCharacterList(skippedChars);
      }
    }
  }
}

/**
 * 創建字元列表 HTML
 * @param {Array} characters - 字元陣列
 * @returns {string} HTML 字符串
 */
function createCharacterList(characters) {
  let html = '<div class="character-list">';

  characters.forEach((item) => {
    html += `
      <div class="character-item">
        <span class="character">${item.character}</span>
        <span class="pinyin">${item.pinyin}</span>
      </div>
    `;
  });

  html += "</div>";
  return html;
}
