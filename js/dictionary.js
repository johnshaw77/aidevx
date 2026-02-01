/**
 * 繁體字與拼音對照字典
 * 分為三個難度等級：初級（單字）、中級（詞組）、高級（句子）
 */

// 首先定義一個轉換函數，將帶音調拼音轉換為無音調版本
function removeToneMarks(pinyin) {
  return pinyin
    .normalize("NFD") // 將字符分解為基本字符和組合用字符
    .replace(/[\u0300-\u036f]/g, "") // 移除所有變音符號
    .replace(/v/g, "u") // 將 v 轉換為 u (處理 ü)
    .replace(/V/g, "U"); // 將 V 轉換為 U
}

// 初級 - 常用單字
const easyDictionary = [
  { character: "愛", pinyin: "ài", pinyinNoTone: "ai" },
  { character: "八", pinyin: "bā", pinyinNoTone: "ba" },
  { character: "爸", pinyin: "bà", pinyinNoTone: "ba" },
  { character: "杯", pinyin: "bēi", pinyinNoTone: "bei" },
  { character: "北", pinyin: "běi", pinyinNoTone: "bei" },
  { character: "本", pinyin: "běn", pinyinNoTone: "ben" },
  { character: "不", pinyin: "bù", pinyinNoTone: "bu" },
  { character: "菜", pinyin: "cài", pinyinNoTone: "cai" },
  { character: "茶", pinyin: "chá", pinyinNoTone: "cha" },
  { character: "吃", pinyin: "chī", pinyinNoTone: "chi" },
  { character: "出", pinyin: "chū", pinyinNoTone: "chu" },
  { character: "打", pinyin: "dǎ", pinyinNoTone: "da" },
  { character: "大", pinyin: "dà", pinyinNoTone: "da" },
  { character: "的", pinyin: "de", pinyinNoTone: "de" },
  { character: "點", pinyin: "diǎn", pinyinNoTone: "dian" },
  { character: "電", pinyin: "diàn", pinyinNoTone: "dian" },
  { character: "東", pinyin: "dōng", pinyinNoTone: "dong" },
  { character: "都", pinyin: "dōu", pinyinNoTone: "dou" },
  { character: "讀", pinyin: "dú", pinyinNoTone: "du" },
  { character: "對", pinyin: "duì", pinyinNoTone: "dui" },
  { character: "多", pinyin: "duō", pinyinNoTone: "duo" },
  { character: "兒", pinyin: "ér", pinyinNoTone: "er" },
  { character: "二", pinyin: "èr", pinyinNoTone: "er" },
  { character: "飯", pinyin: "fàn", pinyinNoTone: "fan" },
  { character: "方", pinyin: "fāng", pinyinNoTone: "fang" },
  { character: "飛", pinyin: "fēi", pinyinNoTone: "fei" },
  { character: "分", pinyin: "fēn", pinyinNoTone: "fen" },
  { character: "風", pinyin: "fēng", pinyinNoTone: "feng" },
  { character: "服", pinyin: "fú", pinyinNoTone: "fu" },
  { character: "高", pinyin: "gāo", pinyinNoTone: "gao" },
  { character: "個", pinyin: "gè", pinyinNoTone: "ge" },
  { character: "工", pinyin: "gōng", pinyinNoTone: "gong" },
  { character: "狗", pinyin: "gǒu", pinyinNoTone: "gou" },
  { character: "國", pinyin: "guó", pinyinNoTone: "guo" },
  { character: "果", pinyin: "guǒ", pinyinNoTone: "guo" },
  { character: "過", pinyin: "guò", pinyinNoTone: "guo" },
  { character: "孩", pinyin: "hái", pinyinNoTone: "hai" },
  { character: "漢", pinyin: "hàn", pinyinNoTone: "han" },
  { character: "好", pinyin: "hǎo", pinyinNoTone: "hao" },
  { character: "喝", pinyin: "hē", pinyinNoTone: "he" },
  { character: "很", pinyin: "hěn", pinyinNoTone: "hen" },
  { character: "後", pinyin: "hòu", pinyinNoTone: "hou" },
  { character: "話", pinyin: "huà", pinyinNoTone: "hua" },
  { character: "回", pinyin: "huí", pinyinNoTone: "hui" },
  { character: "會", pinyin: "huì", pinyinNoTone: "hui" },
  { character: "機", pinyin: "jī", pinyinNoTone: "ji" },
  { character: "家", pinyin: "jiā", pinyinNoTone: "jia" },
  { character: "見", pinyin: "jiàn", pinyinNoTone: "jian" },
  { character: "叫", pinyin: "jiào", pinyinNoTone: "jiao" },
  { character: "教", pinyin: "jiāo", pinyinNoTone: "jiao" },
  { character: "今", pinyin: "jīn", pinyinNoTone: "jin" },
  { character: "九", pinyin: "jiǔ", pinyinNoTone: "jiu" },
  { character: "開", pinyin: "kāi", pinyinNoTone: "kai" },
  { character: "看", pinyin: "kàn", pinyinNoTone: "kan" },
  { character: "塊", pinyin: "kuài", pinyinNoTone: "kuai" },
  { character: "來", pinyin: "lái", pinyinNoTone: "lai" },
  { character: "老", pinyin: "lǎo", pinyinNoTone: "lao" },
  { character: "了", pinyin: "le", pinyinNoTone: "le" },
  { character: "裏", pinyin: "lǐ", pinyinNoTone: "li" },
  { character: "六", pinyin: "liù", pinyinNoTone: "liu" },
  { character: "嗎", pinyin: "ma", pinyinNoTone: "ma" },
  { character: "買", pinyin: "mǎi", pinyinNoTone: "mai" },
  { character: "沒", pinyin: "méi", pinyinNoTone: "mei" },
  { character: "美", pinyin: "měi", pinyinNoTone: "mei" },
  { character: "妹", pinyin: "mèi", pinyinNoTone: "mei" },
  { character: "門", pinyin: "mén", pinyinNoTone: "men" },
  { character: "們", pinyin: "men", pinyinNoTone: "men" },
  { character: "名", pinyin: "míng", pinyinNoTone: "ming" },
  { character: "明", pinyin: "míng", pinyinNoTone: "ming" },
  { character: "那", pinyin: "nà", pinyinNoTone: "na" },
  { character: "哪", pinyin: "nǎ", pinyinNoTone: "na" },
  { character: "呢", pinyin: "ne", pinyinNoTone: "ne" },
  { character: "能", pinyin: "néng", pinyinNoTone: "neng" },
  { character: "你", pinyin: "nǐ", pinyinNoTone: "ni" },
  { character: "年", pinyin: "nián", pinyinNoTone: "nian" },
  { character: "女", pinyin: "nǚ", pinyinNoTone: "nu" },
  { character: "朋", pinyin: "péng", pinyinNoTone: "peng" },
  { character: "七", pinyin: "qī", pinyinNoTone: "qi" },
  { character: "前", pinyin: "qián", pinyinNoTone: "qian" },
  { character: "請", pinyin: "qǐng", pinyinNoTone: "qing" },
  { character: "去", pinyin: "qù", pinyinNoTone: "qu" },
  { character: "人", pinyin: "rén", pinyinNoTone: "ren" },
  { character: "日", pinyin: "rì", pinyinNoTone: "ri" },
  { character: "三", pinyin: "sān", pinyinNoTone: "san" },
  { character: "上", pinyin: "shàng", pinyinNoTone: "shang" },
  { character: "少", pinyin: "shǎo", pinyinNoTone: "shao" },
  { character: "誰", pinyin: "shuí", pinyinNoTone: "shui" },
  { character: "什", pinyin: "shén", pinyinNoTone: "shen" },
  { character: "生", pinyin: "shēng", pinyinNoTone: "sheng" },
  { character: "師", pinyin: "shī", pinyinNoTone: "shi" },
  { character: "十", pinyin: "shí", pinyinNoTone: "shi" },
  { character: "時", pinyin: "shí", pinyinNoTone: "shi" },
  { character: "是", pinyin: "shì", pinyinNoTone: "shi" },
  { character: "書", pinyin: "shū", pinyinNoTone: "shu" },
  { character: "水", pinyin: "shuǐ", pinyinNoTone: "shui" },
  { character: "說", pinyin: "shuō", pinyinNoTone: "shuo" },
  { character: "四", pinyin: "sì", pinyinNoTone: "si" },
  { character: "歲", pinyin: "suì", pinyinNoTone: "sui" },
  { character: "他", pinyin: "tā", pinyinNoTone: "ta" },
  { character: "她", pinyin: "tā", pinyinNoTone: "ta" },
  { character: "太", pinyin: "tài", pinyinNoTone: "tai" },
  { character: "天", pinyin: "tiān", pinyinNoTone: "tian" },
  { character: "聽", pinyin: "tīng", pinyinNoTone: "ting" },
  { character: "同", pinyin: "tóng", pinyinNoTone: "tong" },
  { character: "圖", pinyin: "tú", pinyinNoTone: "tu" },
];

