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

const getDataFor = (task,type,extra) => {

  if(extra == undefined || extra == undefined)
  {
    extra = "";
    type = "data";
  }
  sendHttpRequest("GET", "http://localhost:8080/"+type + "/" + extra)
    /*
     * in promisess you can use chain model(use of more .then()
     * input parameter is return of previous then
     */
    .then((responseData) => 
    {
      switch(task)
      {
        case "Latest measurments":
            showLatestMeasurments(responseData);
            break;
        case "min Temp 5 days":
            minTempLastFiveDays(responseData);
            break;
      }
    })
    .catch((err) => {
      console.log(err, err.data);
    });
};



function appendWeatherData(data) {
  var tableRef = document.getElementById('weather-data-table').getElementsByTagName('tbody')[0];
  for (var i = 0; i < data.length; i++) {
    var value,type,unit,time,place;
    let extras = "-";
    var new_tr = document.createElement("tr");
    for (var key of Object.keys(data[i])) {
      switch (key) {
        case "value":
            value = data[i][key];
          break;
        case "type":
            type = data[i][key];
          break;
        case "unit":
            unit = data[i][key];
          break;
        case "time":
            time = data[i][key];
          break;
        case "place":
            place = data[i][key];
          break;
        case "direction":
        case "precipitation_type":
            extras = data[i][key];
          break;
      }
    }
    var newRow = tableRef.insertRow(tableRef.rows.length);
    var dataString = "<tr><td>"+place+"</td><td>"+extras+"</td><td>"+time+"</td><td>"+type+"</td><td>"+value+" " + unit + "</tr>";
    newRow.innerHTML += dataString;
  }
}

function showLatestMeasurments(data)
{
   
    var latestMeasurments = data.filter(allData =>allData.place == "Horsens" && Date.parse(allData.time) == getLatestMeasurementTimeFor(data,"Horsens") ||
    allData.place == "Copenhagen" && Date.parse(allData.time) == getLatestMeasurementTimeFor(data,"Copenhagen") ||
    allData.place == "Aarhus" && Date.parse(allData.time) == getLatestMeasurementTimeFor(data,"Arhus"));

    appendWeatherData(latestMeasurments);
}
function minTempLastFiveDays(data)
{
  var minusdays = new Date();
  minusdays.setDate(minusdays.getDate()-5);
    var measurmentsFiveD = data.filter(allData => allData.type == "temperature" &&  Date.parse(allData.time) >= minusdays)
    console.log(measurmentsFiveD);
    var result = measurmentsFiveD.reduce((min,data) =>{
      if(data.value < min)
        return min
      else
        return data;
    })
    
    console.log(result);
    appendWeatherData(result);
}

function getLatestMeasurementTimeFor(data,city)
{
  var latestDateFor = data.reduce((allData,oldestData) =>{
    if(allData.place == city && Date.parse(allData.time) >= Date.parse(oldestData.time))
      return allData;
    else
      return oldestData;

  });
  return Date.parse(latestDateFor.time);
}
function r(f) {
  /in/.test(document.readyState) ? setTimeout("r(" + f + ")", 9) : f();
}
// use like
r(function () {
  getDataFor("Latest measurments","data","");
  getDataFor("min Temp 5 days","data","");
});
