chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {

    if (
      changeInfo.status === "complete" &&
      tab.url
    ) {

      try {

        const response = await fetch(
          "https://ai-scamshield-backend.onrender.com",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              url: tab.url,
            }),
          }
        );

        const data = await response.json();

        if (data.is_phishing) {

          chrome.action.setBadgeText({
            text: "!",
            tabId: tabId,
          });

          chrome.action.setBadgeBackgroundColor({
            color: "#ef4444",
            tabId: tabId,
          });

          chrome.tabs.sendMessage(
            tabId,
            {
              type: "SHOW_WARNING",
            }
          );

        } else {

          chrome.action.setBadgeText({
            text: "",
            tabId: tabId,
          });
        }

      } catch (error) {

        console.log(
          "Backend connection failed"
        );
      }
    }
  }
);