// 中級 - 常用詞組
const mediumDictionary = [
  { character: "謝謝", pinyin: "xiè xie", pinyinNoTone: "xie xie" },
  { character: "你好", pinyin: "nǐ hǎo", pinyinNoTone: "ni hao" },
  { character: "早安", pinyin: "zǎo ān", pinyinNoTone: "zao an" },
  { character: "晚安", pinyin: "wǎn ān", pinyinNoTone: "wan an" },
  { character: "對不起", pinyin: "duì bù qǐ", pinyinNoTone: "dui bu qi" },
  { character: "沒關係", pinyin: "méi guān xì", pinyinNoTone: "mei guan xi" },
  { character: "不客氣", pinyin: "bù kè qì", pinyinNoTone: "bu ke qi" },
  { character: "學生", pinyin: "xué shēng", pinyinNoTone: "xue sheng" },
  { character: "老師", pinyin: "lǎo shī", pinyinNoTone: "lao shi" },
  { character: "朋友", pinyin: "péng you", pinyinNoTone: "peng you" },
  { character: "家人", pinyin: "jiā rén", pinyinNoTone: "jia ren" },
  { character: "爸爸", pinyin: "bà ba", pinyinNoTone: "ba ba" },
  { character: "媽媽", pinyin: "mā ma", pinyinNoTone: "ma ma" },
  { character: "哥哥", pinyin: "gē ge", pinyinNoTone: "ge ge" },
  { character: "姐姐", pinyin: "jiě jie", pinyinNoTone: "jie jie" },
  { character: "弟弟", pinyin: "dì di", pinyinNoTone: "di di" },
  { character: "妹妹", pinyin: "mèi mei", pinyinNoTone: "mei mei" },
  { character: "喜歡", pinyin: "xǐ huān", pinyinNoTone: "xi huan" },
  { character: "愛好", pinyin: "ài hào", pinyinNoTone: "ai hao" },
  { character: "工作", pinyin: "gōng zuò", pinyinNoTone: "gong zuo" },
  { character: "學習", pinyin: "xué xí", pinyinNoTone: "xue xi" },
  { character: "休息", pinyin: "xiū xí", pinyinNoTone: "xiu xi" },
  { character: "飯店", pinyin: "fàn diàn", pinyinNoTone: "fan dian" },
  { character: "醫院", pinyin: "yī yuàn", pinyinNoTone: "yi yuan" },
  { character: "學校", pinyin: "xué xiào", pinyinNoTone: "xue xiao" },
  { character: "圖書館", pinyin: "tú shū guǎn", pinyinNoTone: "tu shu guan" },
  { character: "商店", pinyin: "shāng diàn", pinyinNoTone: "shang dian" },
  { character: "電腦", pinyin: "diàn nǎo", pinyinNoTone: "dian nao" },
  { character: "手機", pinyin: "shǒu jī", pinyinNoTone: "shou ji" },
  { character: "公車", pinyin: "gōng chē", pinyinNoTone: "gong che" },
  { character: "地鐵", pinyin: "dì tiě", pinyinNoTone: "di tie" },
  { character: "飛機", pinyin: "fēi jī", pinyinNoTone: "fei ji" },
  { character: "火車", pinyin: "huǒ chē", pinyinNoTone: "huo che" },
  { character: "出租車", pinyin: "chū zū chē", pinyinNoTone: "chu zu che" },
  { character: "星期一", pinyin: "xīng qī yī", pinyinNoTone: "xing qi yi" },
  { character: "星期二", pinyin: "xīng qī èr", pinyinNoTone: "xing qi er" },
  { character: "星期三", pinyin: "xīng qī sān", pinyinNoTone: "xing qi san" },
  { character: "星期四", pinyin: "xīng qī sì", pinyinNoTone: "xing qi si" },
  { character: "星期五", pinyin: "xīng qī wǔ", pinyinNoTone: "xing qi wu" },
  { character: "星期六", pinyin: "xīng qī liù", pinyinNoTone: "xing qi liu" },
  { character: "星期日", pinyin: "xīng qī rì", pinyinNoTone: "xing qi ri" },
  { character: "現在", pinyin: "xiàn zài", pinyinNoTone: "xian zai" },
  { character: "昨天", pinyin: "zuó tiān", pinyinNoTone: "zuo tian" },
  { character: "今天", pinyin: "jīn tiān", pinyinNoTone: "jin tian" },
  { character: "明天", pinyin: "míng tiān", pinyinNoTone: "ming tian" },
  { character: "上午", pinyin: "shàng wǔ", pinyinNoTone: "shang wu" },
  { character: "中午", pinyin: "zhōng wǔ", pinyinNoTone: "zhong wu" },
  { character: "下午", pinyin: "xià wǔ", pinyinNoTone: "xia wu" },
  { character: "晚上", pinyin: "wǎn shàng", pinyinNoTone: "wan shang" },
];

