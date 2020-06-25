// Foursquare API Info
const clientId = 'RMKZ2LNFR1P03MN2JVKRMZRZ1MZWTVYE5AJFBAOYKI4L2VN4';
const clientSecret = 'ANGIKDJNAYHLB4FREE0XUDAEOH1M4SNV3EYQOWDG3YP50U4D';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = '2907547f5beb9d3b3ca0b5b251e29ba2';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city=$input.val();
  const today = new Date();
  const year =today.getFullYear();
  const ext=((today.getMonth()+1)<10?'0'+(today.getMonth()+1):(today.getMonth()+1));
  const month=ext;
  const date=today.getDate();
  
  const urlToFetch=`${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=${(year+month+date)}`;
 
try{
  const response=await fetch(urlToFetch);
  if(response.ok)
  {
    const jsonResponse = await response.json();
    const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
    console.log(venues);
    return venues;
  }
}
catch(error)
{
  console.log(error);
}

}

const getForecast = async () => {
  const urlToFetch=`${weatherUrl}?q=${$input.val()}&APPID=${openWeatherKey}`;
  try {
  const response = await fetch(urlToFetch);
  if (response.ok) {
    const jsonResponse = await response.json();
    return jsonResponse;
  }
}
  catch(error)
  {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  const weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues()
  .then(venues=>{
     renderVenues(venues);
  })
  getForecast()
  .then(forecast=>{
     renderForecast(forecast);
  })
  return false;
}

$submit.click(executeSearch)