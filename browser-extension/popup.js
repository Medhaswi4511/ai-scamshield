const scanBtn = document.getElementById("scanBtn");

const resultDiv = document.getElementById("result");

scanBtn.addEventListener("click", async () => {

  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const currentUrl = tabs[0].url;

  resultDiv.innerHTML = `
    <p>Scanning...</p>
  `;

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/detect-url",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url: currentUrl,
        }),
      }
    );

    const data = await response.json();

    resultDiv.innerHTML = `
      <h3>Scan Result</h3>

      <p>
        Risk Score:
        <strong>${data.risk_score}%</strong>
      </p>

      <p>
        ${
          data.is_phishing
            ? "⚠️ Potential Phishing Site"
            : "✅ Website Looks Safe"
        }
      </p>

      <h4>Reasons</h4>

      <ul>
        ${data.reasons
          .map(
            (reason) =>
              `<li>${reason}</li>`
          )
          .join("")}
      </ul>
    `;

  } catch (error) {

    resultDiv.innerHTML = `
      <p>
        Backend connection failed.
      </p>
    `;
  }
});