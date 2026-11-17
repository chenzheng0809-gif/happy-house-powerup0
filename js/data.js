/* =========================================================
   快乐小屋 · 单元内容数据
   对标 PowerUp 0 Unit 4 "At home"（Lesson 1-8）
   所有教学内容取自用户提供的 8 份课件，并为 4-6 岁儿童做了游戏化改编
   ========================================================= */
window.U4 = window.U4 || {};
(function () {
  "use strict";

  var ART = function (id) { return '<span class="svg-art" data-art="' + id + '"></span>'; };

  /* ---------------- 房间与家具 ---------------- */
  var rooms = {
    bedroom: {
      id: "bedroom", zh: "卧室", en: "bedroom", emoji: "🛏️",
      tile: "linear-gradient(180deg,#EFE6FA,#DCCEF2)",
      wall: "linear-gradient(180deg,#EFE6FA,#DCCEF2)",
      floor: "linear-gradient(180deg,#E8C9A0,#D5AC7C)",
      window: { l: 14, t: 12, w: 15, h: 22 },
      intro: { en: "This is the bedroom.", zh: "这是卧室。" },
      decor: [{ e: "🧸", x: 63, y: 82, fs: 2.3 }, { e: "🖼️", x: 87, y: 15, fs: 1.9 }],
      words: [
        { id: "bed", en: "bed", ipa: "/bed/", zh: "床", e: "🛏️", x: 24, y: 72, fs: 4.4,
          sentence: "This is a bed. I have got a bed in my bedroom.", sentenceZh: "这是一张床。我的卧室里有一张床。" },
        { id: "clock", en: "clock", ipa: "/klɒk/", zh: "时钟", e: "🕰️", x: 50, y: 18, fs: 2.9,
          sentence: "Look at the clock. Tick, tock!", sentenceZh: "看这个时钟。滴答，滴答！" },
        { id: "computer", en: "computer", ipa: "/kəmˈpjuːtə(r)/", zh: "电脑", e: "💻", x: 13, y: 46, fs: 2.8,
          sentence: "I have got a computer in my bedroom.", sentenceZh: "我的卧室里有一台电脑。" },
        { id: "lamp", en: "lamp", ipa: "/læmp/", zh: "台灯", e: "💡", x: 73, y: 37, fs: 3.0,
          sentence: "Turn on the lamp. It is bright!", sentenceZh: "打开台灯，真亮呀！" },
        { id: "mirror", en: "mirror", ipa: "/ˈmɪrə(r)/", zh: "镜子", e: "🪞", x: 88, y: 64, fs: 3.4,
          sentence: "Look in the mirror. Who is it?", sentenceZh: "照照镜子，这是谁呀？" }
      ]
    },
    bathroom: {
      id: "bathroom", zh: "浴室", en: "bathroom", emoji: "🛁",
      tile: "linear-gradient(180deg,#DCF2F4,#C4E8EC)",
      wall: "linear-gradient(180deg,#DCF2F4,#C4E8EC)",
      floor: "linear-gradient(180deg,#CFE7EA,#A8CCD2)",
      window: { l: 13, t: 11, w: 14, h: 21 },
      intro: { en: "This is the bathroom.", zh: "这是浴室。" },
      decor: [{ e: "🦆", x: 56, y: 84, fs: 2.1 }, { e: "🧺", x: 88, y: 80, fs: 2.2 }],
      words: [
        { id: "bathtub", en: "bath", ipa: "/bɑːθ/", zh: "浴缸 / 洗澡", e: "🛁", x: 28, y: 70, fs: 3.7,
          sentence: "I have a bath in the bathtub.", sentenceZh: "我在浴缸里洗澡。" },
        { id: "mirror", en: "mirror", ipa: "/ˈmɪrə(r)/", zh: "镜子", e: "🪞", x: 50, y: 24, fs: 2.9,
          sentence: "Look in the mirror. Who is it?", sentenceZh: "照照镜子，这是谁呀？" },
        { id: "toothbrush", en: "toothbrush", ipa: "/ˈtuːθbrʌʃ/", zh: "牙刷", e: "🪥", x: 81, y: 42, fs: 2.7,
          sentence: "Brush your teeth with a toothbrush.", sentenceZh: "用牙刷刷牙。" },
        { id: "soap", en: "soap", ipa: "/səʊp/", zh: "香皂", e: "🧼", x: 64, y: 66, fs: 2.3,
          sentence: "Wash your hands with soap.", sentenceZh: "用香皂洗洗手。" }
      ]
    },
    kitchen: {
      id: "kitchen", zh: "厨房", en: "kitchen", emoji: "🍳",
      tile: "linear-gradient(180deg,#FFF2D2,#FFE4AE)",
      wall: "linear-gradient(180deg,#FFF2D2,#FFE4AE)",
      floor: "linear-gradient(180deg,#E8C9A0,#D5AC7C)",
      window: { l: 74, t: 12, w: 14, h: 21 },
      intro: { en: "This is the kitchen.", zh: "这是厨房。" },
      decor: [{ e: "🍽️", x: 78, y: 78, fs: 2.2 }, { e: "🧊", x: 92, y: 48, fs: 2.2 }],
      words: [
        { id: "cupboard", en: "cupboard", ipa: "/ˈkʌbəd/", zh: "橱柜", html: ART("cupboard"), x: 86, y: 34, fs: 4.6,
          sentence: "The cups are in the cupboard.", sentenceZh: "杯子在橱柜里。" },
        { id: "pan", en: "pan", ipa: "/pæn/", zh: "平底锅", e: "🍳", x: 30, y: 50, fs: 3.2,
          sentence: "Eggs in the pan! Yummy!", sentenceZh: "锅里的鸡蛋，好香呀！" },
        { id: "pot", en: "pot", ipa: "/pɒt/", zh: "锅", e: "🍲", x: 58, y: 55, fs: 3.0,
          sentence: "The soup is in the pot.", sentenceZh: "汤在锅里。" },
        { id: "carrot", en: "carrot", ipa: "/ˈkærət/", zh: "胡萝卜", e: "🥕", x: 12, y: 42, fs: 2.5,
          sentence: "Carrots are good for you.", sentenceZh: "胡萝卜对身体好。" },
        { id: "apple", en: "apple", ipa: "/ˈæpl/", zh: "苹果", e: "🍎", x: 46, y: 77, fs: 2.4,
          sentence: "I have got a red apple.", sentenceZh: "我有一个红苹果。" }
      ]
    },
    living: {
      id: "living", zh: "客厅", en: "living room", emoji: "🛋️",
      tile: "linear-gradient(180deg,#FFE6DC,#FFD2C2)",
      wall: "linear-gradient(180deg,#FFE6DC,#FFD2C2)",
      floor: "linear-gradient(180deg,#E0B98F,#CFA173)",
      window: { l: 13, t: 12, w: 15, h: 22 },
      intro: { en: "This is the living room.", zh: "这是客厅。" },
      decor: [{ e: "🖼️", x: 87, y: 15, fs: 1.9 }, { e: "🧶", x: 88, y: 82, fs: 1.8 }],
      words: [
        { id: "sofa", en: "sofa", ipa: "/ˈsəʊfə/", zh: "沙发", e: "🛋️", x: 30, y: 70, fs: 4.0,
          sentence: "Sit on the sofa. It is soft.", sentenceZh: "坐在沙发上，软软的。" },
        { id: "tv", en: "TV", ipa: "/ˌtiː ˈviː/", zh: "电视", e: "📺", x: 68, y: 38, fs: 3.2,
          sentence: "I have got a TV in my living room.", sentenceZh: "我的客厅里有一台电视。" },
        { id: "clock", en: "clock", ipa: "/klɒk/", zh: "时钟", e: "🕰️", x: 50, y: 14, fs: 2.5,
          sentence: "Look at the clock. Tick, tock!", sentenceZh: "看这个时钟。滴答，滴答！" },
        { id: "lamp", en: "lamp", ipa: "/læmp/", zh: "台灯", e: "💡", x: 88, y: 56, fs: 2.8,
          sentence: "Turn on the lamp. It is bright!", sentenceZh: "打开台灯，真亮呀！" },
        { id: "plant", en: "plant", ipa: "/plɑːnt/", zh: "植物", e: "🪴", x: 10, y: 50, fs: 2.8,
          sentence: "The plant is green and happy.", sentenceZh: "这盆植物绿油油的，很精神。" }
      ]
    },
    garden: {
      id: "garden", zh: "花园", en: "garden", emoji: "🌳",
      tile: "linear-gradient(180deg,#E3F6E6,#BFE9C9)",
      wall: "linear-gradient(180deg,#CDEFFA,#EAF9FF)",
      floor: "linear-gradient(180deg,#BFE9C9,#9AD6AB)",
      window: null,
      intro: { en: "This is the garden.", zh: "这是花园。" },
      decor: [{ e: "☀️", x: 86, y: 12, fs: 2.6 }, { e: "☁️", x: 26, y: 10, fs: 2.2 }],
      words: [
        { id: "tree", en: "tree", ipa: "/triː/", zh: "树", e: "🌳", x: 16, y: 40, fs: 4.6,
          sentence: "The tree is big and green.", sentenceZh: "这棵树又大又绿。" },
        { id: "flowers", en: "flowers", ipa: "/ˈflaʊəz/", zh: "花", e: "🌷", x: 62, y: 70, fs: 2.9,
          sentence: "Look at the beautiful flowers!", sentenceZh: "看这些漂亮的花！" },
        { id: "butterfly", en: "butterfly", ipa: "/ˈbʌtəflaɪ/", zh: "蝴蝶", e: "🦋", x: 78, y: 34, fs: 2.7,
          sentence: "The butterfly can fly.", sentenceZh: "蝴蝶会飞。" },
        { id: "bird", en: "bird", ipa: "/bɜːd/", zh: "小鸟", e: "🐦", x: 45, y: 21, fs: 2.5,
          sentence: "The bird is singing.", sentenceZh: "小鸟在唱歌。" },
        { id: "pot", en: "pot", ipa: "/pɒt/", zh: "花盆", e: "🪴", x: 88, y: 64, fs: 2.6,
          sentence: "There is a plant in the pot.", sentenceZh: "花盆里有一株植物。" }
      ]
    }
  };

  /* ---------------- 文具 / 形状 / 自然拼读 ---------------- */
  var stationery = [
    { en: "pencil", plural: "pencils", ipa: "/ˈpensl/", zh: "铅笔", e: "✏️" },
    { en: "eraser", plural: "erasers", ipa: "/ɪˈreɪzə(r)/", zh: "橡皮", html: ART("eraser") },
    { en: "book", plural: "books", ipa: "/bʊk/", zh: "书", e: "📖" },
    { en: "crayon", plural: "crayons", ipa: "/ˈkreɪən/", zh: "蜡笔", e: "🖍️" },
    { en: "pen", plural: "pens", ipa: "/pen/", zh: "钢笔", e: "🖊️" },
    { en: "bag", plural: "bags", ipa: "/bæɡ/", zh: "书包", e: "🎒" }
  ];

  var shapes = [
    { type: "circle", en: "circle", ipa: "/ˈsɜːkl/", zh: "圆形" },
    { type: "square", en: "square", ipa: "/skweə(r)/", zh: "正方形" },
    { type: "rectangle", en: "rectangle", ipa: "/ˈrektæŋɡl/", zh: "长方形" },
    { type: "triangle", en: "triangle", ipa: "/ˈtraɪæŋɡl/", zh: "三角形" }
  ];

  var phonics = {
    B: [
      { word: "bird", zh: "小鸟", e: "🐦" },
      { word: "bus", zh: "公共汽车", e: "🚌" },
      { word: "book", zh: "书", e: "📖" },
      { word: "bed", zh: "床", e: "🛏️" }
    ],
    C: [
      { word: "cat", zh: "小猫", e: "🐱" },
      { word: "carrot", zh: "胡萝卜", e: "🥕" },
      { word: "crayon", zh: "蜡笔", e: "🖍️" },
      { word: "computer", zh: "电脑", e: "💻" }
    ]
  };

  var numbers = [
    { n: 1, en: "one", ipa: "/wʌn/" },
    { n: 2, en: "two", ipa: "/tuː/" },
    { n: 3, en: "three", ipa: "/θriː/" },
    { n: 4, en: "four", ipa: "/fɔː(r)/" },
    { n: 5, en: "five", ipa: "/faɪv/" }
  ];

  /* ---------------- 关卡（对应 Lesson 1-8 + 复习） ---------------- */
  var levels = [
    { id: 1, type: "room", room: "bedroom", title: "家具宝宝", sub: "Furniture in my bedroom", emoji: "🛏️",
      desc: "听一听、点一点，认识卧室里的家具新词", skill: "家具词汇" },
    { id: 2, type: "howmany", title: "我的书包", sub: "My bag · How many?", emoji: "🎒",
      desc: "数一数文具，说出 I have got four erasers.", skill: "数量与文具" },
    { id: 3, type: "guessroom", title: "房间大发现", sub: "Where is it?", emoji: "🏠",
      desc: "听描述，猜猜是哪个房间", skill: "房间词汇" },
    { id: 4, type: "yesno", title: "有还是没有", sub: "Yes, she has · No, she hasn't", emoji: "✅",
      desc: "Has she got a clock? 点 Yes 或 No", skill: "have / has got" },
    { id: 5, type: "story", story: "wishes", title: "三个愿望", sub: "The Three Wishes", emoji: "🐟",
      desc: "互动故事 + 故事小问答", skill: "故事理解" },
    { id: 6, type: "phonics", title: "B 还是 C？", sub: "Phonics B / C", emoji: "🔤",
      desc: "听单词，把图片送进 B 或 C 的房子", skill: "自然拼读" },
    { id: 7, type: "story", story: "frida", title: "弗丽达找家", sub: "Frida's Home", emoji: "🐦",
      desc: "互动故事 + Has she got…? 小问答", skill: "故事理解" },
    { id: 8, type: "shapes", title: "形状侦探", sub: "Shapes around us", emoji: "🔷",
      desc: "找一找圆形、正方形、长方形、三角形", skill: "形状" },
    { id: 9, type: "review", title: "复习总动员", sub: "Big Review", emoji: "🏆",
      desc: "把整个单元的单词和句子混在一起大挑战", skill: "综合复习" }
  ];

  /* ---------------- 游戏题库 ---------------- */
  var yesNoRounds = [
    { who: "Jenny", face: "👧", items: ["🕰️"], target: { e: "🕰️", en: "clock" }, answer: true,
      qEn: "Has Jenny got a clock?", qZh: "珍妮有时钟吗？",
      fullEn: "Yes, she has got a clock.", fullZh: "是的，她有一个时钟。" },
    { who: "Matt", face: "👦", items: ["💻", "📚"], target: { e: "💻", en: "computer" }, answer: true,
      qEn: "Has Matt got a computer?", qZh: "马特有一台电脑吗？",
      fullEn: "Yes, he has got a computer.", fullZh: "是的，他有一台电脑。" },
    { who: "Anna", face: "👩", items: ["🪞"], target: { e: "💡", en: "lamp" }, answer: false,
      qEn: "Has Anna got a lamp?", qZh: "安娜有一盏台灯吗？",
      fullEn: "No, she hasn't got a lamp.", fullZh: "没有，她没有台灯。" },
    { who: "Jim", face: "🧒", items: ["🖍️", "✏️"], target: { e: "🖍️", en: "crayons" }, answer: true,
      qEn: "Has Jim got crayons?", qZh: "吉姆有蜡笔吗？",
      fullEn: "Yes, he has got crayons.", fullZh: "是的，他有蜡笔。" },
    { who: "Jenny & Matt", face: "👧", face2: "👦", items: ["🎒", "📖"], target: { e: "🎒", en: "bag" }, answer: true,
      qEn: "Have they got a bag?", qZh: "他们有书包吗？",
      fullEn: "Yes, they have got a bag.", fullZh: "是的，他们有一个书包。" },
    { who: "Anna", face: "👩", items: ["🛏️", "💡"], target: { e: "🪞", en: "mirror" }, answer: false,
      qEn: "Has Anna got a mirror?", qZh: "安娜有一面镜子吗？",
      fullEn: "No, she hasn't got a mirror.", fullZh: "没有，她没有镜子。" },
    { who: "Matt", face: "👦", items: ["🪞", "🕰️"], target: { e: "💻", en: "computer" }, answer: false,
      qEn: "Has Matt got a computer?", qZh: "马特有一台电脑吗？",
      fullEn: "No, he hasn't got a computer.", fullZh: "没有，他没有电脑。" },
    { who: "Jim", face: "🧒", items: ["💻", "🖍️"], target: { e: "💻", en: "computer" }, answer: true,
      qEn: "Has Jim got a computer?", qZh: "吉姆有一台电脑吗？",
      fullEn: "Yes, he has got a computer.", fullZh: "是的，他有一台电脑。" }
  ];

  var howManyRounds = [
    { item: stationery[0], count: 3, numEn: "three", numZh: "三" },
    { item: stationery[1], count: 4, numEn: "four", numZh: "四" },
    { item: stationery[2], count: 2, numEn: "two", numZh: "二" },
    { item: stationery[3], count: 5, numEn: "five", numZh: "五" },
    { item: stationery[4], count: 1, numEn: "one", numZh: "一" }
  ];

  var guessRoomRounds = [
    { room: "bedroom", clues: [{ e: "🛏️", en: "a bed" }, { e: "💡", en: "a lamp" }],
      qEn: "I have got a bed and a lamp in it. Where is it?", qZh: "我有一张床和一盏台灯在里面。这是哪个房间？" },
    { room: "bathroom", clues: [{ e: "🛁", en: "a bath" }, { e: "🪥", en: "a toothbrush" }],
      qEn: "I have got a bath and a toothbrush in it. Where is it?", qZh: "我有一个浴缸和一把牙刷在里面。这是哪个房间？" },
    { room: "kitchen", clues: [{ e: "🍳", en: "a pan" }, { e: "🥕", en: "carrots" }],
      qEn: "I have got a pan and carrots in it. Where is it?", qZh: "我有一口平底锅和胡萝卜在里面。这是哪个房间？" },
    { room: "living", clues: [{ e: "🛋️", en: "a sofa" }, { e: "📺", en: "a TV" }],
      qEn: "I have got a sofa and a TV in it. Where is it?", qZh: "我有一个沙发和一台电视在里面。这是哪个房间？" },
    { room: "garden", clues: [{ e: "🌳", en: "a tree" }, { e: "🌷", en: "flowers" }],
      qEn: "I have got a tree and flowers in it. Where is it?", qZh: "我有一棵树和许多花在里面。这是哪个地方？" }
  ];

  /* ---------------- 装扮小屋奖励 ---------------- */
  var decorItems = [
    { id: "d1", e: "🛏️", en: "bed", zh: "小床", need: 2 },
    { id: "d2", e: "💡", en: "lamp", zh: "台灯", need: 4 },
    { id: "d3", e: "🕰️", en: "clock", zh: "时钟", need: 6 },
    { id: "d4", e: "🪞", en: "mirror", zh: "镜子", need: 9 },
    { id: "d5", e: "🧸", en: "teddy", zh: "泰迪熊", need: 12 },
    { id: "d6", e: "🪴", en: "plant", zh: "盆栽", need: 15 },
    { id: "d7", e: "🖼️", en: "picture", zh: "挂画", need: 18 },
    { id: "d8", e: "🛋️", en: "sofa", zh: "沙发", need: 21 },
    { id: "d9", e: "📺", en: "TV", zh: "电视", need: 24 },
    { id: "d10", e: "🐱", en: "cat", zh: "小猫", need: 27 },
    { id: "d11", e: "🐶", en: "dog", zh: "小狗", need: 30 },
    { id: "d12", e: "🦋", en: "butterfly", zh: "蝴蝶", need: 33 }
  ];

  /* ---------------- 老师 / 家长内容 ---------------- */
  var teacher = {
    objectives: [
      "听懂并能说出 5 个家具词：bed / clock / computer / lamp / mirror。",
      "听懂并能说出 5 个房间词：bedroom / bathroom / living room / kitchen / garden。",
      "用 What's this? — It's a bed. / Where is it? — It's in the bedroom. 进行问答。",
      "学习文具与数量：I have got four erasers. / How many pencils have you got?",
      "理解并会说 have got / has got 的肯定、否定与疑问：Have you got…? Yes, I have. / No, I haven't.",
      "听读故事《The Three Wishes》《Frida's Home》，理解故事大意与情感（知足、友谊、家）。",
      "感知自然拼读：B is for bird. C is for cat.，并认识单词首字母。",
      "认识 4 种形状：circle / square / rectangle / triangle。"
    ],
    vocabTables: [
      { title: "家具 Furniture（Lesson 1）", rows: [
        { en: "bed", ipa: "/bed/", zh: "床" }, { en: "clock", ipa: "/klɒk/", zh: "时钟" },
        { en: "computer", ipa: "/kəmˈpjuːtə(r)/", zh: "电脑" }, { en: "lamp", ipa: "/læmp/", zh: "台灯" },
        { en: "mirror", ipa: "/ˈmɪrə(r)/", zh: "镜子" } ] },
      { title: "房间 Rooms（Lesson 3）", rows: [
        { en: "bedroom", ipa: "/ˈbedruːm/", zh: "卧室" }, { en: "bathroom", ipa: "/ˈbɑːθruːm/", zh: "浴室" },
        { en: "living room", ipa: "/ˈlɪvɪŋ ruːm/", zh: "客厅" }, { en: "kitchen", ipa: "/ˈkɪtʃɪn/", zh: "厨房" },
        { en: "garden", ipa: "/ˈɡɑːdn/", zh: "花园" } ] },
      { title: "文具 Stationery（Lesson 2）", rows: [
        { en: "eraser", ipa: "/ɪˈreɪzə(r)/", zh: "橡皮" }, { en: "pencil", ipa: "/ˈpensl/", zh: "铅笔" },
        { en: "book", ipa: "/bʊk/", zh: "书" }, { en: "crayon", ipa: "/ˈkreɪən/", zh: "蜡笔" },
        { en: "pen", ipa: "/pen/", zh: "钢笔" }, { en: "bag", ipa: "/bæɡ/", zh: "书包" } ] },
      { title: "形状 Shapes（Lesson 8）", rows: [
        { en: "circle", ipa: "/ˈsɜːkl/", zh: "圆形" }, { en: "square", ipa: "/skweə(r)/", zh: "正方形" },
        { en: "rectangle", ipa: "/ˈrektæŋɡl/", zh: "长方形" }, { en: "triangle", ipa: "/ˈtraɪæŋɡl/", zh: "三角形" } ] },
      { title: "自然拼读 Phonics（Lesson 6 / 8）", rows: [
        { en: "bird · bus · book · bed · bag · boy · burger · beans", ipa: "B 音", zh: "首字母 B 的单词" },
        { en: "cat · carrot · crayon · computer · clock · cupboard · circle", ipa: "C 音", zh: "首字母 C 的单词" } ] }
    ],
    patterns: [
      { en: "What's this? — It's a bed.", zh: "这是什么？——这是一张床。" },
      { en: "Where is it? — It's in the bedroom.", zh: "它在哪里？——在卧室里。" },
      { en: "I have got four erasers.", zh: "我有四块橡皮。" },
      { en: "He has got a book. / She has got a clock.", zh: "他有一本书。/ 她有一个时钟。" },
      { en: "Have you got a pencil? — Yes, I have. / No, I haven't.", zh: "你有铅笔吗？——有。/ 没有。" },
      { en: "Has he got a computer? — Yes, he has. / No, he hasn't.", zh: "他有电脑吗？——有。/ 没有。" },
      { en: "They have got books. / They haven't got books.", zh: "他们有书。/ 他们没有书。" },
      { en: "What have you got in your bedroom?", zh: "你的卧室里有什么？" },
      { en: "There is a bed. / There are two lamps.", zh: "有一张床。/ 有两盏台灯。" },
      { en: "C is for cat.", zh: "C 代表 cat（小猫）。" }
    ],
    levelMap: [
      { lesson: "Lesson 1", app: "第 1 关 · 家具宝宝", target: "bed / clock / computer / lamp / mirror + What's this?" },
      { lesson: "Lesson 2", app: "第 2 关 · 我的书包", target: "文具 + How many…? + I have got…" },
      { lesson: "Lesson 3", app: "第 3 关 · 房间大发现", target: "5 个房间词 + Have you got…? + 描述房间" },
      { lesson: "Lesson 4", app: "第 4 关 · 有还是没有", target: "have got / has got 的肯否与 Yes/No 回答" },
      { lesson: "Lesson 5", app: "第 5 关 · 三个愿望", target: "故事理解 + There is/are + 情感态度（知足）" },
      { lesson: "Lesson 6", app: "第 6 关 · B 还是 C？", target: "B/C 首字母音 + cupboard / crayon / carrot / cat" },
      { lesson: "Lesson 7", app: "第 7 关 · 弗丽达找家", target: "Has she got…? + 家与友谊的故事理解" },
      { lesson: "Lesson 8", app: "第 8 关 · 形状侦探", target: "circle / square / rectangle / triangle + 单元复习" },
      { lesson: "复习", app: "第 9 关 · 复习总动员", target: "整个单元词汇、句型、拼读、形状混合复习" }
    ],
    plans: [
      { title: "方案 A｜10 分钟微课堂（大屏集体教学）", steps: [
        "① 热身 1 分钟：点击首页角色卡，全班一起说 Hello! 再唱一句 Hello song。",
        "② 呈现 3 分钟：进入「小屋 → 卧室」，逐个点家具，跟读单词；老师带读 What's this? — It's a bed.",
        "③ 练习 3 分钟：点「听音找物」，请 3-5 个孩子上台点一点，全班用 Yes! / No! 判断。",
        "④ 输出 2 分钟：回到闯关第 1 关，孩子说 I have got a bed in my bedroom. 教师即时给星星。",
        "⑤ 收尾 1 分钟：看星星总数，约定下节课解锁第 2 关。" ] },
      { title: "方案 B｜20 分钟小组活动（平板 / 学习角）", steps: [
        "① 分组：2-3 人一台设备，轮流操作，非操作的孩子当「小老师」检查发音。",
        "② 闯关：完成本课对应的关卡（每关 5 题，约 4 分钟）。",
        "③ 故事：第 5 / 7 课使用故事关卡，老师暂停提问：Is the fish happy? What do we learn?",
        "④ 装扮：用获得的星星解锁家具，装饰「我的小屋」，用英语介绍 I have got a bed.",
        "⑤ 回顾：老师面板「学习数据」查看全班正确率，针对薄弱词再玩一遍。" ] },
      { title: "家庭共学小贴士", steps: [
        "家长陪玩时先听孩子说，不急着纠音；每关结束一起点星星，说 Great job!",
        "把家里的真实物品指给孩子：Where is the lamp? 让孩子找出并说 It's here!",
        "每天 10 分钟即可，重复玩同一关是正常的复习，不必赶进度。",
        "点右上角 👩‍🏫 可以查看本单元知识清单，和老师保持同一套说法。" ] }
    ],
    differentiation: [
      { group: "中班（4-5 岁）", tips: [
        "目标以「听 + 指 + 说单词」为主，不要求完整句子。",
        "每次只玩 1 关，多听少读；用「听音找物」和「形状侦探」降低语言压力。",
        "允许用中文回答再跟读英文，重点是兴趣和语音输入。",
        "星星奖励要即时、夸张：Great! Wow! 你太棒了！" ] },
      { group: "大班（5-6 岁）", tips: [
        "鼓励输出完整句：It's a bed. / I have got four erasers. / She hasn't got a lamp.",
        "完成第 4 关后，可让孩子当小老师提问：Has she got a clock?",
        "故事关结束后，用中文复述 + 英文说关键词，为幼小衔接做准备。",
        "尝试自然拼读关卡，为 B/C 首字母音建立音形对应意识。" ] }
    ],
    about: [
      "本工具完全离线运行：双击 index.html 即可使用，不需要联网、不需要安装。",
      "推荐使用 Chrome / Edge / Safari 浏览器；大屏上课可按 ⌃⌘F（Mac）或 F11（Windows）全屏。",
      "语音由浏览器语音合成提供：英文发音取决于系统安装的英语语音。若没有声音，请在系统设置中安装英语（美国）语音包，或勾选「语音」开关。",
      "学习进度与星星保存在本机浏览器中（localStorage），换浏览器或清除缓存会重置，可在「学习数据」里手动清除。",
      "课堂建议：先用大屏集体过一遍词卡，再让孩子分组闯关；每关 5 题，约 3-5 分钟。"
    ]
  };

  /* ---------------- 汇总导出 ---------------- */
  var DATA = {
    version: 1,
    unit: {
      code: "PowerUp 0 · Unit 4",
      en: "At home",
      zh: "我的家",
      tagline: "和小伙伴一起，把英语搬进快乐小屋！"
    },
    characters: {
      matt: { name: "Matt", zh: "马特", face: "👦" },
      jenny: { name: "Jenny", zh: "珍妮", face: "👧" },
      anna: { name: "Anna", zh: "安娜", face: "👩" },
      jim: { name: "Jim", zh: "吉姆", face: "🧒" },
      cameron: { name: "Cameron", zh: "卡梅伦", face: "👨" },
      frida: { name: "Frida", zh: "弗丽达", face: "🐦" }
    },
    rooms: rooms,
    roomOrder: ["bedroom", "bathroom", "living", "kitchen", "garden"],
    stationery: stationery,
    shapes: shapes,
    phonics: phonics,
    numbers: numbers,
    levels: levels,
    yesNoRounds: yesNoRounds,
    howManyRounds: howManyRounds,
    guessRoomRounds: guessRoomRounds,
    decorItems: decorItems,
    teacher: teacher,
    freePlay: [
      { label: "卧室找找看", type: "room", room: "bedroom", emoji: "🛏️" },
      { label: "数一数文具", type: "howmany", emoji: "🎒" },
      { label: "有还是没有", type: "yesno", emoji: "✅" },
      { label: "B 还是 C", type: "phonics", emoji: "🔤" },
      { label: "形状侦探", type: "shapes", emoji: "🔷" },
      { label: "单词大搜索", type: "review", emoji: "🔎" }
    ]
  };

  U4.DATA = DATA;
})();
