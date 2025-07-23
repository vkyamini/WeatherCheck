let apik = "1a7d50445be9f7e3f34e37489501e66c"
var submitBtn = document.querySelector('#submit_btn');
var currentLocation = document.querySelector('#currentLocation');
var inputBox = document.querySelector('#input_box')
var output_box = document.querySelector('#output_box');
let query;
let lat;
let lon;
let recommendations = [];

output_box.classList.add('output_box');

let Obj = {
   type: "",
        query: "",
        language: "",
        unit: "",
        name: "",
        country: "",
        region: "",
        lat: "",
        lon: "",
        timezone_id: "",
        localtime: "",
        localtime_epoch: "",
        utc_offset: "",
        observation_time: "",
        temperature: "",
        weather_code: "",
        weather_icons: "",
        weather_descriptions: "",
        sunrise: "",
        sunset: "",
        moonrise: "",
        moonset: "",
        moon_phase: "",
        moon_illumination: "",
        co: "",
        no2: "",
        o3: "",
        so2: "",
        pm2_5: "",
        pm10: "",
        // us_epa_index: "",
        // gb_defra_index: "",
        wind_speed: "",
        wind_degree: "",
        wind_dir: "",
        pressure: "",
        precip: "",
        humidity: "",
        cloudcover: "",
        feelslike: "",
        uv_index: "",
        visibility: "",
        is_day: ""
};

function updateObj(data){
    Obj = {
        type: data.request.type,
        query: data.request.query,
        language: data.request.language,
        unit: data.request.unit,
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        lat: data.location.lat,
        lon: data.location.lon,
        timezone_id: data.location.timezone_id,
        localtime: data.location.localtime,
        localtime_epoch: data.location.localtime_epoch,
        utc_offset: data.location.utc_offset,
        observation_time: data.current.observation_time,
        temperature: data.current.temperature,
        weather_code: data.current.weather_code,
        weather_icons: data.current.weather_icons.join(", "),
        weather_descriptions: data.current.weather_descriptions.join(", "),
        sunrise: data.current.astro.sunrise,
        sunset: data.current.astro.sunset,
        moonrise: data.current.astro.moonrise,
        moonset: data.current.astro.moonset,
        moon_phase: data.current.astro.moon_phase,
        moon_illumination: data.current.astro.moon_illumination,
        co: data.current.air_quality.co,
        no2: data.current.air_quality.no2,
        o3: data.current.air_quality.o3,
        so2: data.current.air_quality.so2,
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
        // us_epa_index: data.current.air_quality.us-epa-index,
        // gb_defra_index: data.current.air_quality.gb-defra-index,
        wind_speed: data.current.wind_speed,
        wind_degree: data.current.wind_degree,
        wind_dir: data.current.wind_dir,
        pressure: data.current.pressure,
        precip: data.current.precip,
        humidity: data.current.humidity,
        cloudcover: data.current.cloudcover,
        feelslike: data.current.feelslike,
        uv_index: data.current.uv_index,
        visibility: data.current.visibility,
        is_day: data.current.is_day,
};
        console.log("This is the OBJ created from Query",Obj);
        WeatherDisplay(data)
}

submitBtn.addEventListener('click',function(){
    output_box.innerHTML = "";
    query = inputBox.value.trim();
    console.log("inside button",query)
    fetch(`https://api.weatherstack.com/current?access_key=${apik}&query=${query}`)
    .then(function (response) {
    return response.json();
  })
  .then(function (data) {
   console.log("this is data",data);
   updateObj(data);
   });
updateObj()
});

