
// const sendHttpRequest = (method, url) => {
//     //create new XMLHttpRequest Object
//     const xhr = new XMLHttpRequest();

//     //Configure http request
//     //method: GET OR POST
//     //url: server/file location
//     //async: true (asynchronous ) or false (synchronous)
//     xhr.open(method, url, true);

//     //preparing response to avoid using json formatter after data is recieved
//     xhr.responseType = 'json';


//     // send() sends the request to the srver used for GET
//     // send(arg) is used for POST
//     xhr.send();
//     //what we will do with the data that we recieved
//     xhr.onload = () => {
//         const data = xhr.response;
//         renderData(data);
//         // console.log(data);
//         // console.log(data.time);
//     }
// }

// const getData = () => {
//     sendHttpRequest('GET', 'http://localhost:8080/data');
// }

// getData();

// const renderData = (data) => {
//     var table = document.getElementById('weather-data');
//     let str = "";
//     let row = undefined;
//     // for (let i = 0; i < data.length; i++) {
//     //     // str += data[i].type;
//     //     // row = `<tr>
//     //     //     <td>${data[i].type}</td>
//     //     //     <td>${data[i].value}</td>
//     //     //     <td>${data[i].place}</td>
//     //     // </tr>`
//     //     // console.log("WHAT");
//     //     // table.innerHTML += row;
//     // }
//     console.log(str);
// }



const loadData = (callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhr.response);
        }

    };
    xhr.open('GET', "http://localhost:8080/data");
    xhr.responseType = 'json';
    xhr.send();
    console.log("get already");
}
//place datetie weather type unit from to

const addCell = (tr, text) => {
    var td = tr.insertCell();
    td.textContent = text;
    return td;
}
renderData = (data) => {

    let table = document.getElementById("weather-data");
    console.log(data);

    data.forEach(element => {

        let row = table.insertRow();

        addCell(row, element.place);
        addCell(row, element.time);
        addCell(row, element.type);
        addCell(row, element.value);
        addCell(row, element.unit);


    });
}

loadData(renderData);

console.log('done');
