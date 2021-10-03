window.onload = appLoader;
var apiKey = "25eefc07a3a666558c043f66e4f22dd4";
var timeapikey = "DSPC3NAUU1BB";
var search_city = "";
var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
var citiesSearched = [];
var localTime = "";
function appLoader() {
	getCities();
	getCityWeather("Houston");
	var url =
		"api.openweathermap.org/data/2.5/weather?q=pune&appid=25eefc07a3a666558c043f66e4f22dd4";

	$("#search-btn").on("click", function () {
		var errorHolder = $("#error-holder");
		if (errorHolder) {
			errorHolder.remove();
		}
		search_city = $("#search-city").val().trim();
		if (search_city == "") {
			var errorSpan = $("<h5>")
				.addClass("text-danger")
				.attr("id", "error-holder")
				.html("Please enter the valid city name");
			$(".search-body").append(errorSpan);
			$("#search-city").focus();
			return false;
		}
		console.log("cityname = " + search_city);
		var coord = getCityWeather(search_city);
	});
}

function getCityWeather(city) {
	search_city = formatCityName(city);
	var coord1;
	var url = currentWeatherUrl + "q=" + city + "&appid=" + apiKey;
	console.log(url);
	fetch(url)
		.then(function (response) {
			if (!response.ok) {
				throw new Error("Failed to connect to api.openweathermap.org");
			}
			return response.json();
		})
		.then(function (data) {
			coord1 = data.coord;
			console.log(coord1);
		})
		.then(function () {
			console.log("coord3" + coord1.lon);
			getWeather(coord1.lon, coord1.lat);
		})
		.catch(function (error) {
			$(".current-weather").html(
				"<h5 class='text-danger text-center'>Unable to pull weather data for the city selected.</h5>"
			);
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
		});

	return coord1;
}

function getWeather(lon, lat) {
	var t = getLocalTime(lon, lat);
	//console.log("getWeather() " + lon + " " + lat + " " + t);
	var url =
		"https://api.openweathermap.org/data/2.5/onecall?lat=" +
		lat +
		"&lon=" +
		lon +
		"&exclude=hourly&units=imperial&appid=25eefc07a3a666558c043f66e4f22dd4";
	console.log(url);
	fetch(url)
		.then(function (response) {
			if (!response.ok) {
				throw new Error(
					" Unable to connect to https://api.openweathermap.org/data/2.5/onecall"
				);
			}
			return response.json();
		})
		.then(function (data) {
			displayCurrentWeatherCard(data.current);
			//	$(".five-day-forecast").empty();
			$(".five-day-forecast").empty();
			for (var i = 1; i <= 5; i++) {
				console.log(i);
				display5DayForecast(data.daily[i]);
			}
			setCities();
			$("#five-day-header").html("5-Day Forecast");
			getCities();
		})
		.catch(function (error) {
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
		});
}

function displayCurrentWeatherCard(c) {
	$(".current-weather").empty();
	console.log(c);
	var currentTime = moment.unix(c.dt).format("MM/DD/YYYY");
	var t = moment.unix(c.dt).format("MM/DD/YYYY HH:mm:ss");
	console.log("time in format" + t);
	// var a = moment.tz(t, "Asia/Kolkata");
	// console.log("time in IST " + moment.unix(a).format("MM/DD/YYYY HH:mm:ss"));
	// console.log(currentTime);

	var temp = c.temp;
	var wind = c.wind_speed;
	var humidity = c.humidity;
	var uvi = c.uvi;
	var iconcode = c.weather[0].icon;
	var desc = c.weather[0].description;
	var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
	console.log(
		temp + " " + wind + " " + humidity + " " + uvi + " " + iconcode + " " + desc
	);
	var div1 = $("<div>").addClass("card w-100 current-weather-card");
	var h3Elem = $("<h3>").addClass("card-header").html(search_city);
	//var h4Elem = $("<h6>").addClass("card-header").html(currentTime);
	var iconElem = $("<span>");
	iconElem.html(
		"<img id= 'wicon' src='" +
			iconurl +
			"' alt='Weather icon'>" +
			//"<br>" +
			"<span class='desc'>" +
			desc +
			"</span>" +
			"<br>" +
			"<span class ='span-time'>" +
			currentTime +
			"<span>"
	);
	h3Elem.append(iconElem);
	var divCardBody = $("<div>").addClass("card-body");
	var whtml = "	<p class='card-text'> Temp : " + temp + "&#8457; 		</p> ";
	whtml += "<p class='card-text'> Wind : " + wind + "MPH 		</p> ";
	whtml += "<p class='card-text'> Humidity :  " + humidity + "% 		</p> ";

	whtml += getUvi(uvi);
	divCardBody.html(whtml);
	div1.append(h3Elem, divCardBody);
	$(".current-weather").prepend(div1);
}
//https://api.openweathermap.org/data/2.5/weather?q=paris&appid=25eefc07a3a666558c043f66e4f22dd4
//https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&units=imperial&appid=25eefc07a3a666558c043f66e4f22dd4

