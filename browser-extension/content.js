chrome.runtime.onMessage.addListener(
  (message) => {

    if (
      message.type === "SHOW_WARNING"
    ) {

      // Prevent duplicates
      if (
        document.getElementById(
          "ai-scamshield-warning"
        )
      ) {
        return;
      }

      const warning =
        document.createElement("div");

      warning.id =
        "ai-scamshield-warning";

      warning.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          background: #ef4444;
          color: white;
          padding: 18px 24px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 0 20px rgba(239,68,68,0.6);
          font-family: Arial;
        ">
          ⚠️ AI ScamShield Warning<br/>
          Suspicious website detected!
        </div>
      `;

      document.body.appendChild(
        warning
      );

      setTimeout(() => {

        warning.remove();

      }, 5000);
    }
  }
);