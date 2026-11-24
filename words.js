// ===== WORD LISTS =====
// Add new words here. One word or phrase per entry, all lowercase.
// app.js reads these lists automatically (no need to touch the checker).

const ENGLISH_WORDS = [
  // Profanity
  "arse", "arsehole", "ass", "asshole", "asshat", "asswipe", "bastard",
  "bitch", "bitches", "bloody", "bollocks", "bullshit", "bullshitter",
  "blowjob", "handjob", "cazzo", "cock", "cocksucker", "crap", "cum",
  "cumshot", "cunt", "cunts", "damn", "dammit", "dick", "dickhead", "dipshit",
  "dumbass", "dumbfuck", "douche", "douchebag", "fag", "faggot", "fuck",
  "fucker", "fuckers", "fucking", "fuckface", "fuckin", "fuckwit", "fuk",
  "fck", "hell", "horseshit", "jackass", "jackoff", "jerkoff", "motherfucker",
  "motherfucking", "mf", "nigga", "nigger", "piss", "pissed", "prick",
  "pussy", "retard", "retarded", "shit", "shite", "shity", "shitty",
  "shithead", "shitting", "skank", "slut", "slutty", "sonofabitch",
  "son of a bitch", "stfu", "tits", "tranny", "twat", "wanker", "whore",
  "wtf", "bellend", "dyke", "bimbo", "sex",

  // Insults
  "stupid", "idiot", "moron", "dumb", "loser", "ugly", "trash", "scum",
  "pervert", "psycho", "low standards", "fat pig", "piece of shit",
  "waste of space", "worthless", "eat shit", "suck my dick", "suck dick",
  "go to hell",

  // Threats / self-harm
  "kill yourself", "kill urself", "kys", "go die", "hang yourself",
  "kill you", "i will kill you", "i'll kill you",

  // Sexual / explicit
  "rape", "rapist", "porn", "nude", "nudes"
];

const TAGALOG_WORDS = [
  // Common insults
  "animal", "animal ka", "bastos", "bobo", "bobo ka", "bwisit", "bwiset",
  "bwesit", "buwisit", "buwiset", "demonyo", "engot", "gago", "gago ka",
  "gaga", "gaga ka", "gagong", "gunggong", "hayop", "hayop ka", "hinayupak",
  "hunghang", "inutil", "kupal", "qpal", "lapastangan", "mangmang",
  "palamunin", "patay gutom", "salot", "shunga", "siraulo", "sira ulo",
  "tanga", "tanga ka", "tarantado", "tarantado ka", "ulol", "ulol ka",
  "ungas", "abnoy", "baliw", "basura", "walang hiya", "walanghiya",
  "walang kwenta", "mukhang pera", "mukhang pwet", "mukha kang pwet",

  // Curses
  "leche", "leche ka", "litse", "lintik", "lintik ka", "pakshet", "pakshit",
  "pakyu", "pakingshet", "pesteng", "peste", "pisti", "puchang", "pucha",
  "putragis", "punyeta", "hindot", "tae",

  // Vulgar / sexual
  "bwakananginamo", "burat", "chupa", "jakol", "jakolero", "kantot",
  "kantutan", "kantotan", "pakantot", "kalandi", "malibog", "pekpek", "pepe",
  "pokpok", "puki", "pukingina", "puking ina", "puking ina mo", "puta",
  "puta ka", "putang ina", "putangina", "putang ina mo", "putangina mo",
  "putang ina nyo", "salsal", "tamod", "tangina", "tang ina", "tangina mo",
  "tang ina mo", "tangina nyo", "tite", "titi", "kingina", "kumikinanginamo",

  // Slurs
  "bakla ka", "lesbo",

  // Threats / self-harm
  "patayin kita", "magpakamatay ka", "mamatay ka na", "mamatay na lang ka"
];

const BISAYA_WORDS = [
  // Common insults
  "ahak", "amaw", "animal", "atay", "giatay", "ginatay", "atay ka", "boang",
  "boang ka", "boanga", "bogo", "bugo", "bugok", "bugoka", "bugo ka", "buang",
  "buang ka", "buanga", "gago", "gaga", "hangak", "hayop", "hayup",
  "hinayupak", "hudas", "tanga", "tarantado", "ulol", "ungas", "demonyo",
  "uwagan", "sira ulo", "walay utok", "wala kay utok", "kulang sa utok",
  "iro ka", "baboy ka", "unggoy ka", "baho", "tae", "tae ka", "tae nimo",
  "tira", "tira ka", "tira mo", "tira sila", "tira ta", "tira nato",
  "bungol", "lumpoy", "yati", "yatis", "tabian", "bulok", "ulaga", "ulag",
  "gaba", "hitad", "pisot", "pisot ka", "sirok", "igit", "tubol", "bulbol",
  "banga", "inutil", "mangmang", "palamunin", "lagot", "pakaskas",
  "badingg", "tadoo", "tarantadoo", "bunakid", "esmeringhoy", "bisakol",

  // Curses
  "yawa", "yawa ka", "yawaa", "pisti", "piste", "pesti", "pisting",
  "pisting yawa", "pesteng yawa", "peste ka", "piskot", "boyset", "bwisit",
  "lintik", "kamatay", "borikat", "pakyu", "pakshet", "hindot",

  // Vulgar / sexual
  "bilat", "bilat ka", "bilatan", "bilatsimongina", "bilat sa imong ina",
  "bilat sa imong inahan", "bilat sa imong nanay", "iyot", "iyot ka",
  "iyutan", "iyoton", "kayat", "kayata", "kayasa", "kinayat", "otin",
  "otin ka", "utin", "uten", "uten ka", "puki", "pukinangina", "pukingina",
  "puta", "putang ina", "putangina", "tangina", "kingina", "kupal", "burat",
  "bayag", "betlog", "tite", "titi", "etits", "libog", "libogera", "sex",

  // Slurs
  "bayot", "bisong",

  // Threats / self-harm
  "mamatay ka", "mamatay na ka", "patyon ta ka", "patyon tika", "ipatay",
  "kamatay ka"
];
