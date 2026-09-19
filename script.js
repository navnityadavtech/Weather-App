const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let oldTab = userTab;
const API_KEY = "2f8578962f9f578eb41e895d8de36874";
oldTab.classList.add("current-tab");  
getFromSessionStorage();


function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search waala container is invisibile , if yes then make it visible 
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        }
        else{
            //your wheather tab vivsibile klarna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage()
        }

    }

}
userTab.addEventListener("click", () =>{
    //pass clicked tab as input parameter 
    switchTab(userTab);
});
searchTab.addEventListener("click",() =>{
       switchTab(searchTab);
});      
//check if coordinates are alredy present in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
        async function fetchUserWeatherInfo(coordinates){ 
        const{lat, lon} = coordinates;
        //make grant container invisible
        grantAccessContainer.classList.remove("active");
        //make loader visible
        loadingScreen.classList.add("active");

        //API CALL
        try{ 
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
             const data = await response.json();
             loadingScreen.classList.remove("active");
             renderWeatherInfo(data);}
             catch(err){
                   loadingScreen.classList.remove("active");
                   console.log(err);

             }            
    }
function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element 
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");
    
    //fetch value from weatherInfo object and put it UI elemnets
    cityName.innerText = weatherInfo?.name;
    countryIcon.src =
`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src =
`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
temp.innerText = `${weatherInfo?.main?.temp}°C`;
windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
humidity.innerText = `${weatherInfo?.main?.humidity} %`;
cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}  

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
          alert("Geolocation is not supported by your browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates
    ));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();    // Page reload mat karo
let cityName = searchInput.value;
    if(cityName ==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);

});
async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log("SEARCH API DATA:", data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(err) {

        loadingScreen.classList.remove("active");

        console.log("ERROR:", err);

        alert(err.message);
    }
}

async function fetchUserWeatherInfo(coordinates){ 

    const {lat, lon} = coordinates;

    // Grant Access container hide
    grantAccessContainer.classList.remove("active");

    // Loading screen show
    loadingScreen.classList.add("active");

    try { 

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log("USER LOCATION API DATA:", data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Loading hide
        loadingScreen.classList.remove("active");

        // Weather information show
        userInfoContainer.classList.add("active");

        // Data UI mein display
        renderWeatherInfo(data);

    }
    catch(err) {

        loadingScreen.classList.remove("active");

        console.log("ERROR:", err);

        alert(err.message);
    }
}