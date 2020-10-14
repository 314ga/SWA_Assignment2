////////////////EXTRA FUNCTIONS
/////////////////FUNCTION FOR CREATING RANDOM DATES/////////////////
function randomDate(start, end) 
{
    var date = new Date(+start + Math.random() * (end - start));
    var hour = 15;
    date.setHours(hour);
    return date;
}
//Create function foe very possible shit
//pure functions(don't use global vaiable to compute stuff)
//use higher order functions - keep function as parameter
//use filters, maps, reduce
//structural sharing
//avoid mutability
////////////////////DATA TYPE FUNCTION//////////////////////////////
function DataType(options){
    const type = () => options.type;
    const unit = () => options.unit;
    return {type, unit};
}

////////////////////EVENT FUNCTION//////////////////////////////
function EventFunc(options){
    const time = () => options.time;
    const place = () => options.place;
   return {time,place};
}

////////////////////WEATHER DATA FUNCTION//////////////////////////////
function WeatherData(options)
{
    const value = () => options.value;

    return Object.assign ({value}, DataType(options), EventFunc(options));
};

////////////////////TEMPERATURE, WIND, PRECIPITATION, CLOUDCOVERAGE//////////////
function Temperature(unit,value,type,time,place)
{
    const options = { unit,value,type,time,place };
    const convertToF = () => 
    {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "C")
        {
            newValue = (options.value * 9/5) + 32;
            newUnit = "F";
        }

        return Temperature(newUnit,newValue,type,time,place);
        
    };
    const convertToC = () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "F")
        {
            newValue = (options.value - 32) * 5/9;
            newUnit = "C";
        }

        return Temperature(newUnit,newValue,type,time,place);
    };
    return Object.assign({convertToF, convertToC}, WeatherData(options));
}; 
function Wind(unit,value,type,time,place,dir)
{
    const options = {dir, unit, value, type, time, place};
    const direction = () => dir;

    const convertToMPH= () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "MS")
        {
            newValue = options.value * 2.237;
            newUnit = "MPH";
        }
        return Wind(newUnit,newValue,type,time,place,dir)
    }
    const convertToMS= () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "MPH")
        {
            newValue = options.value / 2.237;
            newUnit = "MS";
        }
        return Wind(newUnit,newValue,type,time,place,dir)
    }

    return Object.assign({direction, convertToMPH, convertToMS}, WeatherData(options));
};
function Precipitation(unit,value,type,time,place, precType)
{
    const options = {precType, unit, value, type, time, place };
    const precipitationType = () =>  precType;
     
    const convertToInches = () => {
        let newValue=value;
        let newUnit=unit;
        if(options.unit == "mm")
        {
            newValue = options.value / 25,4;
            newUnit = "inches";
        }
        return Precipitation(newUnit,newValue,type,time,place, precType);
    }
    const convertToMM = () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "inch")
        {
            newValue = options.value * 25,4;
            newUnit = "mm";
        }
        return Precipitation(newUnit,newValue,type,time,place, precType);
     }

    return Object.assign({convertToInches, convertToMM, precipitationType}, WeatherData(options));
};
function CloudCoverage(unit,value,type,time,place)
{
    const options = {unit, value, type, time, place};
    return Object.assign({}, WeatherData(options));
};

//#region Testing of the WeatherData
////////////////////////////CONVERT C TO F AND BACK TEST////////////////////////
let oldDate = new Date(2020,12,31)
console.log("CONVERT C TO F AND BACK TEST**************************");
console.log("");
let data1 = Temperature("C", 25,"Temperature", randomDate(new Date(2020,1,1),new Date(2020,12,31)),"Horsens");
console.log(data1.type() + ": " + data1.value() + data1.unit() + " " + data1.time() + " " + data1.place());
console.log("Original temperature in Celcius "+ data1.value() +" " +  data1.unit());
let newTemperature = data1.convertToF();
console.log("Converted Temperature To Farenheit: " + newTemperature.value() + newTemperature.unit());
console.log("Original temperature: " + data1.value() +" " +  data1.unit());
newTemperature = data1.convertToC();
console.log("Converted Temperature To Celcius: " + newTemperature.value() + newTemperature.unit());
console.log("Original temperature:" + data1.value() + " " + data1.unit());
console.log("END CONVERT C TO F AND BACK TEST************************");
console.log("");
////////////////////END CONVERT C TO F AND BACK TEST///////////////////////

