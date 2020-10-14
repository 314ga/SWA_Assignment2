/*loadData takes 4 parameters which specify :
 *  the method of data retrieval
 *url extentions and a callback function which executes each AJAX task

 *when loadData is called, it creates an XMLHttpRequest
 *
 */

function loadData(method, type, extras, callback) {
    let xhr = new XMLHttpRequest();
    /*
    *The onreadystatechange property defines a function
    *to be executed when the readyState changes. 
    *
    *in this case, a callback function is executed.

    * The status property and the statusText
    *  property holds the status of the XMLHttpRequest object.
    */
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhr.response);
        }


    };
    xhr.open(method, "http://localhost:8080/" + type + "/" + extras, true);

    //specifying the data format so we don't have to parse it later on
    xhr.responseType = 'json';
    xhr.send();
}

//helper function for adding new cells to the table
const addCell = (tr, text) => {
    var td = tr.insertCell();
    td.textContent = text;
    return td;
}
//getting all data from "current" time
function latestMeasurements(data) {
    let today = new Date();
    let laterToday = new Date(); //22
    laterToday.setHours(laterToday.getHours() + 1); //23
    const latestData = data.filter(data_t => {
        //avoiding adding hours depends on actual UTC hours (GTM +2h)
        var t = new Date((data_t.time).substring(0, (data_t.time).length - 1)); //...22,23...
        //return data that is between the current time and one hour ahead
        return today < t && t < laterToday;
    });
    showLatestMeasurments(latestData);
}
//append the data we retrieved to the html table
showLatestMeasurments = (data) => {
    let tableref = document.getElementById("latest-measurement").getElementsByTagName("tbody")[0];
    data.forEach(element => {
        let row = tableref.insertRow();
        addCell(row, element.place);
        addCell(row, element.time);
        addCell(row, element.type);
        addCell(row, element.from);
        addCell(row, element.to);
        addCell(row, element.unit);
        if (element.type == 'precipitation') {
            var str = "";
            var precipitations = element.precipitation_types;
            precipitations.forEach(x => {
                if (x == "") {
                    str = x;
                }
                else {
                    str += " " + x + ", ";

                }


            });
            addCell(row, str);
        }
        else if (element.type == 'wind speed') {
            var str = "";
            var directions = element.directions;
            directions.forEach(x => {
                if (x == "") {
                    str = x;
                }
                else {
                    str += " " + x + ", ";
                }

            });
            addCell(row, str);
            addCell(row, element.direction)
        }
        else {
            addCell(row, '-')
        }

    });
}
//function to retrieve data from x amount of days ago
//this function is being passed to loadData() function
function dataFiveDaysAgo(data) {
    let dataHistory = data.filter(function (later) {
        var d = new Date();
        d.setDate(d.getDate() - 5);
        return Date.parse(later.time) > Date.parse(d);
    });
    getPreciptiation(dataHistory);
    getTemperature(dataHistory);
    getCloud(dataHistory)
    getWind(dataHistory);

}
//function to get the temperature data from last five days
function getTemperature(data) {

    const getTemperature = data.filter(function (temp) {
        return temp.type === "temperature"
    });

    showMinAndMaxTemp(getTemperature);
}
//calculating min & max temp
//appending the result to both max and min table in HTML
showMinAndMaxTemp = (data) => {
    let tablerefMin = document.getElementById("temperature").getElementsByTagName("tbody")[0];
    let tablerefMax = document.getElementById("temperature").getElementsByTagName("tbody")[1];
    const getMinTemp = data.reduce(function (min, temp) {
        return min.value < temp.value ? min : temp;
    }, {});
    const getMaxTemp = data.reduce(function (max, temp) {
        return max.value > temp.value ? max : temp;
    }, {});


    let rowMin = tablerefMin.insertRow();
    let rowMax = tablerefMax.insertRow();
    addCell(rowMax, getMaxTemp.place);
    addCell(rowMax, getMaxTemp.time);
    addCell(rowMax, getMaxTemp.value);
    addCell(rowMax, getMaxTemp.unit);
    addCell(rowMin, getMinTemp.place);
    addCell(rowMin, getMinTemp.time);
    addCell(rowMin, getMinTemp.value);
    addCell(rowMin, getMaxTemp.unit);


}
//get all precipitation data for the past 5 days
function getPreciptiation(data) {

    let precipitation = data.filter(function (prec) {
        return prec.type === "precipitation"
    });
    showPreciptiationTotal(precipitation);

}
//calculate and append the total precipitation for last five days to HTML  table
showPreciptiationTotal = (data) => {
    let tableref = document.getElementById("total-prec").getElementsByTagName("tbody")[0];
    let totalP = data.reduce((acc, prec) => acc + prec.value, 0);
    let row = tableref.insertRow();
    addCell(row, data[0].place);
    addCell(row, totalP);
    addCell(row, data[0].unit);

}
//get all wind data from last five days
function getWind(data) {

    let wind = data.filter(function (wind) {
        return wind.type === "wind speed"
    });
    showAvgWind(wind);
    showDominantWindDirection(wind);

}
//calculate and append wind average to HTML table
function showAvgWind(data) {
    let tableref = document.getElementById("average-wind").getElementsByTagName("tbody")[0];
    let windAvg = data.reduce((acc, wind) => (acc + wind.value) / data.length, 0);

    let row1 = tableref.insertRow();
    addCell(row1, data[0].place)
    addCell(row1, windAvg);
    addCell(row1, data[0].unit);
}
//calculate and append dominant wind data
function showDominantWindDirection(data) {
    let tableref = document.getElementById("dominant-wind").getElementsByTagName("tbody")[0];
    let directions = data.map(dir => dir.direction);
    let mf = 1;
    let m = 0;
    var dominantWDirection;
    for (let i = 0; i < directions.length; i++) {
        for (let j = i; j < directions.length; j++) {
            if (directions[i] == directions[j])
                m++;
            if (mf < m) {
                mf = m;

                dominantWDirection = directions[i];
            }

        }
        m = 0;
    }
    let row1 = tableref.insertRow();
    addCell(row1, data[0].place);
    addCell(row1, dominantWDirection);
    addCell(row1, data[0].unit);

}
//get cloud data from last 5 days
function getCloud(data) {

    let cloudCoverage = data.filter(function (cloud) {
        return cloud.type === "cloud coverage"
    });
    showCloudCoverage(cloudCoverage);
}
//append cloud data to HTML table
function showCloudCoverage(data) {
    let tableref = document.getElementById("cloud-coverage").getElementsByTagName("tbody")[0];
    data.forEach(element => {
        let row = tableref.insertRow();
        addCell(row, element.place);
        addCell(row, element.time);
        addCell(row, element.type);

        addCell(row, element.value);
        addCell(row, element.unit);



    });
}
//get weather forecast for 24 hours ahead
function getWeatherForecast(data) {
    const futureData = data.filter(function () {
        var now = new Date();
        var plusDays = new Date();
        plusDays.setHours(plusDays.getHours() + 24)
        return data.filter(data_f => {
            var t = new Date((data_f.time).substring(0, (data_f.time).length) - 1);
            return t <= plusDays && t > now;
        })
    })
    showWeatherForecast(futureData)
}
//append weather forecast to table
showWeatherForecast = (data) => {
    let tableref = document.getElementById("prediction").getElementsByTagName("tbody")[0];
    data.forEach(element => {
        let row = tableref.insertRow();
        addCell(row, element.place);
        addCell(row, element.time);
        addCell(row, element.type);
        addCell(row, element.from);
        addCell(row, element.to);
        addCell(row, element.unit);
        if (element.type == 'precipitation') {
            var str = "";
            var precipitations = element.precipitation_types;
            precipitations.forEach(x => {
                if (x == "") {
                    str = x;
                }
                else {
                    str += " " + x + ", ";
                }


            });
            addCell(row, str);
        }
        else if (element.type == 'wind speed') {
            var str = "";
            var directions = element.directions;
            directions.forEach(x => {
                if (x == "") {
                    str = x;
                }
                else {
                    str += " " + x + ", ";
                }
            });
            addCell(row, str);
            addCell(row, element.direction)
        }
        else {
            addCell(row, '-')
        }

    });
}
loadData("GET", "forecast", "Horsens", latestMeasurements);
loadData("GET", "forecast", "AArhus", latestMeasurements);
loadData("GET", "forecast", "Copenhagen", latestMeasurements);
loadData("GET", "data", "Horsens", dataFiveDaysAgo);
loadData("GET", "data", "Aarhus", dataFiveDaysAgo);
loadData("GET", "data", "Copenhagen", dataFiveDaysAgo);
loadData("GET", "forecast", "Horsens", getWeatherForecast);
loadData("GET", "forecast", "Aarhus", getWeatherForecast);
loadData("GET", "forecast", "Copenhagen", getWeatherForecast);





