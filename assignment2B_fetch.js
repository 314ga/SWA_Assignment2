const sendHttpRequest = (method, url, data) => {
  /*
   * fetch is using automatically premises so we don't have to
   * struggle with creating them we can use it directly
   * fetch will return ReadableStream
   */
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    //we have to attach common type header to make sure API doesn't fail
    headers: data ? { "Content-Type": "application/json" } : {},
  }).then((response) => {
    if (response.status >= 400) {
      /* reject promise,
       * throw new Error('Something went wrong!');
       * error.data =  but in fetch response body is
       * not available in this step
       */
      //return inner promise for it to became outer promise
      response.json().then((errData) => {
        const err = new Error("Something went wrong");
        err.data = errData;
        throw err;
      });
    }
    //parse Stream to JSON returns promise
    return response.json();
  });
};

const getDataFor = (task, type, extra) => {
  if (extra == undefined || extra == undefined) {
    extra = "";
    type = "data";
  }
  sendHttpRequest("GET", "http://localhost:8080/" + type + "/" + extra)
    /*
     * in promisess you can use chain model(use of more .then()
     * input parameter is return of previous then
     */
    .then((responseData) => {
      switch (task) {
        case "Latest measurments":
          showLatestMeasurments(responseData);
          break;
        case "min Temp 5 days":
          minTempLastFiveDays(responseData);
          break;
        case "max Temp 5 days":
          maxTempLastFiveDays(responseData);
          break;
        case "total prec 5 days":
          totalPrecLastFiveDays(responseData);
          break;
        case "average wind":
          averageWind(responseData);
          break;
        case "dominant wind direction":
          dominantWind(responseData);
          break;
        case "average cloud coverage":
          averageCloud(responseData);
          break;
        case "hourly prediction 24h":
          hourlyPredictionDay(responseData);
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      console.log(err, err.data);
    });
};

function appendWeatherData(data) {
  var tableRef = document.getElementById("weather-data-table");
  if (data.length != undefined) {
    data.forEach((element) => {
      let row = tableRef.insertRow();
      addCell(row, element.place);
      if (element.type == "precipitation")
        addCell(row, element.precipitation_type);
      else if (element.type == "wind speed") addCell(row, element.direction);
      else addCell(row, "-");
      addCell(row, element.time);
      addCell(row, element.type);
      addCell(row, element.value + element.unit);
    });
  } else if (data != undefined) {
    let row = tableRef.insertRow();
    addCell(row, data.place);
    if (data.type == "precipitation") addCell(row, data.precipitation_type);
    else if (data.type == "wind speed") addCell(row, data.direction);
    else addCell(row, "-");
    addCell(row, data.time);
    addCell(row, data.type);
    addCell(row, data.value + data.unit);
  }
}

///////TODO: change it for prediction data
function appendWeatherPredictionData(data) {
  var tableRef = document.getElementById("weather-prediction-table");
  if (data.length != undefined) {
    data.forEach((element) => {
      let row = tableRef.insertRow();
      addCell(row, element.place);
      if (element.type == "precipitation")
        addCell(row, element.precipitation_type);
      else if (element.type == "wind speed") addCell(row, element.direction);
      else addCell(row, "-");
      addCell(row, element.time);
      addCell(row, element.type);
      addCell(row, element.value + element.unit);
    });
  } else if (data != undefined) {
    let row = tableRef.insertRow();
    addCell(row, data.place);
    if (data.type == "precipitation") addCell(row, data.precipitation_type);
    else if (data.type == "wind speed") addCell(row, data.direction);
    else addCell(row, "-");
    addCell(row, data.time);
    addCell(row, data.type);
    addCell(row, data.value + data.unit);
  }
}
function showLatestMeasurments(data) {
  var latestMeasurments = data.filter(
    (allData) =>
      (allData.place == "Horsens" &&
        Date.parse(allData.time) ==
          getLatestMeasurementTimeFor(data, "Horsens")) ||
      (allData.place == "Copenhagen" &&
        Date.parse(allData.time) ==
          getLatestMeasurementTimeFor(data, "Copenhagen")) ||
      (allData.place == "Aarhus" &&
        Date.parse(allData.time) == getLatestMeasurementTimeFor(data, "Arhus"))
  );
  appendWeatherData(latestMeasurments);

}
function minTempLastFiveDays(data) {
  var measurmentsFiveD = data.filter(
    (allData) =>
      allData.type == "temperature" &&
      Date.parse(allData.time) >= fiveDaysBack()
  );
  var result = measurmentsFiveD.reduce(
    (min, p) => (p.value < min.value ? p : min),
    measurmentsFiveD[0]
  );
  addTitleCell("LOWEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS:");
  appendWeatherData(result);
}
function maxTempLastFiveDays(data) {
  var measurmentsFiveD = data.filter(
    (allData) =>
      allData.type == "temperature" &&
      Date.parse(allData.time) >= fiveDaysBack()
  );
  var result = measurmentsFiveD.reduce(
    (max, p) => (p.value > max.value ? p : max),
    measurmentsFiveD[0]
  );
  addTitleCell("HIGHEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS:");
  appendWeatherData(result);
}
function totalPrecLastFiveDays(data) {
  var measurmentsFiveD = data.filter(
    (allData) =>
      allData.type == "precipitation" &&
      Date.parse(allData.time) >= fiveDaysBack()
  );
  var result = measurmentsFiveD.reduce((total, p) => total + p.value, 0);
  addResultDiv("Total precipitation for last 5 days:", result);
}
//TODO: FINISH FUNCTION BELOW
function averageWind(data){

}
function dominantWind(data){

}
function averageCloud(data){

}
function hourlyPredictionDay(data)
{

}


function getLatestMeasurementTimeFor(data, city) {
  var latestDateFor = data.reduce((allData, oldestData) => {
    if (
      allData.place == city &&
      Date.parse(allData.time) >= Date.parse(oldestData.time)
    )
      return allData;
    else return oldestData;
  });
  return Date.parse(latestDateFor.time);
}
//document ready javascript
function r(f) {
  /in/.test(document.readyState) ? setTimeout("r(" + f + ")", 9) : f();
}
r(function () {
  getDataFor("Latest measurments", "data", "");
  getDataFor("min Temp 5 days", "data", "");
  getDataFor("max Temp 5 days", "data", "");
  getDataFor("total prec 5 days", "data", "");
  getDataFor("average wind", "data", "");
  getDataFor("dominant wind direction", "data", "");
  getDataFor("average cloud coverage", "data", "");
  getDataFor("hourly prediction 24h", "forecast", "");
});

const addCell = (tr, text) => {
  var td = tr.insertCell();
  td.textContent = text;
  return td;
};
const fiveDaysBack = () => {
  var minusdays = new Date();
  minusdays.setDate(minusdays.getDate() - 5);
  return minusdays;
};
const addResultDiv = (title, result) => {
  const div = document.createElement("div");
  div.innerHTML =
    "<h1 class='text-center'>" +
    title +
    "</h1>" +
    "<h4  class='text-center'>" +
    result +
    "</h4>";
  document.getElementById("task-results").appendChild(div);
};
const addTitleCell = (title) =>
{
  var tableRef = document.getElementById("weather-data-table");
  let row = tableRef.insertRow();
      addCell(row, "");
      addCell(row, "");
      addCell(row, title);
      addCell(row, "");
      addCell(row, "");
};