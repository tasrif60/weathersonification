// Declare all variables
var latitude;
var longitude;
var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayTime = new Date();
var weatherId;
var rainy = [18, 12];
var sunny = [1,2,3,4,5,6, 23, 20, 21, 17,16,14,30];
var windy = [38, 37,36,35,34,33,32, 39,40,41,42];
var cloudy = [7, 8,11, 13, 15, 19,38, 43, 44];
const msg = new SpeechSynthesisUtterance();
var bufferLoader;
var temprature;
var isPlayingAnySong = false;
var flag = false;



// Main load call

window.onload= function(){
loadWebAudioApi();
getLocation();
setInterval(function() {console.log("");}, 50000);
setInterval(showPosition, 50000);
}


// Loading Web Audio Api 

function loadWebAudioApi() {
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
}


// To recite current time and date
$('#time').click(() => {
	msg.text = "It's " + week[dayTime.getDay()] + "and the time is" + (dayTime.getHours()%12) + dayTime.getMinutes() + (dayTime.getHours()/12 > 0 ? "PM" : "AM");
	toggle();
})

function daytimespeech(){

    msg.text = "It's " + week[dayTime.getDay()] + "and the time is" + (dayTime.getHours()%12) + dayTime.getMinutes() + (dayTime.getHours()/12 > 0 ? "PM" : "AM");
    console.log(dayTime.getHours()%12);
    msg.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English');

    toggle();
    
}




function nowPlay() {

	bufferLoader = new BufferLoader(
          context,
          [
             song
          ],
          finishedLoading 
        );
    bufferLoader.load();
}


function toggle() {
	speechSynthesis.cancel();
	speechSynthesis.speak(msg);
}

//Current Date Time
var today = dayTime.getDay();
document.getElementById("current-day").innerHTML = week[today];
document.getElementById("current-date").innerHTML = dayTime.getDate();
document.getElementById("month").innerHTML = month[dayTime.getMonth()];


// Next 6 days
document.getElementById("day1").innerHTML = week[today+1];
document.getElementById("day2").innerHTML = week[today+2];
document.getElementById("day3").innerHTML = week[today+3];
document.getElementById("day4").innerHTML = week[today+4];
document.getElementById("day5").innerHTML = week[today+5];
document.getElementById("day6").innerHTML = week[today+6];




document.getElementById("pause").addEventListener("click", function(){


    if (isPlayingAnySong){
        playOrPauseMusic();
    }

});


//Play and Pause music

function playOrPauseMusic() {

	nowPlay();
}


// Declare Music Array

function musicArray(weatherId) {
	
	if(jQuery.inArray(weatherId, rainy) !== -1) {
		song = "audio/rain.wav";
		playOrPauseMusic();
	}
	else if(jQuery.inArray(weatherId, sunny) !== -1) {
		song = "audio/Sunny.mp3";
		playOrPauseMusic();
	}
	else if(jQuery.inArray(weatherId, windy) !== -1) {
		song = "audio/Wind.wav";
		playOrPauseMusic();
	}
	else {
		song = "audio/Storm.mp3";
		playOrPauseMusic();
	}
}


var selectElement = document.getElementById("songs").addEventListener("change", function (e) {
	flag = true;
	song = e.target.value;
});
//For Speaking Current Condition

function speakCurrentCondition() {
	
	msg.text = "It's " + temprature + " outside and weather condition is " + weatherCondition;
	if(!isPlayingAnySong) {
		toggle();
	}
}

// For playing music using 'Enter' key word

document.addEventListener('keydown', logKey);

function logKey(e) {

	if(e.keyCode === 13){
		speakCurrentCondition();
		if(flag) {
			playOrPauseMusic();
		}
		else {
			musicArray(weatherId);
		}
    }
    
    if (e.keyCode === 16){
        daytimespeech()
    }
    else{
        console.log("speech not available")
    }
  
}



// Get weather data

function getLocation(){

    if (navigator.geolocation){

        navigator.geolocation.getCurrentPosition(givePosition);
    }
    else {
        console.log("error... cannot handle")
    }
}


function givePosition(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	showPosition();
}

