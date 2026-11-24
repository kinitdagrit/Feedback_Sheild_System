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

  function showResult(cls, title, message, detected) {
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
  }

  function checkMyComment() {
    var btn = document.getElementById("checkButton");
    btn.disabled = true;
    btn.textContent = "Checking...";
    setGauge("scan", "Scanning...", 60, "#2f5de0");

    var data = new FormData();
    data.append("comment", box.value);
    data.append("name", userName);

    fetch("check.php", { method: "POST", body: data })
      .then(function (r) {
        if (!r.ok) { throw new Error("Server error " + r.status); }
        return r.json();
      })
      .then(function (res) {
        if (res.db_error) { console.warn("Database:", res.db_error); }
        if (res.saved) { console.log("Saved as", res.user_code); }

        btn.disabled = false;
        btn.textContent = "Check comment";

        var actions = document.getElementById("actions");
        var revise = document.getElementById("reviseButton");
        var cont = document.getElementById("continueButton");
        actions.classList.remove("hidden");
        revise.classList.add("hidden");
        cont.classList.add("hidden");

        if (res.status === "SAFE") {
          lastStatus = "SAFE";
          showResult("safe", "Comment passed", res.message);
          setGauge("ok", "very good ka!", 100, "#1d9b57");
          cont.classList.remove("hidden");
        } else if (res.status === "WARNING") {
          showResult("warning", "Potentially harmful comment", res.message, res.detected);
          lastStatus = "WARNING";
          setGauge("warn", "baby your words po:(", 35, "#d0432d");
          revise.classList.remove("hidden");
          cont.classList.remove("hidden");
        } else {
          showResult("empty", "Please enter a comment", res.message);
          setGauge("ready", "Ready to scan", 0, "#2f5de0");
          actions.classList.add("hidden");
        }
      })
      .catch(function (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = "Check comment";
        showResult("warning", "Something went wrong", "Please try again.");
        setGauge("ready", "Ready to scan", 0, "#2f5de0");
      });
  }

  var lastStatus = "SAFE";

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
    document.getElementById("nameError").textContent = "";
    clearResult();
    go(1);
  }
