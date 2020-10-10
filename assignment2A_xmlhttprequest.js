


const sendHttpRequest = (method, url) => {
    //create new XMLHttpRequest Object
    const xhr = new XMLHttpRequest();
    //Configure http request
    xhr.open(method, url);

    //preparing response to avoid using json formatter after data is recieved
    xhr.responseType = 'json';
    //what we will do with the data that we recieved
    xhr.onload = () => {
        const data = xhr.response;
        console.log(data);
    }
    xhr.send();
}

const getData = () => {
    sendHttpRequest('GET', 'http://localhost:8080/data');
}
getData();

printToScreen = () => {
    document.getElementById("å-temp").innerHTML = xhr.responseText;
}