////////////////////CONVERT MPH to MS AND BACK TEST///////////////////////////////
console.log("CONVERT MPH to MS AND BACK TEST********************************");
let data2 = Wind("MPH", 37,"Wind", randomDate(new Date(2020,1,1),new Date(2020,12,31)),"Copenhagen", "SZ");
let newWind = data2.convertToMS();
console.log(data2.type() + ": " + data2.value() + data2.unit() + " " + data2.time() + " " + data2.place() + " " + data2.direction());
console.log(data2.value() +" " +  data2.unit());
console.log("Converted MPH  To MS: " + newWind.value() + newWind.unit());
console.log("Original value: " + data2.value() + " " +  data2.unit());
newWind = data2.convertToMPH();
console.log("Converted MS  To MPH: " + newWind.value() + newWind.unit());
console.log("Original value: " + data2.value() +" " +  data2.unit());
console.log("END CONVERT MPH to MS AND BACK TEST*****************************");
console.log("");
//////////////////////////END CONVERT MPH to MS AND BACK TEST//////////////////////

//////////////////////CONVERT INCH to MM AND BACK TEST/////////////////////////////
console.log("CONVERT INCH to MM AND BACK TEST********************************");
let data3 = Precipitation("inch", 37,"Precipitation", (new Date(2020, 11, 24)),"Torring", "A LOT OF RAIN");
console.log(data3.type() + ": " + data3.value() + data3.unit() + " " + data3.time() + " " + data3.place() + " " + data3.precipitationType());
console.log(data3.value() +" " +  data3.unit());
let newPrecipitation = data3.convertToMM();
console.log("Converted INCH  To MM: " + newPrecipitation.value() + newPrecipitation.unit());
newPrecipitation = data3.convertToInches();
console.log("Original value: " + data3.value() + " " +  data3.unit());
console.log("Converted MM  To INCH: " + newPrecipitation.value() + newPrecipitation.unit());
console.log("Original value: " + data3.value() +" " +  data3.unit());
console.log("END CONVERT INCH to MM AND BACK TEST*****************************");
console.log("");
//////////////////////////END CONVERT INCH to MM AND BACK TEST//////////////////////////

console.log("CLOUD COVERAGE TEST********************************");
let data4 = CloudCoverage("%",100,"Cloud Coverage",(new Date(2018, 11, 24)),"Slovakia");
console.log(data4.type() + ": " + data4.value() + data4.unit() + " " + data4.time() + " " + data4.place());
console.log("END CLOUD COVERAGE TEST********************************");
console.log("");
//#endregion

