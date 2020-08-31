
let date = document.getElementById("date");
let time = document.getElementById("time");

let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let rain = document.getElementById("rain");
let windvel = document.getElementById("wind");

let weathericon = document.getElementById("simpic");

let chart = document.getElementById("weathercharts");

//Set your Api-ID
const apiid = '';

var times = [];

function setup(){

    var today = new Date();
    date.innerHTML = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    if(today.getMinutes() < 10){
        time.innerHTML = `${today.getHours()}:0${today.getMinutes()}`;
    }else{
        time.innerHTML = `${today.getHours()}:${today.getMinutes()}`;
    }

    for(let i = 0; i<=10; i++){
        times.push((today.getHours() + i) % 24 + ':00');
    }

}

//two functions for current and forecast data respectively bc of different API Keys
function currentdatarequest(){
    var request = new XMLHttpRequest();
    let apistring = `http://api.openweathermap.org/data/2.5/weather?id=2911298&appid=${apiid}&units=metric`;
    
    request.open('GET', apistring, true);
    request.addEventListener('load', function(event){
        if(request.status >= 200 && request.status < 300){
            data = JSON.parse(request.responseText);
            console.log(data);
            updatecurrentdata(data);
            forecastdatarequest(data);
        }else{
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
    
}

function updatecurrentdata(data){
    city.innerHTML = `${data.name}, ${data.sys.country}`;
    temperature.innerHTML = `${data.main.temp}°C`;
    windvel.innerHTML = `${data.wind.speed}m/s`;

    weathericon.innerHTML = `<img src = "pics/${data.weather[0].icon}.png" height = "300"/>`;
}

function forecastdatarequest(data){
    var request = new XMLHttpRequest();

    let apistring = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&%20exclude=minutely&appid=${apiid}&units=metric`;
    
    request.open('GET', apistring, true);
    request.addEventListener('load', function(event){
        if(request.status >= 200 && request.status < 300){
            fdata = JSON.parse(request.responseText);
            console.log(fdata);
            updateforecastdata(fdata);
            createChart(fdata);
        }else{
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

function updateforecastdata(data){
    if(data.current.hasOwnProperty("rain")){
        rain.innerHTML = `${data.current.rain['1h']}mm/h`;
    }
    else{
        rain.innerHTML = "0mm/h";
    }
}

function createChart(data){

    //get Forecasts
    let tempforecasts = [];
    for(let i = 0; i<=10; i++){
        tempforecasts.push(data.hourly[i].temp);
    }

    let rainforecasts = [];
    for(let i = 0; i<=10; i++){
        if(data.hourly[i].hasOwnProperty("rain")){
            rainforecasts.push(data.hourly[i].rain['1h']);
        }
        else{
            rainforecasts.push(0);
        }
    }
    
    console.log(times);
    console.log(tempforecasts);
    console.log(rainforecasts);

    let graphChart = new Chart(chart, {
        type: 'bar',
        data:{
            labels: times,
            datasets:[{
                label:'Temperature [°C]',
                data: tempforecasts,
                backgroundColor: 'red',
                hoverBorderWidth: 2,
                hoverBorderColor: 'black',
                order: 2
            },{
                label:'Rain [mm/h]',
                data: rainforecasts,
                backgroundColor: 'blue',
                order: 1,

                type: 'line'
            }],
        },
        options:{
            title:{
                display:true,
                text:'Weather Forecasts',
                fontSize: 25
            },
            legend:{
                position:'bottom',
                labels:{
                    fontColor: 'grey'
                }
            }
        }
    });

}

setup();
currentdatarequest();

