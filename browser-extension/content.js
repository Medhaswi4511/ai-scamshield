chrome.runtime.onMessage.addListener(
  (message) => {

    if (message.type === "SHOW_WARNING") {

      const warning = document.createElement("div");

      warning.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          background: #ef4444;
          color: white;
          padding: 20px;
          border-radius: 12px;
          width: 320px;
          box-shadow: 0 0 20px rgba(0,0,0,0.4);
          font-family: Arial;
        ">

          <h2>
            ⚠️ AI ScamShield Warning
          </h2>

          <p>
            Potential phishing website detected.
          </p>

          <p>
            This site may attempt to steal personal information.
          </p>

        </div>
      `;

      document.body.appendChild(warning);

      setTimeout(() => {
        warning.remove();
      }, 5000);
    }
  }
);