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

      // BIG POPUP ALERT
      document.body.innerHTML += `
        <div id="danger-popup" style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999999;
          width: 320px;
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
            Risk Score: ${data.risk_score}%
          </div>

        </div>
      `;

      resultDiv.innerHTML = `
        <div style="
          color:#f87171;
          margin-top:10px;
          font-weight:bold;
          font-size:16px;
        ">
          ⚠️ Dangerous Website<br/>
          Risk Score: ${data.risk_score}%
        </div>
      `;

    } else {

      resultDiv.innerHTML = `
        <div style="
          color:#4ade80;
          margin-top:10px;
          font-weight:bold;
          font-size:16px;
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