currentLocation.addEventListener('click',()=>{
    console.log("clicked currentLocation");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        displaylatlon(lat, lon);  // ✅ Call it *after* coordinates are ready
      },
      (error) => {
        console.log("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
  

function displaylatlon(lat, lon) {
    output_box.innerHTML = "";
   fetch(`https://api.weatherstack.com/current?access_key=${apik}&query=${lat},${lon}`)
  .then(function(res){
    return res.json();
  })
  .then(function (data){
    updateObj(data);
}).catch(function (err){
    console.log(err.message);
  })
}
  

function WeatherDisplay(){
    
    var heading = document.createElement('p')
    var timeZone = document.createElement('p')
    var temp = document.createElement('p')
    var astrodiv = document.createElement('div')
    var airQuality = document.createElement('div')
    var wind = document.createElement('div')
    var airrec = document.createElement('p');
    
    airQuality.classList.add('airQuality')
    wind.classList.add('wind')
    astrodiv.classList.add('astrodiv')

    heading.innerHTML = `<strong>Location:</strong> ${Obj.name} ,${Obj.region}, ${Obj.country}`

    timeZone.innerHTML = `<strong>Local Date & Time:</strong> ${Obj.localtime} `

// <--------------------------------temp----------------------------------->
let tempdata = parseFloat(Obj.temperature);
let weatherCode = parseInt(Obj.weather_code);
let desc = "";
let gradient = "";

// Determine temperature description
if (tempdata <= 0) {
    desc = "Freezing 🧊";
    recommendations = "🚫 Do not go out — it's freezing cold. Stay warm indoors!";
} else if (tempdata <= 11) {
    desc = "Cold 🥶";
    recommendations = "🧥 Dress warmly with layers. A hot drink might help!";
  } else if (tempdata <= 18) {
    desc = "Cool 🌥";
    recommendations= "🧣 Light jacket recommended. It's a bit chilly.";
  } else if (tempdata <= 25) {
    desc = "Pleasant 😊";
    recommendations = "🌤️ Perfect weather for a walk or outdoor activities.";
  } else if (tempdata <= 32) {
    desc = "Warm 🌤";
    recommendations = "😎 Stay hydrated and wear light clothing.";
  } else if (tempdata <= 38) {
    desc = "Hot 🔥";
    recommendations = "🥵 Avoid heavy outdoor activity. Drink water regularly.";
  } else {
    desc = "Extreme Heat ☠️";
    recommendations = "☠️ Dangerously hot — stay indoors with cooling if possible.";
  }
// Blend temp + weatherCode to create animated gradient
if (weatherCode === 113) { // Clear
    gradient = tempdata > 30
      ? "linear-gradient(-45deg, #fbbc04, #f57c00, #ff6f00, #f44336)"
      : tempdata <= 18
      ? "linear-gradient(-45deg, #90caf9, #64b5f6, #4fc3f7, #29b6f6)"
      : "linear-gradient(-45deg, #fff176, #ffd54f, #ffb74d, #ff8a65)";
  } else if (weatherCode === 122) { // Overcast
    gradient = tempdata <= 18
      ? "linear-gradient(-45deg, #b0bec5, #90a4ae, #78909c, #607d8b)"
      : "linear-gradient(-45deg, #cfd8dc, #a1887f, #8d6e63, #6d4c41)";
  } else if ([296, 308, 302, 305].includes(weatherCode)) { // Rain
    gradient = "linear-gradient(-45deg, #4fc3f7, #29b6f6, #0288d1, #01579b)";
  } else if ([326, 338, 332].includes(weatherCode)) { // Snow
    gradient = "linear-gradient(-45deg, #e0f7fa, #b3e5fc, #81d4fa, #4fc3f7)";
  } else if (weatherCode === 200 || [386, 389].includes(weatherCode)) { // Thunder
    gradient = "linear-gradient(-45deg, #616161, #424242, #212121, #000000)";
  } else {
    gradient = tempdata <= 18
      ? "linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #38f9d7)"
      : "linear-gradient(-45deg, #ffb347, #ffcc33, #ff7e5f, #feb47b)";
  }
// Apply background
document.body.style.background = gradient;
let cloudCover = parseInt(Obj.cloudcover);
let cloudEmoji = "";

if (cloudCover <= 10) cloudEmoji = "☀️ Clear";
else if (cloudCover <= 40) cloudEmoji = "🌤️ Partly Cloudy";
else if (cloudCover <= 70) cloudEmoji = "🌥️ Mostly Cloudy";
else cloudEmoji = "☁️ Overcast";


// Update text
temp.innerHTML = `<strong>Weather Discription:</strong>${Obj.weather_descriptions}<br>
<strong>Present temperature is:</strong> ${tempdata}°C , it's ${desc} <br> feels like: ${Obj.feelslike}°C <br><br>
<strong>${cloudEmoji} (${cloudCover}%)</strong><br><br>
<strong style="color: #fff;">Recommendation:</strong> ${recommendations}`;
// <--------------------------------temp-----------------------------------> 

// <--------------------------------air----------------------------------->   
function getAirQualityStatus(value, pollutant) {
    const limits = {
      co: 9,
      no2: 53,
      o3: 100,
      so2: 75,
      pm2_5: 12,
      pm10: 50
    };

    const pm25 = parseFloat(Obj.pm2_5);
    let airEmoji = "";
    let airAdvice = "";

    if (pm25 <= 12) {
    airEmoji = "✅";
    airAdvice = "Air quality is good. Enjoy the fresh air!";
    } else if (pm25 <= 35) {
    airEmoji = "⚠️";
    airAdvice = "Moderate air quality.If you are Sensitive, it is recommended to limit long exposure.";
    } else if (pm25 <= 55) {
    airEmoji = "😷";
    airAdvice = "Unhealthy for sensitive groups. Limit outdoor activities.";
    } else if (pm25 <= 150) {
    airEmoji = "☠️";
    airAdvice = "Unhealthy air — best to stay indoors.";
    } else {
    airEmoji = "🛑";
    airAdvice = "Very unhealthy! Stay inside and wear a mask if you must go out.";
    }
    
    airrec.innerHTML = `
  
    <p style="margin-bottom: 8px;">
      <strong>${airEmoji} PM2.5:</strong> ${pm25} µg/m³
    </p>
    <p><strong style="color: #fff;">Recommendation: </strong>${airAdvice}</p>
   `;
  
    const val = parseFloat(value);
    const limit = limits[pollutant];
  
    if (val <= limit / 2) {
      return { emoji: "", label: "Good", color: "green"};
    } else if (val <= limit) {
      return { emoji: "⚠️", label: "Moderate", color: "orange" };
    } else {
      return { emoji: "☠️", label: "Unhealthy", color: "red"};
    }
  }
  
  const pollutants = {
    co: "Carbon Monoxide",
    no2: "Nitrogen Dioxide",
    o3: "Ozone",
    so2: "Sulfur Dioxide",
    pm2_5: "Fine Particles (PM2.5)",
    pm10: "Particles (PM10)"
  };
  
  let html = `<p style="font-size: 1.2rem; font-weight: 600; color: #fff; background: rgba(0, 0, 0, 0.2); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">🫁 Air Quality Overview 🫁</p>`;
  
  for (let key in pollutants) {
    const status = getAirQualityStatus(Obj[key], key);
    html += `
      <div style="margin-bottom: 20px;">
        <strong>${pollutants[key]}:</strong> ${Obj[key]}
        <span style="margin-left: 8px;">${status.emoji}</span>
        <span style="color: ${status.color}; font-weight: bold; margin-left: 4px;">${status.label}</span>
      </div>
    `;
  }

  airQuality.innerHTML = html;
  airQuality.append(airrec)
// <--------------------------------air----------------------------------->  

//   <-------------------------wind---------------------------------->  
const pressure = parseFloat(Obj.pressure);
let pressureStatus = "";

if (pressure < 1000) pressureStatus = "🌧️ Low Pressure (Possible rain)";
else if (pressure > 1020) pressureStatus = "☀️ High Pressure (Clear skies)";
else pressureStatus = "🌤️ Normal Pressure";

const precip = parseFloat(Obj.precip);
const humidity = parseFloat(Obj.humidity);

let precipEmoji = precip > 0 ? "🌧️ Precipitation" : "☀️ No Precipitation";
let humidityEmoji = "";

if (humidity <= 40) humidityEmoji = "💨 Dry";
else if (humidity <= 70) humidityEmoji = "💧 Comfortable";
else humidityEmoji = "😓 Humid";

const uv = parseInt(Obj.uv_index);
const visibility = parseFloat(Obj.visibility);
const isDay = Obj.is_day === "yes";

let uvEmoji = uv === 0 ? "🌙 No UV" :
              uv <= 2 ? "🧴 Low UV" :
              uv <= 5 ? "🌤️ Moderate UV" :
              uv <= 7 ? "☀️ High UV" :
              uv <= 10 ? "🔆 Very High UV" : "☠️ Extreme UV";

let visibilityEmoji = visibility < 2 ? "🌫️ Poor" :
                      visibility < 5 ? "🌁 Moderate" :
                      visibility < 10 ? "👁️ Good" : "🔭 Excellent";

let timeEmoji = isDay ? "☀️ Daytime" : "🌙 Night";

const windRecommendations = [];

// Pressure-based recommendation
if (pressure < 1000) {
  windRecommendations.push("🌧️ Low pressure — keep an umbrella handy just in case.");
} else if (pressure > 1020) {
  windRecommendations.push("☀️ High pressure — skies should be clear and calm.");
}else{
    windRecommendations.push(" ☀️ Normal presure - clear sky");
}

// Precipitation
if (precip > 0) {
  windRecommendations.push("🌂 Light rain expected — don’t forget your umbrella!");
}

// Humidity
if (humidity <= 40) {
  windRecommendations.push("💨 Dry air — moisturize your skin and stay hydrated.");
} else if (humidity > 70) {
  windRecommendations.push("😓 Humid conditions — wear breathable clothing.");
}else{
    windRecommendations.push( "💧 Comfortable humidity — ideal weather for outdoor activities.");
}
//wind speed
if (Obj.wind_speed > 20) {
  windRecommendations.push("🌬️ It's windy — avoid biking or outdoor sports.");
     }
    else{
        windRecommendations.push("🌬️ Gentle breeze — prfect for biking and flying kites.");
    }

// UV
if (uv > 7) {
    windRecommendations.push("🧴 UV is high — apply sunscreen and wear a hat if going out.");
  } else if (uv <= 2 && isDay) {
    windRecommendations.push("🌤️ Low UV — perfect for spending time outdoors.");
  } else if (uv > 2 && uv <= 7 && isDay) {
    windRecommendations.push("🕶️ Moderate UV — wear sunglasses and apply light sunscreen if you’ll be out for long.");
  }
  
// Visibility
if (visibility < 5) {
    windRecommendations.push("🌫️ Low visibility — drive carefully if you're heading out.");
  } else if (visibility >= 10) {
    windRecommendations.push("🔭 Excellent visibility — enjoy the scenic views!");
  } else {
    windRecommendations.push("👀 Moderate visibility — things might look a little hazy.");
  }
// Day/Night
if (!isDay) {
    windRecommendations.push("🌙 It’s nighttime — a good time to unwind and rest.");
  } else {
    windRecommendations.push("☀️ It's daytime — make the most of your day!");
  }


wind.innerHTML = ` 
  <p style="font-size: 1.2rem; font-weight: 600; color: #fff; background: rgba(0, 0, 0, 0.2); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);"><strong>🍃 Wind Overview</strong> 🍃</p>
  <p><strong>Wind Speed:</strong> ${Obj.wind_speed}km</p>
  <p><strong>Wind Direction:</strong> ${Obj.wind_dir}</p>
  <p><strong>Pressure:</strong> ${pressureStatus} (${pressure} hPa)</p>
  <p><strong>${precipEmoji} — ${precip} mm</strong></p>
  <p><strong>${humidityEmoji} — ${humidity}%</strong></p>
  <p><strong>${uvEmoji} — UV Index: ${uv}</strong></p>
  <p><strong>${visibilityEmoji} — Visibility: ${visibility} km</strong></p>
  <p><strong>${timeEmoji}</strong></p>
`;
wind.innerHTML += `
  <div style="margin-top: 1rem;">
    <p style="color: #fff;">
    <strong> 📝 Recommendations:</strong> 
    </p>
    <ul style="padding-left: 20px; list-style: none;">
        ${windRecommendations.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join("")}
   </ul>
  </div>
`;

//   <-------------------------wind---------------------------------->  
//   <-------------------------astro---------------------------------->  
const moonPhaseEmojis = {
    "New Moon": "🌑",
    "Waxing Crescent": "🌒",
    "First Quarter": "🌓",
    "Waxing Gibbous": "🌔",
    "Full Moon": "🌕",
    "Waning Gibbous": "🌖",
    "Last Quarter": "🌗",
    "Waning Crescent": "🌘"
  };
  const moonPhase = Obj.moon_phase;
  const moonEmoji = moonPhaseEmojis[moonPhase] || "🌙";
  astrodiv.innerHTML = `
  <div style="margin-bottom: 20px;">
    🌞 <strong>Sunrise:</strong> ${Obj.sunrise} &nbsp;&nbsp; 🌇 <strong>Sunset:</strong> ${Obj.sunset}
  </div>
  <div style="margin-bottom: 20px;">
    🌙 <strong>Moonrise:</strong> ${Obj.moonrise} &nbsp;&nbsp; 🌘 <strong>Moonset:</strong> ${Obj.moonset}
  </div>
  <div style="margin-bottom: 20px;">
    ${moonEmoji} <strong>Moon Phase:</strong> ${Obj.moon_phase} &nbsp;&nbsp;
    <strong>Moon Illumination:</strong> ${Obj.moon_illumination}%
  </div>
`;
// <-------------------------astro---------------------------------->    
   
output_box.append(heading)
output_box.append(timeZone)
output_box.append(temp)
output_box.append(wind)
output_box.append(airQuality)
output_box.append(astrodiv);
   
}


