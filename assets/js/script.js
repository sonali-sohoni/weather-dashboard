window.onload = appLoader;
var apiKey = "25eefc07a3a666558c043f66e4f22dd4";
var search_city = "";
var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";

function appLoader() {
	var url =
		"api.openweathermap.org/data/2.5/weather?q=pune&appid=25eefc07a3a666558c043f66e4f22dd4";

	$("#search-btn").on("click", function () {
		search_city = $("#search-city").val();
		console.log("cityname = " + search_city);
		var coord = getCurrentWeather(search_city);
	});
}

function getCurrentWeather(city) {
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
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
		});

	return coord1;
}

function getWeather(lon, lat) {
	console.log("getWeather() " + lon + " " + lat);
	var url =
		"https://api.openweathermap.org/data/2.5/onecall?lat=" +
		lat +
		"&lon=" +
		lon +
		"&exclude=hourly&units=imperial&appid=25eefc07a3a666558c043f66e4f22dd4";
	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			displayCurrentWeatherCard(data.current);

			for (var i = 0; i < 5; i++) {
				console.log(i);
				display5DayForecast(data.daily[i]);
			}
			//
		});
}

function displayCurrentWeatherCard(c) {
	// div class="card w-100">
	// 					<h5 class="card-header">Atlanta</h5>
	// 					<div class="card-body">
	// 						<h5 class="card-title">Special title treatment</h5>
	// 						<p class="card-text">
	// 							With supporting text below as a natural lead-in to additional
	// 							content.
	// 						</p>
	// 					</div>

	var currentTime = moment.unix(c.dt).format("dddd MMMM Do YYYY, hh:mm:ss");
	console.log(currentTime);
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
	var div1 = $("<div>").addClass("card w-100");
	var h3Elem = $("<h3>")
		.addClass("card-header")
		.html(search_city.charAt(0).toUpperCase() + search_city.slice(1));
	var h4Elem = $("<h4>").addClass("card-header").html(currentTime);
	var iconElem = $("<span>");
	iconElem.html("<img id= 'wicon' src='" + iconurl + "' alt='Weather icon'>");
	h3Elem.append(iconElem);
	var divCardBody = $("<div>").addClass("card-body");

	var whtml = "	<p class='card-text'> Temp : " + temp + "&#8457; 		</p> ";

	whtml += "<p class='card-text'> Wind : " + wind + "MPH 		</p> ";
	whtml += "<p class='card-text'> Humidity :  " + humidity + "% 		</p> ";
	whtml += "<p class='card-text'> UV Index : " + uvi + "		</p>";
	divCardBody.html(whtml);
	div1.append(h3Elem, h4Elem, divCardBody);
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
	var fhtml = "<h5 class='card-title'> " + currentTime + "</h5>";
	fhtml += "	<p class='card-text'> Temp : " + temp + "&#8457; 		</p> ";

	fhtml += "<p class='card-text'> Wind : " + wind + "MPH 		</p> ";
	fhtml += "<p class='card-text'> Humidity :  " + humidity + "% 		</p> ";
	fhtml += "<p class='card-text'> UV Index : " + uvi + "		</p>";
	div_card_body.html(fhtml);
	div_card.append(div_card_body);
	div1.append(div_card);
	$(".five-day-forecast").append(div1);
	// <div class="col">
	// 	<div class="card">
	// 		<div class="card-body">
	// 			<h5 class="card-title">Special title treatment</h5>
	// 			<p class="card-text">
	// 				With supporting text below as a natural lead-in to additional
	// 				content.
	// 			</p>
	// 			<a href="#" class="btn btn-primary">
	// 				Go somewhere
	// 			</a>
	// 		</div>
	// 	</div>
	// </div>;
}
