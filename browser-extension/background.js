async function showDangerPopup(tabId, score) {

  try {

    await chrome.scripting.executeScript({
      target: { tabId },

      func: (riskScore) => {

        // REMOVE OLD POPUP
        const old =
          document.getElementById(
            "ai-scamshield-warning"
          );

        if (old) {
          old.remove();
        }

        // CREATE POPUP
        const popup =
          document.createElement("div");

        popup.id =
          "ai-scamshield-warning";

        popup.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            z-index: 999999999;
            background: linear-gradient(
              135deg,
              #dc2626,
              #ef4444
            );
            color: white;
            padding: 24px;
            border-radius: 20px;
            font-family: Arial;
            border: 4px solid white;
            box-shadow: 0 0 40px rgba(239,68,68,0.9);
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
              Risk Score: ${riskScore}%
            </div>
          </div>
        `;

        document.body.appendChild(
          popup
        );

        // REMOVE AFTER 8 SEC
        setTimeout(() => {

          popup.remove();

        }, 8000);
      },

      args: [score],
    });

  } catch (err) {

    console.log(
      "Popup injection failed",
      err
    );
  }
}


async function scanURL(tabId, url) {

  try {

    // SKIP INVALID PAGES
    if (
      !url ||
      url.startsWith("chrome://") ||
      url.startsWith("edge://") ||
      url.startsWith("about:")
    ) {
      return;
    }

    const response =
      await fetch(
        "https://ai-scamshield-production.up.railway.app/detect-url",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            url,
          }),
        }
      );

    const data =
      await response.json();

    console.log(
      "AUTO SCAN:",
      data
    );

    if (
      data.risk_score >= 30
    ) {

      // RED BADGE
      chrome.action.setBadgeText({
        text: "!",
        tabId,
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#ef4444",
        tabId,
      });

      // SAFE POPUP CALL
      try {

        await showDangerPopup(
          tabId,
          data.risk_score
        );

      } catch (e) {

        console.log(
          "Tab changed before popup"
        );
      }

    } else {

      // SAFE WEBSITE
      chrome.action.setBadgeText({
        text: "",
        tabId,
      });
    }

  } catch (err) {

    console.log(
      "Auto scan failed",
      err
    );
  }
}


// AUTO SCAN WHEN TAB LOADS
chrome.tabs.onUpdated.addListener(
  async (
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status ===
      "complete" &&
      tab.url
    ) {

      try {

        // WAIT FOR PAGE LOAD
        setTimeout(() => {

          scanURL(
            tabId,
            tab.url
          );

        }, 3000);

      } catch (e) {

        console.log(
          "Tab update skipped"
        );
      }
    }
  }
);