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
//Adding data to weather data table
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
//Adding data to weather prediction table
function appendWeatherPredictionData(data) 
{
  var tableRef = document.getElementById("weather-prediction-table");
    data.forEach((element) => {
      let row = tableRef.insertRow();
      addCell(row, element.place);
      addCell(row, element.time);
      addCell(row, element.type);
      if (element.type == "precipitation")
      {
        var text = "";
        element.precipitation_types.forEach((pt) =>{
            if(text == "")
              text = pt;
            else
              text += ", " + pt;
        })
        addCell(row, text);
      }
      else if (element.type == "wind speed")
      {
        var text = "";
        element.directions.forEach((d) =>{
            if(text == "")
              text = d;
            else
              text += ", " + d;
        })
        addCell(row, text);
      }
      else addCell(row, "-");
      addCell(row, element.from + element.unit);
      addCell(row, element.to + element.unit);
    });
}

//Showing latest measurements for each city and each type
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

//showing min. temperature for last five days for all cities
function minTempLastFiveDays(data) {

  addTitleCell("LOWEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Horsens:");
  appendWeatherData(findMinFromMeasurements(getMeasurementsFor(5,data,"temperature","Horsens")));

  addTitleCell("LOWEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Aarhus:");
   appendWeatherData(findMinFromMeasurements(getMeasurementsFor(5,data,"temperature","Aarhus")));

  addTitleCell("LOWEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Copenhagen:");
  appendWeatherData(findMinFromMeasurements(getMeasurementsFor(5,data,"temperature","Copenhagen")));
}
//showing max. temperature for last five days for all cities
function maxTempLastFiveDays(data) {

  addTitleCell("HIGHEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Horsens:");
  appendWeatherData(findMaxFromMeasurements(getMeasurementsFor(5,data,"temperature","Horsens")));

  addTitleCell("HIGHEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Aarhus:");
   appendWeatherData(findMaxFromMeasurements(getMeasurementsFor(5,data,"temperature","Aarhus")));

  addTitleCell("HIGHEST TEMPERATURE MEASUREMENT IN LAST 5 DAYS for Copenhagen:");
  appendWeatherData(findMaxFromMeasurements(getMeasurementsFor(5,data,"temperature","Copenhagen")));
}
//showing total precipitation for last five days for all cities
function totalPrecLastFiveDays(data) {
  var horsens = getMeasurementsFor(5,data,"precipitation","Horsens");
  var copen = getMeasurementsFor(5,data,"precipitation","Copenhagen");
  var aarhus = getMeasurementsFor(5,data,"precipitation","Aarhus");
  addResultDiv("Total precipitation for last 5 days for Copenhagen:", getTotalFromMeasurements(copen) + copen[0].unit);
  addResultDiv("Total precipitation for last 5 days for Horsens:", getTotalFromMeasurements(horsens) + horsens[0].unit);
  addResultDiv("Total precipitation for last 5 days for Aarhus:", getTotalFromMeasurements(aarhus) + aarhus[0].unit);
}
//showing average wind for last five days for all cities
function averageWind(data){
  var horsens = getMeasurementsFor(5,data,"wind speed","Horsens");
  var copen = getMeasurementsFor(5,data,"wind speed","Copenhagen");
  var aarhus = getMeasurementsFor(5,data,"wind speed","Aarhus");
  addResultDiv("Average wind speed for last 5 days for Copenhagen:", (getTotalFromMeasurements(copen) / copen.length) + copen[0].unit);
  addResultDiv("Average wind speed for last 5 days for Horsens:", (getTotalFromMeasurements(horsens) / copen.length) + horsens[0].unit);
  addResultDiv("Average wind speed for last 5 days for Aarhus:", (getTotalFromMeasurements(aarhus) / copen.length) + aarhus[0].unit);
}

//showing dominant wind for last five days for all cities
function dominantWind(data)
{
  var horsens = getCountOfDiffWords(getMeasurementsFor(5,data,"wind speed","Horsens"));
  var copen = getCountOfDiffWords(getMeasurementsFor(5,data,"wind speed","Copenhagen"));
  var aarhus = getCountOfDiffWords(getMeasurementsFor(5,data,"wind speed","Aarhus"));
  addResultDiv("Most dominant wind direction for last 5 days:", horsens[horsens[horsens.length -1]-1] + " - it appeared "  + horsens[horsens[horsens.length -1]] + " times");
  addResultDiv("Most dominant wind direction for last 5 days:", copen[copen[copen.length -1]-1] + " - it appeared "  + copen[copen[copen.length -1]] + " times");
  addResultDiv("Most dominant wind direction for last 5 days:", aarhus[aarhus[aarhus.length -1]-1] + " - it appeared "  + aarhus[aarhus[aarhus.length -1]] + " times");

}

