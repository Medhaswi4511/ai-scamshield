async function scanURL(tabId, url) {

  try {

    const response = await fetch(
      "https://ai-scamshield-backend.onrender.com/detect-url",
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

    console.log(data);

    // Trigger popup for ANY score >=30
    if (data.risk_score >= 30) {

      chrome.action.setBadgeText({
        text: "!",
        tabId: tabId,
      });

      chrome.action.setBadgeBackgroundColor({
        color: "#ef4444",
        tabId: tabId,
      });

      chrome.scripting.executeScript({
        target: {
          tabId: tabId,
        },

        args: [data.risk_score],

        func: (score) => {

          if (
            document.getElementById(
              "ai-scamshield-popup"
            )
          ) {
            return;
          }

          const popup =
            document.createElement(
              "div"
            );

          popup.id =
            "ai-scamshield-popup";

          popup.innerHTML = `
            <div style="
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 999999;
              background: #ef4444;
              color: white;
              padding: 20px 28px;
              border-radius: 16px;
              font-size: 18px;
              font-weight: bold;
              box-shadow: 0 0 25px rgba(239,68,68,0.7);
              font-family: Arial;
            ">
              ⚠️ AI ScamShield Warning<br/>
              Risk Score: ${score}%
            </div>
          `;

          document.body.appendChild(
            popup
          );

          setTimeout(() => {

            popup.remove();

          }, 6000);
        },
      });

    } else {

      chrome.action.setBadgeText({
        text: "",
        tabId: tabId,
      });
    }

  } catch (error) {

    console.log(error);
  }
}


chrome.tabs.onUpdated.addListener(
  async (
    tabId,
    changeInfo,
    tab
  ) => {

    if (
      changeInfo.status === "complete" &&
      tab.url
    ) {

      // Retry after delay
      setTimeout(() => {

        scanURL(
          tabId,
          tab.url
        );

      }, 3000);
    }
  }
);