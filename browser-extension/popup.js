document
  .getElementById("scanBtn")
  .addEventListener(
    "click",
    async () => {

      const url =
        document.getElementById(
          "urlInput"
        ).value;

      const resultDiv =
        document.getElementById(
          "result"
        );

      resultDiv.innerHTML =
        "Scanning...";

      try {

        const response =
          await fetch(
            "https://ai-scamshield-backend.onrender.com/detect-url",
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

        if (data.is_phishing) {

          resultDiv.innerHTML = `
            <div style="
              color:#f87171;
              margin-top:10px;
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
            ">
              ✅ Website Looks Safe
            </div>
          `;
        }

      } catch (error) {

        resultDiv.innerHTML = `
          <div style="color:red">
            Backend connection failed
          </div>
        `;
      }
    }
  );