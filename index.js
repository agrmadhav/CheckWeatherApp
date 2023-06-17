
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

app.get("/",(req,res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", async(req,res) => {
  let location =  await req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=a0fb0c0f3374ac48235379a41351ba37&units=metric`
  https.get(url,(response)=> {
    // console.log(response.statusCode);
    response.on ('data',(data) =>{
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
        const arrData = [weatherData];
        // console.log(arrData);
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
          console.log(realTimeData);
        res.write(realTimeData);
    })
  })
})

app.listen(3000, ()=>{
  console.log("app is listening on port no 3000");
})