/////////////////////////DATE INTERVAL//////////////////////////////
function DateInterval(fromDate, toDate)
{
    this.fromDate = fromDate;
    this.toDate = toDate;
    const from = () => fromDate;
    const to = () => toDate; 
    
    const contains = (d) =>
    {
        return fromDate < d && d < toDate;
    };

    return {from, to, contains};
};
function WeatherHistory(place,type, period, historyData)
{
  ////////////////VARIABLE, GETTER AND SETTERS FOR FILTERS/////////////////////
  const weatherData = [...historyData];

  const forPlace = (newPlace) =>{
    let newData = weatherData.filter((data) => {
        return data.place() === newPlace;
      });
    return new WeatherHistory(place,type, period,newData);

  };

  //const forType = (newType) => (weatherDataType.filter = newType);
  const forType = (newType)=>{
    let newData = weatherData.filter((data)=>{
        return data.type() === newType;
          });
          return new WeatherHistory(place,type, period,newData);
  }
  
  const forPeriod = (newPeriod) =>{
    let newData = weatherData.filter((data)=>{
        return  newPeriod.contains(data.time());
          });
          return new WeatherHistory(place,type, period,newData);
  }
  /////////////////////CONVERT ALL UNITS FOR US NORM/////////////////////////////////
  const convertToUsUnits = () => {
    const updatedWeatherHistory = weatherData.map((readData) => {
      switch (readData.type()) {
        case "Temperature":
          return readData.convertToF();
        case "Precipitation":
          return readData.convertToInches();
        case "Wind":
          return readData.convertToMPH();
        default:
          return readData;
      }
    });
    return new WeatherHistory(place,type, period,updatedWeatherHistory);
  };
  /////////////////////CONVERT ALL UNITS FOR INTERNATIONAL NORM/////////////////////////////////
  const convertToInternationalUnits = () => {
    const updatedWeatherHistory = weatherData.map((readData) => {
      switch (readData.type()) {
        case "Temperature":
          return readData.convertToC();
        case "Precipitation":
          return readData.convertToMM();
        case "Wind":
          return readData.convertToMS();
        default:
          return readData;
      }
    });

    return new WeatherHistory(place,type, period,updatedWeatherHistory);
  };
  ///////////////////ADD NEW DATA TO WEATHER HISTORY////////////////////////////////
  const add = (data) => WeatherHistory(place, type, period, [...weatherData, data]);
  ///////////////////RETRIEVE DATA FROM WEATHER HISTORY////////////////
  const data = () => weatherData;
  const including = (data) =>{
    let merged = weatherData.concat(data);
   return WeatherHistory(place, type, period, merged);
  };
  const lowestValue = () =>{
      let lowest;
    weatherData.filter((actualData)=>{
        if(lowest == undefined)
            lowest = actualData;
        else
        {
            if(actualData<lowest)
                return actualData;
            else
                return lowest; 
        }
      
  });
}
  ///////////////////RETRIEVE DATA FROM WEATHER HISTORY////////////////
  return {
    forType,
    forPeriod,
    forPlace,
    convertToUsUnits,
    convertToInternationalUnits,
    add,
    data,
    lowestValue,
    including
  };
};
let dateTest = DateInterval(new Date(2020,1,5),
new Date(2020,1,1));
console.log(dateTest.from() + "bla bla " + dateTest.to());

//#region Test of the Weather History

////////////////////////////////////TEST OF THE WEATHER HISTORY////////////////////////////////
let dateInterval = DateInterval(new Date(2018,09,31),new Date(2020,1,1));
let weatherHistory = WeatherHistory("Horsens","Temperature",dateInterval,[]);
///adding into the weather history
let weatherHistory2 = weatherHistory.add(data1);
let weatherHistory3 = weatherHistory2.add(data2);
let weatherHistory4 = weatherHistory3.add(data3);
let finalWeatherHistory = weatherHistory4.add(data4);
///retrieving data from weather history
console.log("ORIGINAL:"+ finalWeatherHistory.data().length);
for (let index = 0; index < finalWeatherHistory.data().length; index++) {
    console.log(finalWeatherHistory.data()[index].value() + " " + finalWeatherHistory.data()[index].unit());
}
/////////////////////CONVERT TO INTERNATIONAL UNIT AND BACK TEST/////////////////////////
console.log("CONVERT TO INTERNATIONAL:");
let internationals = finalWeatherHistory.convertToInternationalUnits();
for (let index = 0; index < internationals.data().length; index++) {
    console.log(internationals.data()[index].value() + " " + internationals.data()[index].unit());
}
console.log("ORIGINAL:");
for (let index = 0; index < finalWeatherHistory.data().length; index++) {
    console.log(finalWeatherHistory.data()[index].value() + " " + finalWeatherHistory.data()[index].unit());
}
internationals = finalWeatherHistory.convertToUsUnits();
console.log("CONVERT TO US:");
for (let index = 0; index < internationals.data().length; index++) {
    console.log(internationals.data()[index].value() + " " + internationals.data()[index].unit());
}

console.log("SORTED BY PLACE(WIND)): ");
let filterPlace = finalWeatherHistory.forPlace("Copenhagen");
for (let index = 0; index < filterPlace.data().length; index++) {
    console.log(filterPlace.data()[index].value() + " " + filterPlace.data()[index].unit());
}
console.log("SORTED BY PLACE(Temperature)): ");
filterPlace = finalWeatherHistory.forPlace("Horsens");
for (let index = 0; index < filterPlace.data().length; index++) {
    console.log(filterPlace.data()[index].value() + " " + filterPlace.data()[index].unit());
}

