(function () {
  var CF_LINK = "https://wa.link/whatsappcamilarosas";
  var CF_LINK_PLATICAR = "https://wa.link/kbg1we";
  var sinBoton = ["videollamadas", "servicios"];
  var current = "menu";
  var busy = false;
  var timers = [];

  var statusEl = null;
  var backBtn = null;
  var waBtn = null;
  var footerEl = null;

  function $(id) {
    return document.getElementById(id);
  }

  function clearTimers() {
    timers.forEach(function (t) {
      clearTimeout(t);
    });
    timers = [];
  }

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function getTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function addTime(bubble) {
    if (!bubble || bubble.querySelector(".cf-time")) return;
    var t = document.createElement("span");
    t.className = "cf-time";
    t.textContent = getTime();
    bubble.appendChild(t);
  }

  function setOnline() {
    if (!statusEl) return;
    statusEl.className = "cf-status cf-online";
    statusEl.textContent = "en línea";
  }

  function setWriting() {
    if (!statusEl) return;
    statusEl.className = "cf-status cf-writing";
    statusEl.textContent = "escribiendo...";
  }

  function reserveFooter(screen) {
    footerEl.classList.add("cf-open");
    if (sinBoton.indexOf(screen) !== -1) {
      footerEl.classList.remove("cf-with-wa");
    } else {
      footerEl.classList.add("cf-with-wa");
    }
    backBtn.classList.remove("cf-show");
    waBtn.classList.remove("cf-show");
    waBtn.onclick = null;
  }

  function collapseFooter() {
    footerEl.classList.remove("cf-open", "cf-with-wa");
    backBtn.classList.remove("cf-show");
    waBtn.classList.remove("cf-show");
    waBtn.onclick = null;
  }

  function showFooter(screen) {
    footerEl.classList.add("cf-open");
    backBtn.classList.add("cf-show");

    if (sinBoton.indexOf(screen) !== -1) {
      footerEl.classList.remove("cf-with-wa");
      waBtn.classList.remove("cf-show");
      waBtn.onclick = null;
      return;
    }

    footerEl.classList.add("cf-with-wa");
    waBtn.innerHTML =
      screen === "platicar"
        ? '<img src="assets/wa-icon.webp" alt="WA" width="30" height="30"><span><strong>Enviar Mensaje</strong></span>'
        : '<img src="assets/wa-icon.webp" alt="WA" width="30" height="30"><span><strong>Escríbeme por WhatsApp</strong><br><span style="font-weight:normal;font-size:11px;">para ver por cuál te decidiste papi 🤤💞</span></span>';
    waBtn.onclick = function () {
      window.open(screen === "platicar" ? CF_LINK_PLATICAR : CF_LINK, "_blank");
    };

    later(function () {
      waBtn.classList.add("cf-show");
    }, 120);
  }

  function scrollToBottom(screenEl, smooth) {
    requestAnimationFrame(function () {
      if (smooth && typeof screenEl.scrollTo === "function") {
        try {
          screenEl.scrollTo({ top: screenEl.scrollHeight, behavior: "smooth" });
          return;
        } catch (e) {}
      }
      screenEl.scrollTop = screenEl.scrollHeight;
    });
  }

  function resetScreen(screenEl) {
    var userMsg = screenEl.querySelector(".cf-user-msg");
    if (userMsg) {
      userMsg.classList.remove("cf-visible", "cf-typing-cursor");
      userMsg.textContent = "";
      var oldTime = userMsg.querySelector(".cf-time");
      if (oldTime) oldTime.remove();
    }

    var typing = screenEl.querySelector(".cf-typing");
    if (typing) typing.classList.remove("cf-show");

    screenEl.querySelectorAll(".cf-step").forEach(function (step) {
      step.classList.remove("cf-show");
      step.querySelectorAll(".cf-bubble").forEach(function (b) {
        var tm = b.querySelector(".cf-time");
        if (tm) tm.remove();
      });
    });
  }

  function typeText(el, text, speed, done) {
    el.textContent = "";
    el.classList.add("cf-visible", "cf-typing-cursor");
    var i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        later(tick, speed);
      } else {
        el.classList.remove("cf-typing-cursor");
        addTime(el);
        if (done) done();
      }
    }

    tick();
  }

  function revealSteps(screenEl, steps, index, onDone) {
    if (index >= steps.length) {
      if (onDone) onDone();
      return;
    }

    var step = steps[index];
    step.classList.add("cf-show");
    step.querySelectorAll(".cf-bubble").forEach(addTime);
    scrollToBottom(screenEl, true);

    var isMedia = !!step.querySelector(".cf-media-box");
    var delay = isMedia ? 1100 : 1300;

    later(function () {
      revealSteps(screenEl, steps, index + 1, onDone);
    }, delay);
  }

  function runFlow(screen) {
    var screenEl = $("cf-screen-" + screen);
    if (!screenEl) return;

    busy = true;
    reserveFooter(screen);
    setOnline();

    var userMsg = screenEl.querySelector(".cf-user-msg");
    var typing = screenEl.querySelector(".cf-typing");
    var steps = Array.prototype.slice.call(screenEl.querySelectorAll(".cf-step"));
    var text = userMsg ? userMsg.getAttribute("data-text") || "" : "";

    // 1) Tipear mensaje del usuario (más pausado)
    typeText(userMsg, text, 48, function () {
      scrollToBottom(screenEl, true);

      // 2) Pausa, luego "escribiendo..."
      later(function () {
        setWriting();
        if (typing) typing.classList.add("cf-show");
        scrollToBottom(screenEl, true);

        // 3) Mantener escribiendo un rato, luego respuestas
        later(function () {
          if (typing) typing.classList.remove("cf-show");

          later(function () {
            setOnline();
            revealSteps(screenEl, steps, 0, function () {
              later(function () {
                showFooter(screen);
                scrollToBottom(screenEl, true);
                busy = false;
              }, 400);
            });
          }, 280);
        }, 1900);
      }, 700);
    });
  }

  window.cfGo = function (screen) {
    if (busy && current !== "menu") return;

    clearTimers();
    busy = false;

    var prev = $("cf-screen-" + current);
    if (prev) {
      prev.classList.remove("cf-active");
      if (current !== "menu") resetScreen(prev);
    }

    var next = $("cf-screen-" + screen);
    if (!next) return;

    next.classList.add("cf-active");
    current = screen;
    resetScreen(next);
    reserveFooter(screen);
    setOnline();
    next.scrollTop = 0;

    runFlow(screen);
  };

  window.cfBack = function () {
    clearTimers();
    busy = false;

    var prev = $("cf-screen-" + current);
    if (prev) {
      prev.classList.remove("cf-active");
      resetScreen(prev);
    }

    $("cf-screen-menu").classList.add("cf-active");
    current = "menu";
    collapseFooter();
    setOnline();
  };

  document.addEventListener("DOMContentLoaded", function () {
    statusEl = $("cf-status");
    backBtn = $("cf-back-btn");
    waBtn = $("cf-wa-btn");
    footerEl = $("cf-footer");

    setOnline();

    backBtn.addEventListener("click", function () {
      window.cfBack();
    });

    document.querySelectorAll(".cf-option-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var go = btn.getAttribute("data-go");
        if (go) window.cfGo(go);
      });
    });

    var menuBubble = document.querySelector("#cf-screen-menu .cf-bubble");
    if (menuBubble) addTime(menuBubble);
  });
})();
