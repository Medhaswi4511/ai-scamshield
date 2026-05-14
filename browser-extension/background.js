async function scanURL(tabId, url) {

  try {

    // SKIP CHROME PAGES
    if (
      url.startsWith("chrome://") ||
      url.startsWith("edge://") ||
      url.startsWith("about:")
    ) {
      return;
    }

    const response = await fetch(
      "https://ai-scamshield-production.up.railway.app/detect-url",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url: url,
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "Scan Result:",
      data
    );

    // DANGEROUS WEBSITE
    if (data.risk_score >= 30) {

      // RED BADGE
      chrome.action.setBadgeText({
        text: "!",
        tabId: tabId,
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#ef4444",
        tabId: tabId,
      });

      // BIG PAGE POPUP
      chrome.scripting.executeScript({
        target: {
          tabId: tabId,
        },

        world: "MAIN",

        args: [data.risk_score],

        func: (score) => {

          // REMOVE OLD POPUP
          const oldPopup =
            document.getElementById(
              "ai-scamshield-danger-popup"
            );

          if (oldPopup) {
            oldPopup.remove();
          }

          // CREATE POPUP
          const popup =
            document.createElement(
              "div"
            );

          popup.id =
            "ai-scamshield-danger-popup";

          popup.innerHTML = `
            <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 999999999;
              width: 380px;
              background: linear-gradient(
                135deg,
                #dc2626,
                #ef4444
              );
              color: white;
              padding: 24px;
              border-radius: 20px;
              box-shadow: 0 0 40px rgba(239,68,68,0.9);
              font-family: Arial;
              border: 4px solid white;
              animation: shake 0.4s infinite alternate;
            ">
              <div style="
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
              ">
                ⚠️ WARNING
              </div>

              <div style="
                font-size: 20px;
                margin-bottom: 10px;
              ">
                Dangerous Website Detected
              </div>

              <div style="
                font-size: 18px;
                font-weight: bold;
              ">
                Risk Score: ${score}%
              </div>
            </div>
          `;

          document.body.appendChild(
            popup
          );

          // AUTO REMOVE
          setTimeout(() => {

            popup.remove();

          }, 8000);
        },
      });

    } else {

      // SAFE WEBSITE
      chrome.action.setBadgeText({
        text: "",
        tabId: tabId,
      });
    }

  } catch (error) {

    console.log(
      "Scan Failed:",
      error
    );
  }
}


// AUTO SCAN
chrome.tabs.onUpdated.addListener(
  (
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status === "complete" &&
      tab.url
    ) {

      setTimeout(() => {

        scanURL(
          tabId,
          tab.url
        );

      }, 2000);
    }
  }
);