console.log("SORTED BY TYPE(Temperature)): ");
filterPlace = finalWeatherHistory.forType("Temperature");
for (let index = 0; index < filterPlace.data().length; index++) {
    console.log(filterPlace.data()[index].value() + " " + filterPlace.data()[index].unit());
}
console.log("SORTED BY DATE(humidity)): ");
filterPlace = finalWeatherHistory.forPeriod(dateInterval);
for (let index = 0; index < filterPlace.data().length; index++) {
    console.log(filterPlace.data()[index].value() + " " + filterPlace.data()[index].unit());
}

//#endregion
 
////////////////////WEATHERPREDICTION DATA FUNCTION//////////////////////////////
function WeatherPrediction(options)
{
    const matches = (data) =>
    {
        let matchesLet = false;
        if(data.type() == "Precipitation")
        {
            if(data.type() == options.type)
            {
                if(data.unit() != options.unit)
                {
                    if(data.unit() =="mm")
                        data.convertToInches();
                    else
                        data.convertToMM();
                }
                if(data.value() == options.value && data.place() == options.place && data.time().getTime() == options.time.getTime())
                {
                    for (let index = 0; index < (options.precTypes).length; index++) 
                    {
                        if(options.precTypes[index] == data.precipitationType())
                        {
                            matchesLet = true;
                            break;
                        }
                    }
                }
            }   
        }
        else if(data.type() == "Wind")
        {
            if(data.type() == options.type)
            {
                if(data.unit() != options.unit)
                {
                    if(data.unit() =="MPH")
                        data.convertToMS();
                    else
                        data.convertToMPH();
                }
                if(data.value() == options.value && data.place() == options.place && data.time().getTime() == options.time.getTime())
                {
                    for (let index = 0; index < (options.dirs).length; index++) 
                    {
                        if(options.dirs[index] == data.direction())
                        {
                            matchesLet = true;
                            break;
                        }
                      
                    }
                }
            }   
        }
        else if(data.type() == "Temperature")
        {  
            if(data.type() == options.type)
            {
                if(data.unit() != options.unit)
                {
                    if(data.unit() == "C")
                        data.convertToF();
                    else
                        data.convertToC();
                }
                if(data.value() == options.value && data.place() == options.place && data.time().getTime() == options.time.getTime())
                    matchesLet = true;
                
            }   
        }
        else
        {
            if(data.type() == options.type && data.value() == options.value && data.place() == options.place && data.time().getTime() == options.time.getTime())
                    matchesLet = true;
        }
        return matchesLet;
    };
    const to = () => Number(options.to);
    const from = () => Number(options.from);


    return Object.assign ({matches,to,from}, DataType(options), EventFunc(options));
};
////////////////////TEMPERATUREPREDICTION, WINDPREDICTION, PRECIPITATIONPREDICTION, CLOUDCOVERAGEPREDICTION//////////////
function TemperaturePrediction(unit,value,type,time,place,to,from)
{
    const options = { unit,value,type,time,place,to,from};

    const convertToF = () => 
    {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "C")
        {
            newValue = (options.value * 9/5) + 32;
            newUnit = "F";
        }

        return TemperaturePrediction(newUnit,newValue,type,time,place,to,from);
        
    };
    const convertToC = () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "F")
        {
            newValue = (options.value - 32) * 5/9;
            newUnit = "C";
        }

        return TemperaturePrediction(newUnit,newValue,type,time,place,to,from);
    };
    return Object.assign({convertToF, convertToC}, WeatherPrediction(options), WeatherData(options));
}; 
function WindPrediction(unit,value,type,time,place,dirs, to, from)
{
    const options = {dirs, unit, value, type, time, place, to, from};
    const directions = () => {
        return options.dirs;
    }
    const convertToMPH= () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "MS")
        {
            newValue = options.value * 2.237;
            newUnit = "MPH";
        }
        return WindPrediction(newUnit,newValue,type,time,place,dirs, to, from)
    }
    const convertToMS= () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "MPH")
        {
            newValue = options.value / 2.237;
            newUnit = "MS";
        }
        return WindPrediction(newUnit,newValue,type,time,place,dirs, to, from)
    }
    const matches = (data) =>
    {

    }

    return Object.assign({matches, directions, convertToMPH, convertToMS}, WeatherPrediction(options), WeatherData(options));
};
function PrecipitationPrediction(unit,value,type,time,place, precTypes, to, from)
{
    const options = {precTypes, unit, value, type, time, place, to, from };

    const precipitationTypes = () => {
        return options.precTypes;
    }
    
    const convertToInches = () => {
        let newValue=value;
        let newUnit=unit;
        if(options.unit == "mm")
        {
            newValue = options.value / 25,4;
            newUnit = "inches";
        }
        return PrecipitationPrediction(newUnit,newValue,type,time,place, precTypes, to, from);
    }
    const convertToMM = () => {
        let newValue = value;
        let newUnit = unit;
        if(options.unit == "inch")
        {
            newValue = options.value * 25,4;
            newUnit = "mm";
        }
        return PrecipitationPrediction(newUnit,newValue,type,time,place, precTypes, to, from);
   
     }

    return Object.assign({convertToInches, convertToMM, precipitationTypes}, WeatherPrediction(options),WeatherData(options));
};
function CloudCoveragePrediction(unit,value,type,time,place, to, from)
{
    const options = {unit, value, type, time, place, to, from };
    return Object.assign({}, WeatherPrediction(options), WeatherData(options));
};

