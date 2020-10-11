

const loadData = (method, type, extras, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhr.response);
        }

    };
    xhr.open(method, "http://localhost:8080/" + type + "/" + extras, true);
    xhr.responseType = 'json';
    xhr.send();
    console.log("get already");
}
//place datetie weather type unit from to
//precipitation_type
//direction

const addCell = (tr, text) => {
    var td = tr.insertCell();
    td.textContent = text;
    return td;
}


let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
let date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const latestMeasurements = (data) => {
    let latestData = data.filter(function (latest) {
        var d = new Date();
        d.setDate(d.getDate() - 2);
        return Date.parse(latest.time) > Date.parse(d);
    });
    return latestData;
}


showLatestMeasurments = (data) => {
    let tableref = document.getElementById("latest-measurement").getElementsByTagName("tbody")[0];
    latestMeasurements(data).forEach(element => {
        let row = tableref.insertRow();
        addCell(row, element.place);
        addCell(row, element.time);
        addCell(row, element.type);
        addCell(row, element.value);
        addCell(row, element.unit);
        if (element.type == 'precipitation') {
            addCell(row, element.precipitation_type);
        }
        else if (element.type == 'wind speed') { addCell(row, element.direction) }
        else {
            addCell(row, '-')
        }

    });
}

showMinTemp = (data) => {
    let tableref = document.getElementById("temperature").getElementsByTagName("tbody")[0];
    const latests = latestMeasurements(data);
    //array of all temperatures within the last five days
    const getTemperature = latests.filter(function (temp) {
        return temp.type === "temperature"
    });
    const getMinTemp = () => getTemperature.reduce(function (min, temp) {
        return min.value < temp.value ? min : temp;
    });

    let row = tableref.insertRow();
    addCell(row, getMinTemp().place);
    addCell(row, getMinTemp().time);
    addCell(row, getMinTemp().value);
    addCell(row, getMinTemp().unit);

}
showMaxTemp = (data) => {
    let tableref = document.getElementById("temperature").getElementsByTagName("tbody")[1];
    const latests = latestMeasurements(data);
    //array of all temperatures within the last five days
    const getTemperature = latests.filter(function (temp) {
        return temp.type === "temperature"
    });
    const getMaxTemp = () => getTemperature.reduce(function (max, temp) {
        return max.value > temp.value ? max : temp;
    });
    console.log(getMaxTemp());
    let row = tableref.insertRow();
    addCell(row, getMaxTemp().place);
    addCell(row, getMaxTemp().time);
    addCell(row, getMaxTemp().value);
    addCell(row, getMaxTemp().unit);

}

loadData("GET", "data", "", latestMeasurements);
loadData("GET", "data", "", showLatestMeasurments);
loadData("GET", "data", "", showMinTemp);
loadData("GET", "data", "", showMaxTemp);

