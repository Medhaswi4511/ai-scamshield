async function showPopup(
  tabId,
  score,
  dangerous,
  failedPage = false
) {

  try {

    await chrome.scripting.executeScript({
      target: { tabId },

      args: [
        score,
        dangerous,
        failedPage
      ],

      func: (
        riskScore,
        isDangerous,
        failed
      ) => {

        // REMOVE OLD POPUP
        const old =
          document.getElementById(
            "ai-scamshield-popup"
          );

        if (old) {
          old.remove();
        }

        const popup =
          document.createElement(
            "div"
          );

        popup.id =
          "ai-scamshield-popup";

        // COLORS
        const bgColor =
          failed
            ? "linear-gradient(135deg,#7f1d1d,#dc2626)"
            : isDangerous
            ? "linear-gradient(135deg,#dc2626,#ef4444)"
            : "linear-gradient(135deg,#16a34a,#22c55e)";

        // TITLES
        const title =
          failed
            ? "🚨 WEBSITE FAILED TO LOAD"
            : isDangerous
            ? "⚠️ DANGEROUS WEBSITE"
            : "✅ SAFE WEBSITE";

        // MESSAGE
        const message =
          failed
            ? "This website could not load properly. Such websites are often unsafe or phishing attempts. Better avoid opening it."
            : isDangerous
            ? "Suspicious phishing indicators detected."
            : "No major phishing indicators detected.";

        popup.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            z-index: 999999999;
            background: ${bgColor};
            color: white;
            padding: 24px;
            border-radius: 20px;
            font-family: Arial;
            border: 4px solid white;
            box-shadow: 0 0 40px rgba(0,0,0,0.4);
          ">

            <div style="
              font-size: 26px;
              font-weight: bold;
              margin-bottom: 12px;
            ">
              ${title}
            </div>

            <div style="
              font-size: 16px;
              margin-bottom: 12px;
              line-height: 1.5;
            ">
              ${message}
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

        // REMOVE AFTER 7 SEC
        setTimeout(() => {

          popup.remove();

        }, 7000);
      },
    });

  } catch (e) {

    console.log(
      "Popup injection failed"
    );
  }
}


async function scanURL(
  tabId,
  url
) {

  try {

    // SKIP CHROME PAGES
    if (
      !url ||
      url.startsWith("chrome://") ||
      url.startsWith("edge://")
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

    console.log(data);

    const dangerous =
      data.risk_score >= 30;

    // BADGE
    chrome.action.setBadgeText({
      text: dangerous ? "!" : "✓",
      tabId,
    });

    chrome.action.setBadgeBackgroundColor({
      color: dangerous
        ? "#ef4444"
        : "#22c55e",

      tabId,
    });

    // ALWAYS SHOW NOTIFICATION
    chrome.notifications.create({
      type: "basic",

      iconUrl: "icon.png",

      title: dangerous
        ? "⚠️ Dangerous Website"
        : "✅ Safe Website",

      message:
        `Risk Score: ${data.risk_score}%`,
    });

    // SHOW PAGE POPUP
    await showPopup(
      tabId,
      data.risk_score,
      dangerous,
      false
    );

  } catch (err) {

    console.log(
      "Website failed to load"
    );

    // FAILED WEBSITE WARNING
    chrome.notifications.create({
      type: "basic",

      iconUrl: "icon.png",

      title:
        "🚨 Website Failed to Load",

      message:
        "This website may be unsafe or suspicious. Better avoid opening it.",
    });

    // RED BADGE
    chrome.action.setBadgeText({
      text: "!",
      tabId,
    });

    chrome.action.setBadgeBackgroundColor({
      color: "#dc2626",
      tabId,
    });

    // SHOW FAILED PAGE POPUP
    await showPopup(
      tabId,
      90,
      true,
      true
    );
  }
}


// AUTO SCAN ALL TABS
chrome.tabs.onUpdated.addListener(
  (
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status ===
      "complete" &&
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