function display5DayForecast(data5) {
	var currentTime = moment.unix(data5.dt).format("MM/DD/YYYY");
	console.log(currentTime);
	var temp = data5.temp.day;
	var wind = data5.wind_speed;
	var humidity = data5.humidity;
	var uvi = data5.uvi;
	var iconcode = data5.weather[0].icon;
	var desc = data5.weather[0].description;
	var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
	console.log(
		temp + " " + wind + " " + humidity + " " + uvi + " " + iconcode + " " + desc
	);

	var div1 = $("<div>").addClass("col");
	var div_card_body = $("<div>").addClass("card-body");
	var div_card = $("<div>").addClass("card");
	var card_header = $("<h3>")
		.addClass("card-header ")
		.html(
			//	"<h5 class='card-title desc'> " +
			"<span class ='span-time'>" +
				currentTime +
				"</span>" +
				//		"</h5>" +
				"	<p class='card-text '><span ><img  id= 'wicon' src='" +
				iconurl +
				"' alt='Weather icon'></span><br>" +
				"<span class='span-time'>" +
				desc +
				"</span>"
			// "<p class='card-text desc'>" +
			// desc +
			// "<p>"
		);

	var fhtml = "";
	//	var fhtml = "<h5 class='card-title bg-yellow'> " + currentTime + "</h5>";
	// fhtml +=
	// 	"	<p class='card-text'><span class='bg-yellow'><img  id= 'wicon' src='" +
	// 	iconurl +
	// 	"' alt='Weather icon'></span>" +
	// 	"<p class='card-text'>" +
	// 	desc +
	// 	"<p>";

	fhtml += "	<p class='card-text'> Temp : " + temp + "&#8457; 		</p> ";

	fhtml += "<p class='card-text'> Wind : " + wind + "MPH 		</p> ";
	fhtml += "<p class='card-text'> Humidity :  " + humidity + "% 		</p> ";
	fhtml += getUvi(uvi); //"<p class='card-text'> UV Index : " + uvi + "		</p>";
	div_card_body.html(fhtml);
	div_card.append(card_header, div_card_body);
	div1.append(div_card);
	$(".five-day-forecast").append(div1);
}
function setCities() {
	if (cities.indexOf(search_city) < 0) {
		cities.push(search_city);
		localStorage.setItem("cities-weather", JSON.stringify(cities));
	}
}
function getCities() {
	$(".city-list").empty();
	var citiesStr = localStorage.getItem("cities-weather");
	cities = !citiesStr ? [] : JSON.parse(citiesStr);
	for (var c in cities) {
		var liItem = $("<li>").addClass(
			"list-group-item city-list-item text-center text-light rounded "
		);
		liItem.attr("data-city", cities[c]);
		liItem.html(cities[c]);
		$(".city-list").append(liItem);
		liItem.on("click", function () {
			var city = $(this).attr("data-city").trim();
		//	$(this).attr("style", "background-color:#f8f9fa; color:gray;");
			getCityWeather(city);
		});
	}

	console.log(cities);
}

function formatCityName(arg) {
	return (arg.charAt(0).toUpperCase() + arg.slice(1)).trim();
}

function getUvi(uvi) {
	var html = "";
	var className = "";
	if (uvi < 3) className = "bg-success";
	else if (uvi < 7) className = "bg-warning";
	else if (uvi >= 7) className = "bg-danger";
	className += " uvi-span";
	html =
		"<p class='card-text'><span style='font-size=1rem' class=' " +
		className +
		"'>UV Index : " +
		uvi +
		"</span> 		</p>";
	return html;
}

function getLocalTime(lon, lat) {
	var url =
		"https://api.timezonedb.com/v2.1/get-time-zone?key=DSPC3NAUU1BB&format=xml&by=position&lat=" +
		lat +
		"&lng=" +
		lon;
	fetch(url)
		.then(function (response) {
			console.log("********************GET TIME**********");
			console.log(response);
			return response.text();
		})
		.then(function (data) {
			console.log(data);
			var i = data.indexOf("<formatted>");
			console.log("startIndex= " + i);
			i = Number(i) + "<formatted >".length;
			var j = data.indexOf("</formatted>");
			console.log("start = " + i + " endIndex= " + j);
			var time = data.substring(i - 1, j);
			localTime = time;
			return localTime;
		});
}