// 高級 - 常用句子
const hardDictionary = [
  { character: "你好嗎？", pinyin: "nǐ hǎo ma?", pinyinNoTone: "ni hao ma?" },
  {
    character: "我很好，謝謝。",
    pinyin: "wǒ hěn hǎo, xiè xie.",
    pinyinNoTone: "wo hen hao, xie xie.",
  },
  {
    character: "你叫什麼名字？",
    pinyin: "nǐ jiào shén me míng zì?",
    pinyinNoTone: "ni jiao shen me ming zi?",
  },
  {
    character: "我叫王明。",
    pinyin: "wǒ jiào wáng míng.",
    pinyinNoTone: "wo jiao wang ming.",
  },
  {
    character: "你是哪國人？",
    pinyin: "nǐ shì nǎ guó rén?",
    pinyinNoTone: "ni shi na guo ren?",
  },
  {
    character: "我是台灣人。",
    pinyin: "wǒ shì tái wān rén.",
    pinyinNoTone: "wo shi tai wan ren.",
  },
  {
    character: "你會說中文嗎？",
    pinyin: "nǐ huì shuō zhōng wén ma?",
    pinyinNoTone: "ni hui shuo zhong wen ma?",
  },
  {
    character: "我會說一點中文。",
    pinyin: "wǒ huì shuō yì diǎn zhōng wén.",
    pinyinNoTone: "wo hui shuo yi dian zhong wen.",
  },
  {
    character: "這個多少錢？",
    pinyin: "zhè ge duō shǎo qián?",
    pinyinNoTone: "zhe ge duo shao qian?",
  },
  {
    character: "一百元。",
    pinyin: "yì bǎi yuán.",
    pinyinNoTone: "yi bai yuan.",
  },
  { character: "太貴了。", pinyin: "tài guì le.", pinyinNoTone: "tai gui le." },
  {
    character: "可以便宜一點嗎？",
    pinyin: "kě yǐ pián yí yì diǎn ma?",
    pinyinNoTone: "ke yi pian yi yi dian ma?",
  },
  {
    character: "現在幾點了？",
    pinyin: "xiàn zài jǐ diǎn le?",
    pinyinNoTone: "xian zai ji dian le?",
  },
  {
    character: "現在三點半。",
    pinyin: "xiàn zài sān diǎn bàn.",
    pinyinNoTone: "xian zai san dian ban.",
  },
  {
    character: "你要去哪裡？",
    pinyin: "nǐ yào qù nǎ lǐ?",
    pinyinNoTone: "ni yao qu na li?",
  },
  {
    character: "我要去圖書館。",
    pinyin: "wǒ yào qù tú shū guǎn.",
    pinyinNoTone: "wo yao qu tu shu guan.",
  },
  {
    character: "這個週末你有空嗎？",
    pinyin: "zhè ge zhōu mò nǐ yǒu kòng ma?",
    pinyinNoTone: "zhe ge zhou mo ni you kong ma?",
  },
  {
    character: "對不起，我很忙。",
    pinyin: "duì bù qǐ, wǒ hěn máng.",
    pinyinNoTone: "dui bu qi, wo hen mang.",
  },
  {
    character: "我喜歡吃中國菜。",
    pinyin: "wǒ xǐ huān chī zhōng guó cài.",
    pinyinNoTone: "wo xi huan chi zhong guo cai.",
  },
  {
    character: "我不喜歡吃辣的食物。",
    pinyin: "wǒ bù xǐ huān chī là de shí wù.",
    pinyinNoTone: "wo bu xi huan chi la de shi wu.",
  },
  {
    character: "你住在哪裡？",
    pinyin: "nǐ zhù zài nǎ lǐ?",
    pinyinNoTone: "ni zhu zai na li?",
  },
  {
    character: "我住在台北市。",
    pinyin: "wǒ zhù zài tái běi shì.",
    pinyinNoTone: "wo zhu zai tai bei shi.",
  },
  {
    character: "你做什麼工作？",
    pinyin: "nǐ zuò shén me gōng zuò?",
    pinyinNoTone: "ni zuo shen me gong zuo?",
  },
  {
    character: "我是一名老師。",
    pinyin: "wǒ shì yì míng lǎo shī.",
    pinyinNoTone: "wo shi yi ming lao shi.",
  },
  {
    character: "我想學習中文。",
    pinyin: "wǒ xiǎng xué xí zhōng wén.",
    pinyinNoTone: "wo xiang xue xi zhong wen.",
  },
  {
    character: "中文很難學嗎？",
    pinyin: "zhōng wén hěn nán xué ma?",
    pinyinNoTone: "zhong wen hen nan xue ma?",
  },
  {
    character: "不會，很有趣。",
    pinyin: "bù huì, hěn yǒu qù.",
    pinyinNoTone: "bu hui, hen you qu.",
  },
  {
    character: "你學中文多久了？",
    pinyin: "nǐ xué zhōng wén duō jiǔ le?",
    pinyinNoTone: "ni xue zhong wen duo jiu le?",
  },
  {
    character: "我學了兩年了。",
    pinyin: "wǒ xué le liǎng nián le.",
    pinyinNoTone: "wo xue le liang nian le.",
  },
  {
    character: "你的中文說得很好。",
    pinyin: "nǐ de zhōng wén shuō de hěn hǎo.",
    pinyinNoTone: "ni de zhong wen shuo de hen hao.",
  },
];

/**
 * 根據難度等級獲取字典
 * @param {string} difficulty - 難度等級: 'easy', 'medium', 'hard'
 * @param {boolean} useNoTone - 是否使用無音調拼音
 * @returns {Array} 對應難度的字典
 */
function getDictionary(difficulty, useNoTone = false) {
  let dictionary;

  switch (difficulty) {
    case "easy":
      dictionary = easyDictionary;
      break;
    case "medium":
      dictionary = mediumDictionary;
      break;
    case "hard":
      dictionary = hardDictionary;
      break;
    default:
      dictionary = easyDictionary;
  }

  // 如果使用無音調拼音，則將 pinyinNoTone 的值複製到 pinyin 欄位
  if (useNoTone) {
    return dictionary.map((item) => ({
      character: item.character,
      pinyin: item.pinyinNoTone,
      originalPinyin: item.pinyin,
    }));
  }

  return dictionary;
}
