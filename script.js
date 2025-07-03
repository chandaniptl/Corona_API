const allowedStates = [
    "Maharashtra", "Kerala", "Karnataka", "Tamil Nadu", "Delhi",
    "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Bihar"
];

let covidData = [];

fetch("https://api.rootnet.in/covid19-in/stats/latest")
    .then(res => res.json())
    .then(data => {
        covidData = data.data.regional.filter(region =>
            allowedStates.includes(region.loc)
        );

        const stateSelect = document.getElementById("stateSelect");

        covidData.forEach(region => {
            const option = document.createElement("option");
            option.value = region.loc;
            option.textContent = region.loc;
            stateSelect.appendChild(option);
        });

        document.getElementById("dropdown").style.display = "flex";
        document.getElementById("loading").style.display = "none";
    })
    .catch(error => {
        document.getElementById("loading").textContent = "Failed to load data.";
        console.error("Error fetching data:", error);
    });

document.getElementById("stateSelect").addEventListener("change", function () {
    const selected = this.value;
    const statsDiv = document.getElementById("stats");
    const stateData = covidData.find(region => region.loc === selected);

    if (stateData) {
        const activeCases = stateData.totalConfirmed - stateData.discharged - stateData.deaths;
        statsDiv.style.display = "block";
        statsDiv.innerHTML = `
          <h3>COVID-19 Stats for ${stateData.loc}</h3>
          <div class="stat-card">
            <div class="stat-box">
              <h4>Total Confirmed</h4>
              <p>${stateData.totalConfirmed.toLocaleString()}</p>
            </div>
            <div class="stat-box">
              <h4>Recovered</h4>
              <p>${stateData.discharged.toLocaleString()}</p>
            </div>
            <div class="stat-box">
              <h4>Deaths</h4>
              <p>${stateData.deaths.toLocaleString()}</p>
            </div>
            <div class="stat-box">
              <h4>Active Cases</h4>
              <p>${activeCases.toLocaleString()}</p>
            </div>
          </div>
        `;
    } else {
        statsDiv.style.display = "none";
        statsDiv.innerHTML = "";
    }
});