/////////////////////WEATHER FORECAST/////////////////////////////
function WeatherForecast(place,type, period, predictionData)
{
  ////////////////VARIABLE, GETTER AND SETTERS FOR FILTERS/////////////////////
  const predData = [...predictionData];
  const forPlace = (newPlace) =>{
    let newData = predData.filter((data) => {
        return data.place() === newPlace;
      });
    return new WeatherForecast(place,type,period,newData);

  };

  //const forType = (newType) => (weatherDataType.filter = newType);
  const forType = (newType)=>{
    let newData = predData.filter((data)=>{
        return data.type() === newType;
          });
          return new WeatherForecast(place,type, period,newData);
  }
  
  const forPeriod = (newPeriod) =>{
    let newData = predData.filter((data)=>{
        return newPeriod.contains(data.time());
          });
          return new WeatherForecast(place,type, period,newData);
  }
  /////////////////////CONVERT ALL UNITS FOR US NORM/////////////////////////////////
  const convertToUsUnits = () => {
    const updatedWeatherHistory = predData.map((readData) => {
      switch (readData.type()) {
        case "Temperature":
          return readData.convertToF();
        case "Precipitation":
          return readData.convertToInches();
        case "Wind":
          return readData.convertToMPH();
        default:
          return readData;
      }
    });
    return new WeatherForecast(place,type, period,updatedWeatherHistory);
  };
  /////////////////////CONVERT ALL UNITS FOR INTERNATIONAL NORM/////////////////////////////////
  const convertToInternationalUnits = () => {
    const updatedWeatherHistory = predData.map((readData) => {
      switch (readData.type()) {
        case "Temperature":
          return readData.convertToC();
        case "Precipitation":
          return readData.convertToMM();
        case "Wind":
          return readData.convertToMS();
        default:
          return readData;
      }
    });

    return new WeatherForecast(place,type, period,updatedWeatherHistory);
  };
  ///////////////////ADD NEW DATA TO WEATHER HISTORY////////////////////////////////
  const add = (data) => WeatherForecast(place, type, period, [...predData, data]);
  ///////////////////RETRIEVE DATA FROM WEATHER HISTORY////////////////
  const data = () => predData;
  const including = (data) =>{
    let merged = predData.concat(data);
   return WeatherForecast(place, type, period, merged);
  };
  const averageFromValue = () =>
  {
    //no idea what this should return so it makes sense
    return Number(0);
    };
  const averageToValue = () =>{
    //no idea what this should return so it makes sense
    return Number(0);
    };

  ///////////////////RETRIEVE DATA FROM WEATHER HISTORY////////////////
  return {
    forType,
    forPeriod,
    forPlace,
    convertToUsUnits,
    convertToInternationalUnits,
    add,
    data,
    averageFromValue,
    including,
    averageToValue
  };
};