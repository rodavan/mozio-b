const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const haversine = require("haversine-distance");
const { MOCK_DATA } = require("./data");
const { delay } = require("./utils");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const cityNames = MOCK_DATA.map((cityData) => cityData[0]);

app.get("/find/:cityName", async (req, res) => {
  const cityName = req.params.cityName;
  await delay(500);
  if (cityName.toLowerCase().includes("fail")) {
    res.sendStatus(500);
    return;
  }
  const result = cityNames.filter((name) =>
    cityName
      .split("")
      .filter((l) => l !== " ")
      .every((letter) =>
        name.split("").some((l) => l.toLowerCase() === letter.toLowerCase())
      )
  );
  res.json(result);
});

app.post("/calc", async (req, res) => {
  const cityParam = req.body.cities;
  const cities = cityParam.map((city) =>
    MOCK_DATA.find((item) => item[0] === city)
  );
  const distances = [];
  await delay(500);

  if (cityParam.includes("Dijon") || !cities.every((c) => !!c)) {
    res.sendStatus(500);
    return;
  }
  for (let i = 0; i < cities.length - 1; i++) {
    if (!cities[i] || !cities[i + 1]) {
      res.sendStatus(404);
      return;
    }
    distances.push(
      (
        haversine(
          { lat: cities[i][1], lng: cities[i][2] },
          { lat: cities[i + 1][1], lng: cities[i + 1][2] }
        ) / 1000
      ).toFixed(2)
    );
  }
  res.json(distances);
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
