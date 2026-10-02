(function() {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function() {
        return fallbackCopyText(text);
      });
    }

    return fallbackCopyText(text);
  }

  function fallbackCopyText(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    var copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    return copied ? Promise.resolve() : Promise.reject(new Error("Copy failed"));
  }

  document.querySelectorAll(".archive .problem-card figure.highlight").forEach(function(codeBlock) {
    var button = document.createElement("button");
    button.className = "copy-code-button";
    button.type = "button";
    button.setAttribute("aria-label", "Copy Python code");
    button.setAttribute("title", "Copy code");
    button.textContent = "Copy";

    button.addEventListener("click", function() {
      var code = codeBlock.querySelector("pre").textContent;

      copyText(code).then(function() {
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Code copied");
        button.setAttribute("title", "Copied");
        button.textContent = "Copied";
        window.setTimeout(function() {
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", "Copy Python code");
          button.setAttribute("title", "Copy code");
          button.textContent = "Copy";
        }, 1600);
      }).catch(function() {
        button.setAttribute("aria-label", "Unable to copy code");
        button.setAttribute("title", "Unable to copy");
      });
    });

    codeBlock.appendChild(button);
  });
})();