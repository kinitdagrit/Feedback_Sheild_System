// ===== Supabase client =====
var sb = null;
try {
  if (window.supabase && SUPABASE_URL.indexOf("IMONG-") === -1) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    console.warn("Supabase wala pa na-set up. I-edit ang config.js.");
  }
} catch (e) {
  console.error("Supabase error:", e);
}

// ===== Checker (gikan sa Code.gs) =====
// Turns a word into a pattern that also catches stretched spelling.
// "fuck" matches "fuuuck", but "ass" will not match "as".
function buildPattern(word) {
  var body = word
    .split(" ")
    .map(function (part) {
      return part
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/([a-z0-9])\1*/g, function (run, ch) {
          return ch + "{" + run.length + ",}";
        });
    })
    .join("\\s+");
  return new RegExp("(^|\\s)" + body + "(?=\\s|$)", "i");
}

function checkComment(comment) {
  if (!comment || !comment.trim()) {
    return { status: "EMPTY", message: "Please enter a comment first.", detected: [] };
  }

  // Word lists live in words.js
  var allWords = ENGLISH_WORDS.concat(TAGALOG_WORDS, BISAYA_WORDS);

  // Normalize: lowercase, swap common symbol/number tricks (b1tch, sh1t, @ss)
  var normalized = comment
    .toLowerCase()
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Find matching words and phrases (no duplicates)
  var detected = allWords.filter(function (word, i) {
    return allWords.indexOf(word) === i && buildPattern(word).test(normalized);
  });

  if (detected.length > 0) {
    return {
      status: "WARNING",
      message: "Potentially harmful language detected. Please review your comment before posting.",
      detected: detected
    };
  }

  return {
    status: "SAFE",
    message: "No words from our current screening list were detected. Your comment passed the initial screening!",
    detected: []
  };
}

// ===== Pag-save sa Supabase =====
var userCode = null; // 01_user, 02_user, ...

function saveToDatabase(res, commentText) {
  if (!sb) { return Promise.reject(new Error("Supabase wala pa na-set up (config.js)")); }

  var getCode = userCode
    ? Promise.resolve(userCode)
    : sb.rpc("register_user", { p_name: userName }).then(function (r) {
        if (r.error) { throw r.error; }
        userCode = r.data;
        return userCode;
      });

  return getCode.then(function (code) {
    return sb.rpc("save_comment", {
      p_user_code: code,
      p_comment: commentText,
      p_result: res.status === "SAFE" ? "good" : "bad",
      p_detected: res.detected.join(", ")
    });
  }).then(function (r) {
    if (r.error) { throw r.error; }
    console.log("Saved as", userCode);
  });
}

// ===== UI =====
var SAMPLES = {
  good: "Salamat kaayo, maayo kaayo ang imong gibuhat.",
  positive: "Salamat sa imong paningkamot. Dako kaayo ning tabang sa tanan!",
  harmful: "Bugoka nimo uy, wala kay pulos."
};

var box = document.getElementById("comment");
var countEl = document.getElementById("count");
var nameBox = document.getElementById("userName");
var userName = "";

function startApp() {
  var n = nameBox.value.trim();
  if (!n) {
    document.getElementById("nameError").textContent = "Please type your name first.";
    nameBox.focus();
    return;
  }
  document.getElementById("nameError").textContent = "";
  if (n !== userName) { userCode = null; } // bag-ong name = bag-ong user
  userName = n;
  go(2);
}

nameBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") { startApp(); }
});

function go(n) {
  document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
  document.getElementById("s" + n).classList.add("active");
  window.scrollTo(0, 0);
  document.querySelector(".app").scrollTop = 0;
}

function setGauge(state, label, pct, color) {
  var s = document.getElementById("gaugeState");
  var f = document.getElementById("gaugeFill");
  s.textContent = label;
  s.style.color = color;
  f.style.width = pct + "%";
  f.style.background = color;
}

function clearResult() {
  var r = document.getElementById("result");
  r.className = "result";
  r.textContent = "";
  document.getElementById("actions").classList.add("hidden");
  document.getElementById("reviseButton").classList.add("hidden");
  document.getElementById("continueButton").classList.add("hidden");
  setGauge("ready", "Ready to scan", 0, "#2f5de0");
}

function useSample(key) {
  box.value = SAMPLES[key];
  countEl.textContent = box.value.length + " / 280";
  clearResult();
  box.focus();
}

box.addEventListener("input", function () {
  countEl.textContent = box.value.length + " / 280";
});

function showResult(cls, title, message, detected, note) {
  var r = document.getElementById("result");
  r.className = "result show " + cls;
  r.textContent = "";
  var h = document.createElement("h3"); h.textContent = title;
  var p = document.createElement("p"); p.textContent = message;
  r.appendChild(h); r.appendChild(p);
  if (detected && detected.length) {
    var d = document.createElement("div");
    d.className = "detected";
    d.textContent = "Detected terms: " + detected.join(", ");
    r.appendChild(d);
  }
  if (note) {
    var n = document.createElement("div");
    n.className = "note";
    n.textContent = note;
    r.appendChild(n);
  }
}

var lastStatus = "SAFE";

function checkMyComment() {
  var btn = document.getElementById("checkButton");
  btn.disabled = true;
  btn.textContent = "Checking...";
  setGauge("scan", "Scanning...", 60, "#2f5de0");

  var commentText = box.value;
  var res = checkComment(commentText);

  var done = res.status === "EMPTY"
    ? Promise.resolve(true)
    : saveToDatabase(res, commentText).then(function () { return true; }).catch(function (err) {
        console.error("Database:", err);
        return false;
      });

  done.then(function (saved) {
    btn.disabled = false;
    btn.textContent = "Check comment";

    var note = saved ? "" : "Wala ma-save sa database. Sulayi balik.";
    var actions = document.getElementById("actions");
    var revise = document.getElementById("reviseButton");
    var cont = document.getElementById("continueButton");
    actions.classList.remove("hidden");
    revise.classList.add("hidden");
    cont.classList.add("hidden");

    if (res.status === "SAFE") {
      lastStatus = "SAFE";
      showResult("safe", "Comment passed", res.message, null, note);
      setGauge("ok", "very good ka!", 100, "#1d9b57");
      cont.classList.remove("hidden");
    } else if (res.status === "WARNING") {
      lastStatus = "WARNING";
      showResult("warning", "Potentially harmful comment", res.message, res.detected, note);
      setGauge("warn", "baby your words po:(", 35, "#d0432d");
      revise.classList.remove("hidden");
      cont.classList.remove("hidden");
    } else {
      showResult("empty", "Please enter a comment", res.message);
      setGauge("ready", "Ready to scan", 0, "#2f5de0");
      actions.classList.add("hidden");
    }
  });
}

function finish() {
  var safe = lastStatus === "SAFE";
  document.getElementById("thanksLead").textContent = safe
    ? "Your words help build a kinder digital space."
    : "Thanks for trying. Kinder words make a safer space for everyone.";
  go(4);
}

function reviseComment() {
  clearResult();
  box.focus();
}

function testAnother() {
  box.value = "";
  countEl.textContent = "0 / 280";
  clearResult();
  go(3);
}

function resetAll() {
  box.value = "";
  countEl.textContent = "0 / 280";
  nameBox.value = "";
  userName = "";
  userCode = null;
  document.getElementById("nameError").textContent = "";
  clearResult();
  go(1);
}