//showing average cloud coverage for last five days for all cities
function averageCloud(data)
{
  var horsens = getMeasurementsFor(5,data,"cloud coverage","Horsens");
  var copen = getMeasurementsFor(5,data,"cloud coverage","Copenhagen");
  var aarhus = getMeasurementsFor(5,data,"cloud coverage","Aarhus");
  addResultDiv("Average cloud coverage for last 5 days for Copenhagen:", (getTotalFromMeasurements(copen) / copen.length) + copen[0].unit);
  addResultDiv("Average cloud coverage last 5 days for Horsens:", (getTotalFromMeasurements(horsens) / copen.length) + horsens[0].unit);
  addResultDiv("Average cloud coverage last 5 days for Aarhus:", (getTotalFromMeasurements(aarhus) / copen.length) + aarhus[0].unit);
}
//showing showing 24h prediction for all cities
function hourlyPredictionDay(data)
{
  appendWeatherPredictionData(getMeasurForHoursFront(data,24));
}

//METHOD HELPERS

//getting latest measurements time for specific city
const getLatestMeasurementTimeFor = (data, city) => {
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

//adding cell into the table
const addCell = (tr, text) => {
  var td = tr.insertCell();
  td.textContent = text;
  return td;
};

//getting measurements from array for x hours in front
const getMeasurForHoursFront = (data,hours) =>{
  var now = new Date();
  var plusdays = new Date();
  plusdays.setHours(plusdays.getHours() + hours);
  return data.filter(actual => 
  {
    //avoiding adding hours depends on actual UTC hours (GTM +2h)
    var t = new Date((actual.time).substring(0,(actual.time).length - 1));
    return t <= plusdays && t >= now;

  });
}
//adding result fiv to the page
const addResultDiv = (title, result) => {
  const div = document.createElement("div");
  div.innerHTML =
    "<h3 class='text-center'>" +
    title +
    "</h3>" +
    "<h4  class='text-center'>" +
    result +
    "</h4>";
  document.getElementById("task-results").appendChild(div);
};

//adding new "title" cell into the table
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

//getting measurements for specific city type for x days back
const getMeasurementsFor = (daysback,data,type,city) =>
{
  var minusdays = new Date();
  minusdays.setDate(minusdays.getDate() - daysback);
 
  return data.filter( allData =>{
    //avoiding adding hours depends on actual UTC hours (GTM +2h)
    var t = new Date((allData.time).substring(0,(allData.time).length - 1));
    return allData.type == type && allData.place == city && t >= minusdays
  });
}

/*
* input parameter array with types and its counts from the function getCountOfDiffWords
* input parameter type: function checks if it exist in input parameter array and increase count of it 
* if it exist or create new element otherwise
*/
const countWindType = (allTypes,type) =>
{
  let wasAdded = false;
  //loops always +2 because odd numbers are types and even numbers are counts for it.
  for(a = 0;a<allTypes.length;a += 2)
  {
    if(allTypes[a] == type)
    {
      allTypes[a+1] += 1;
      wasAdded = true;
      break;
    }
  }
  if(!wasAdded)
  {
    allTypes[allTypes.length] = type;
    allTypes[allTypes.length] = 1;
  }

  return allTypes;
}

//find minimum value from given array
const findMinFromMeasurements = (array) =>
{
  return array.reduce(
    (min, p) => (p.value < min.value ? p : min),
    array[0]
  );
}
//find maximum value from given array
const findMaxFromMeasurements = (array) =>
{
  return array.reduce(
    (max, p) => (p.value > max.value ? p : max),
    array[0]
  );
}
//return total of values from given array
const getTotalFromMeasurements = (array) =>
{
  return array.reduce((total, p) => total + p.value, 0);
}

/*gets array of different words and counts how much times word appeared in array and last element is
* position which word appeared most of the time
* for example input: [North,North,South] => output: [North,2,South,1,1]
*/
const getCountOfDiffWords = (array) =>{
  var windCount = [];
  array.forEach((element) =>
  {
    windCount = countWindType(windCount,element.direction);
  });
  var windDominant = -1;
  var position = -1
  for(i = 1;i<windCount.length;i +=2)
  {
    if(windCount[i] > windDominant)
    {
      windDominant = windCount[i];
      position = i;
    }
      
  }
  windCount[windCount.length] = position;
  return windCount;
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