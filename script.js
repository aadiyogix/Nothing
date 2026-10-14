(function () {
  "use strict";

  var UPI_LINK = "upi://pay?pa=Q047072015%40ybl&cu=INR";
  var STORAGE_KEY = "upi_redirect_done";

  var hint = document.getElementById("hint");
  var title = document.getElementById("title");
  var payBtn = document.getElementById("payBtn");

  var storage = null;
  try {
    storage = window.sessionStorage;
    storage.setItem("__t", "1");
    storage.removeItem("__t");
  } catch (e) {
    storage = null;
  }

  function isSecureStorageAvailable() {
    return storage !== null;
  }

  function wasRedirected() {
    return isSecureStorageAvailable() && storage.getItem(STORAGE_KEY) === "1";
  }

  function markRedirected() {
    if (isSecureStorageAvailable()) {
      storage.setItem(STORAGE_KEY, "1");
    }
  }

  function launchViaIframe() {
    try {
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);
      iframe.src = UPI_LINK;
      window.setTimeout(function () {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2500);
    } catch (e) {
      /* ignore: fall back to location.href below */
    }
  }

  function openUpi() {
    markRedirected();
    launchViaIframe();
    window.location.href = UPI_LINK;
  }

  function showSpinner() {
    hint.classList.add("spinner");
    hint.textContent = "";
  }

  function showHint(text) {
    hint.classList.remove("spinner");
    hint.textContent = text;
  }

  payBtn.addEventListener("click", function () {
    openUpi();
  });

  if (wasRedirected()) {
    title.textContent = "Open your UPI app";
    showHint("Tap the button above to open your UPI app.");
    return;
  }

  showSpinner();
  window.setTimeout(function () {
    showHint("If nothing happens, tap the button above.");
    openUpi();
  }, 700);
})();