function showPosition(){

    const api_url = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=';
    var key = '18DNUvvLJK0MYqToBzWEVxl6kCdyEUqD';
    let locationMain = document.querySelector('.location-main');
    let temperatureMain = document.querySelector('.num');
    let dayToday = document.querySelector('.day-today');
    let dateToday = document.querySelector('.date-today');
        $.get( api_url + key + "&q=" + latitude + "%2C" + longitude, function( data ){

            var currentConditionAPI = "http://dataservice.accuweather.com/currentconditions/v1/";
            var locationKey = data.Key;
            $('#city').html(data.LocalizedName);
            

            // Current weather condition

            $.get(currentConditionAPI + locationKey+ "?apikey=" + key, function(weather){

                $('#current_temp').html(weather[0].Temperature.Metric.Value);


                // Showing weather icon based on different conditions
                let iconNo = weather[0].WeatherIcon;
                if (iconNo >= 1 || iconNo < 11){    
                    document.getElementById("main_icon").src = "images/icons/icon-2.svg";
                }
                else if (iconNo>= 11 || iconNo< 22){
                    document.getElementById("main_icon").src = "images/icons/icon-8.svg";
                }
                else if (iconNo >= 22 || iconNo < 33){
                    document.getElementById("main_icon").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("main_icon").src = "images/icons/icon-12.svg";
                }


                // Showing different background depends on different conditions


                /*if (iconNo >= 1 || iconNo < 11){    
                    document.getElementById("banner").src= "images/back/clear.jpg";
                }
                else if (iconNo>= 11 || iconNo< 22){
                    document.getElementById("banner").src = "images/back/windy.jpg";
                }
                else if (iconNo >= 22 || iconNo < 33){
                    document.getElementById("banner").src = "images/back/rainy.jpg";
                }
                else{
                    document.getElementById("banner").src = "images/back/stormy.jpg";
                }
                */





                //Current weather condition in text

                $('#condition').html(weather[0].WeatherText);

                // Day night condition show
                if (weather[0].IsDayTime){
                    $('#daynight').html("Day")
                }
                else{
                    $('#daynight').html("Night")
                }


                if (weatherId != weather[0].WeatherIcon) {
                    weatherId = weather[0].WeatherIcon;
                }

                temprature = weather[0].Temperature.Metric.Value + '\xB0' + weather[0].Temperature.Metric.Unit;
                weatherCondition = weather[0].WeatherText;


                


            });


            var forcastAPI = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"


            $.get(forcastAPI + locationKey+ "?apikey=" + key, function(forcast){

            

                //1st day forcast
                let firstDayicon = forcast.DailyForecasts[0].Day.Icon.Value
                if (firstDayicon >= 1 || firstDayicon < 11){    
                    document.getElementById("forcast_1").src = "images/icons/icon-2.svg";
                }
                else if (firstDayicon>= 11 || firstDayicon< 22){
                    document.getElementById("forcast_1").src = "images/icons/icon-6.svg";
                }
                else if (firstDayicon >= 22 || firstDayicon < 33){
                    document.getElementById("forcast_1").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_1").src = "images/icons/icon-14.svg";
                }


                $('#firstDayMax').html(forcast.DailyForecasts[0].Temperature.Maximum.Value);
                $('#firstDayMin').html(forcast.DailyForecasts[0].Temperature.Minimum.Value);

                //2nd day forcast

                let secondDayicon = forcast.DailyForecasts[1].Day.Icon.Value
                if (secondDayicon >= 1 || secondDayicon < 11){    
                    document.getElementById("forcast_2").src = "images/icons/icon-2.svg";
                }
                else if (secondDayicon>= 11 || secondDayicon< 22){
                    document.getElementById("forcast_2").src = "images/icons/icon-6.svg";
                }
                else if (secondDayicon >= 22 || secondDayicon < 33){
                    document.getElementById("forcast_2").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_2").src = "images/icons/icon-14.svg";
                }

                $('#secondDayMax').html(forcast.DailyForecasts[1].Temperature.Maximum.Value);
                $('#secondDayMin').html(forcast.DailyForecasts[1].Temperature.Minimum.Value);


                //3rd day forcasr

                let thirdDayicon = forcast.DailyForecasts[2].Day.Icon.Value
                if (thirdDayicon >= 1 || thirdDayicon < 11){    
                    document.getElementById("forcast_3").src = "images/icons/icon-2.svg";
                }
                else if (thirdDayicon>= 11 || thirdDayicon< 22){
                    document.getElementById("forcast_3").src = "images/icons/icon-6.svg";
                }
                else if (thirdDayicon >= 22 || thirdDayicon < 33){
                    document.getElementById("forcast_3").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_3").src = "images/icons/icon-14.svg";
                }


                $('#thirdDayMax').html(forcast.DailyForecasts[2].Temperature.Maximum.Value);
                $('#thirdDayMin').html(forcast.DailyForecasts[2].Temperature.Minimum.Value);

                //4th day forcast

                let fourthDayicon = forcast.DailyForecasts[3].Day.Icon.Value
                if (fourthDayicon >= 1 || fourthDayicon < 11){    
                    document.getElementById("forcast_4").src = "images/icons/icon-2.svg";
                }
                else if (fourthDayicon>= 11 || fourthDayicon< 22){
                    document.getElementById("forcast_4").src = "images/icons/icon-6.svg";
                }
                else if (fourthDayicon >= 22 || fourthDayicon < 33){
                    document.getElementById("forcast_4").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_4").src = "images/icons/icon-14.svg";
                }


                $('#fourthDayMax').html(forcast.DailyForecasts[3].Temperature.Maximum.Value);
                $('#fourthDayMin').html(forcast.DailyForecasts[3].Temperature.Minimum.Value);


                //5th day forcast
                let fifthDayicon = forcast.DailyForecasts[4].Day.Icon.Value
                if (fifthDayicon >= 1 || fifthDayicon < 11){    
                    document.getElementById("forcast_5").src = "images/icons/icon-2.svg";
                }
                else if (fifthDayicon>= 11 || fifthDayicon< 22){
                    document.getElementById("forcast_5").src = "images/icons/icon-6.svg";
                }
                else if (fifthDayicon >= 22 || fifthDayicon < 33){
                    document.getElementById("forcast_5").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_5").src = "images/icons/icon-14.svg";
                }

                $('#fifthDayMax').html(forcast.DailyForecasts[4].Temperature.Maximum.Value);
                $('#fifthDayMin').html(forcast.DailyForecasts[4].Temperature.Minimum.Value);


                //6th day forcast

                let sixthDayicon = forcast.DailyForecasts[0].Day.Icon.Value
                if (sixthDayicon >= 1 || sixthDayicon < 11){    
                    document.getElementById("forcast_6").src = "images/icons/icon-2.svg";
                }
                else if (sixthDayicon>= 11 || sixthDayicon< 22){
                    document.getElementById("forcast_6").src = "images/icons/icon-6.svg";
                }
                else if (sixthDayicon >= 22 || sixthDayicon < 33){
                    document.getElementById("forcast_6").src = "images/icons/icon-11.svg";
                }
                else{
                    document.getElementById("forcast_6").src = "images/icons/icon-14.svg";
                }


                $('#sixthDayMax').html(forcast.DailyForecasts[0].Temperature.Maximum.Value);
                $('#sixthDayMin').html(forcast.DailyForecasts[0].Temperature.Minimum.Value);




            });




        });
        
        
        
    }




    var source;
    function finishedLoading(bufferList){
        
        if (!isPlayingAnySong) {
            source = context.createBufferSource();
            source.buffer = bufferList[0];
            source.connect(context.destination);
            source.loop = true;
            source.start(0);
            isPlayingAnySong = true;
            document.getElementById("pause").disabled = false;
        } else {
            document.getElementById("pause").disabled = true;
            source.stop(0);
            isPlayingAnySong = false;
        }
    }      

/// Buffer loader part
    
    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
      }
      
      BufferLoader.prototype.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
      
        var loader = this;
      
        request.onload = function() {
          // Asynchronously decode the audio file data in request.response
          loader.context.decodeAudioData(
            request.response,
            function(buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              loader.bufferList[index] = buffer;
              if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
              console.error('decodeAudioData error', error);
            }
          );
        }
      
        request.onerror = function() {
          alert('BufferLoader: XHR error');
        }
      
        request.send();
      }
      
      BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
      }
      

        
        




    




