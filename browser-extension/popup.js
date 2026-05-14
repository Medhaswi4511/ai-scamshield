async function scanCurrentTab() {

  const [tab] =
    await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

  const url = tab.url;

  document.getElementById(
    "urlInput"
  ).value = url;

  const resultDiv =
    document.getElementById(
      "result"
    );

  resultDiv.innerHTML =
    "Scanning...";

  try {

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
            url: url,
          }),
        }
      );

    const data =
      await response.json();

    console.log(data);

    // DANGEROUS WEBSITE
    if (
      data.risk_score >= 30
    ) {

      resultDiv.innerHTML = `
        <div style="
          color:#f87171;
          margin-top:10px;
          font-weight:bold;
          font-size:18px;
        ">
          ⚠️ Dangerous Website<br/><br/>
          Risk Score: ${data.risk_score}%
        </div>
      `;

    } else {

      resultDiv.innerHTML = `
        <div style="
          color:#4ade80;
          margin-top:10px;
          font-weight:bold;
          font-size:18px;
        ">
          ✅ Website Looks Safe
        </div>
      `;
    }

  } catch (error) {

    console.log(error);

    resultDiv.innerHTML = `
      <div style="
        color:red;
        margin-top:10px;
      ">
        Backend connection failed
      </div>
    `;
  }
}


// AUTO SCAN CURRENT TAB
scanCurrentTab();