const TIME_DOM = document.querySelector('.time'),
  DATE_DOM = document.querySelector('.date'),
  GREEETING_DOM = document.querySelector('.greeting'),
  NAME_DOM = document.querySelector('.name'),
  FOCUS_DOM = document.querySelector('.focus'),
  BODY_DOM = document.body,
  WEATHER_CITY_DOM = document.querySelector('.weather-city'),
  WEATHER_TEMP_DOM = document.querySelector('.weather-temperature'),
  WEATHER_DESCRIP_DOM = document.querySelector('.weather-description'),
  WEATHER_WIND_DOM = document.querySelector('.weather-wind'),
  WEATHER_AIR_DOM = document.querySelector('.weather-air'),
  WEATHER_ICON_DOM = document.querySelector('.weather-icon'),
  QUOTE_DOM = document.querySelector('.quote-txt'),
  // QUOTE_AUTHOR_DOM = document.querySelector('.quote-author'),
  IMG_CHANGE_BTN = document.querySelector('.img-change'),
  QUOTE_BTN = document.querySelector('.quote-btn');

let placeholder = ['[Enter your name]', '[Enter your city]'];

//Time
const showDateTime = () => {
  const TODAY = new Date();
  HOUR = TODAY.getHours(),
    MIN = TODAY.getMinutes(),
    SEC = TODAY.getSeconds(),
    DAY_WEEK = TODAY.toLocaleString('en-us', {
      weekday: 'long'
    }),
    MONTH = TODAY.toLocaleString('en-us', {
      month: 'long'
    }),
    DAY_MONTH = TODAY.toLocaleString('en-us', {
      day: 'numeric'
    });

  //Output
  TIME_DOM.innerHTML = `${HOUR}:${addZero(MIN)}:${addZero(SEC)}`;
  DATE_DOM.innerHTML = `${DAY_WEEK}, ${MONTH} ${DAY_MONTH}`;

  if (MIN === 0 & SEC === 0) {
    setBgGreet();
  }

  setTimeout(showDateTime, 1000);
};

//Add zero
const addZero = (n) => {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
};

//Empty strings check
const isNotEmpty = (str) => {
  return (/([^\s])/.test(str));
};

//Delete spaces
const removeSpaces = (str) => {
  return str.replace(/\s+/g, ' ').trim();
}

//Set name
const setName = (itemName, e) => {
  if (e.type === 'keypress') {
    if (e.which === 13 || e.keyCode === 13) {
      if (!isNotEmpty(e.target.innerText)) {
        e.target.blur();
        return;
      }
      localStorage.setItem(itemName, removeSpaces(e.target.innerText));
      e.target.innerText = localStorage.getItem(itemName);
      e.target.blur();
    }
  } else if (isNotEmpty(e.target.innerText)) {
    localStorage.setItem(itemName, removeSpaces(e.target.innerText));
    e.target.innerText = localStorage.getItem(itemName);
    if (e.target === WEATHER_CITY_DOM) {
      getWeather();
    }
  } else {
    if (e.target === NAME_DOM) {
      e.target.innerText = placeholder[0];
    } else if (e.target === WEATHER_CITY_DOM) {
      e.target.innerText = placeholder[1];
    }
  }
};

//Set city
const setCity = setName;

//Set focus
const setFocus = (e) => {
  if (e.type === 'keypress') {
    if (e.which === 13 || e.keyCode === 13) {
      if (!isNotEmpty(e.target.value)) {
        FOCUS_DOM.blur();
        return;
      }
      localStorage.setItem('focus', removeSpaces(e.target.value));
      FOCUS_DOM.value = localStorage.getItem('focus');
      FOCUS_DOM.blur();
    }
  } else if (isNotEmpty(e.target.value)) {
    localStorage.setItem('focus', removeSpaces(e.target.value));
    FOCUS_DOM.value = localStorage.getItem('focus');
  } else {
    if (localStorage.getItem('focus') !== null) {
      FOCUS_DOM.value = localStorage.getItem('focus');
    }
  }
};

//Read local storage
const getLocalStorage = () => {
  if (localStorage.getItem('focus') !== null) {
    FOCUS_DOM.value = localStorage.getItem('focus');
  }

  if (localStorage.getItem('name') === null) {
    NAME_DOM.innerText = placeholder[0];
  } else {
    NAME_DOM.innerText = localStorage.getItem('name');
  }

  if (localStorage.getItem('city') === null) {
    WEATHER_CITY_DOM.innerText = placeholder[1];
  } else {
    WEATHER_CITY_DOM.innerText = localStorage.getItem('city');
  }
};

//Placeholder
const placeholderSetRemove = (e) => {
  if (e.target === NAME_DOM) {
    NAME_DOM.innerText = '';
    if (localStorage.getItem('name')) {
      placeholder[0] = localStorage.getItem('name');
    }
  } else if (e.target === FOCUS_DOM) {
    FOCUS_DOM.value = '';
  } else if (e.target === WEATHER_CITY_DOM) {
    WEATHER_CITY_DOM.innerText = '';
    if (localStorage.getItem('city')) {
      placeholder[1] = localStorage.getItem('city');
    }
  }
};

//Weather
const getWeather = async (posUrl = '') => {
  try {
    let url;
    if (!posUrl) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY_DOM.innerText}&lang=en&appid=ad238bc7a61c1426e7873c1e86ee4cb1&units=metric`;
    } else {
      url = posUrl;
    }

    const RES = await fetch(url);
    const DATA = await RES.json();

    localStorage.setItem('city', DATA.name);
    WEATHER_CITY_DOM.innerText = DATA.name;
    WEATHER_ICON_DOM.className = 'weather-icon owf';
    WEATHER_ICON_DOM.classList.add(`owf-${DATA.weather[0].id}`);
    WEATHER_TEMP_DOM.textContent = `${DATA.main.temp.toFixed(0)} °C`;
    WEATHER_WIND_DOM.textContent = `${DATA.wind.speed} m/s`;
    WEATHER_AIR_DOM.textContent = `${DATA.main.humidity.toFixed(0)} %`;
    WEATHER_DESCRIP_DOM.textContent = DATA.weather[0].description;
  } catch {
    localStorage.removeItem('city');
    placeholder[1] = '[Enter your city]';
    WEATHER_CITY_DOM.textContent = placeholder[1];
    WEATHER_TEMP_DOM.textContent = '';
    WEATHER_WIND_DOM.textContent = '';
    WEATHER_AIR_DOM.textContent = '';
    WEATHER_DESCRIP_DOM.textContent = '';
    alert('City not found');
  }
}

const getCurPos = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      getWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ad238bc7a61c1426e7873c1e86ee4cb1&units=metric`);
    });
  } else {
    return;
  }
};

//Quotes
async function getQuote() {
  const URL = `https://api.chucknorris.io/jokes/random`;
  const RES = await fetch(URL);
  const DATA = await RES.json();
  QUOTE_DOM.textContent = DATA.value;
  // QUOTE_AUTHOR_DOM.textContent = DATA.quoteAuthor;
}
QUOTE_BTN.addEventListener('click', getQuote);

//Img change
const PATH_BASE = 'assets/images/';
const IMG_NAME_TEMPLATE = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const IMG_PATH_TEMPLATE = ['morning/', 'day/', 'evening/', 'night/'];
let imgArr = [];
let idxChange = 0;

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

const createImgArr = () => {
  shuffleArray(IMG_NAME_TEMPLATE);
  for (let i = 0; i < 4; i++) {
    imgArr[i] = [];
    for (let j = 0; j < 6; j++) {
      imgArr[i][j] = PATH_BASE + IMG_PATH_TEMPLATE[i] + IMG_NAME_TEMPLATE[j];
    }
  }
  console.log(imgArr);
  imgArr = imgArr.flat();
};

//Set BG and greeting
const setBgGreet = () => {
  const TODAY = new Date(),
    HOURS = TODAY.getHours(),
    DELAY = 3600000 - TODAY.getMinutes() * 60000;

  // setTimeout(setBgGreet, DELAY);
  let idxHour = 0;

  if (HOURS >= 6 && HOURS < 12) {
    idxHour = Math.abs(6 - HOURS);
    BODY_DOM.style.backgroundImage = `url(${imgArr[idxHour]})`;
    GREEETING_DOM.innerText = 'Good morning, ';
  } else if (HOURS >= 12 && HOURS < 18) {
    idxHour = Math.abs(6 - HOURS);
    BODY_DOM.style.backgroundImage = `url(${imgArr[idxHour]})`;
    GREEETING_DOM.innerText = 'Good afternoon, ';
  } else if (HOURS >= 18 && HOURS < 24) {
    idxHour = Math.abs(6 - HOURS);
    BODY_DOM.style.backgroundImage = `url(${imgArr[idxHour]})`;
    GREEETING_DOM.innerText = 'Good evening, ';
  } else {
    idxHour = Math.abs(6 - imgArr.length - HOURS);
    BODY_DOM.style.backgroundImage = `url(${imgArr[idxHour]})`;
    GREEETING_DOM.innerText = 'Good night, ';
    console.log(imgArr[idxHour]);
  }

  idxChange = idxHour;
  console.log(DELAY / 60000 + ' min to change');
  console.log(idxChange);
  console.log(imgArr[idxHour]);
}

const viewBgImage = (data) => {
  const SRC = data;
  const IMG = document.createElement('img');
  IMG.src = SRC;
  console.log(SRC);
  IMG.onload = () => {
    BODY_DOM.style.backgroundImage = `url(${SRC})`;
  };
}

const getImage = () => {
  ++idxChange;
  if (idxChange === 24) idxChange = 0;
  console.log(idxChange);
  const IMG_SRC = imgArr[idxChange];
  viewBgImage(IMG_SRC);
  IMG_CHANGE_BTN.disabled = true;
  setTimeout(() => {
    IMG_CHANGE_BTN.disabled = false
  }, 1100);
}

//Calling
NAME_DOM.addEventListener('keypress', () => setName('name', event));
NAME_DOM.addEventListener('blur', () => setName('name', event));
NAME_DOM.addEventListener('click', placeholderSetRemove);

FOCUS_DOM.addEventListener('keypress', setFocus);
FOCUS_DOM.addEventListener('blur', setFocus);
FOCUS_DOM.addEventListener('click', placeholderSetRemove);

WEATHER_CITY_DOM.addEventListener('keypress', () => setCity('city', event));
WEATHER_CITY_DOM.addEventListener('blur', () => setCity('city', event));
WEATHER_CITY_DOM.addEventListener('click', placeholderSetRemove);

IMG_CHANGE_BTN.addEventListener('click', getImage);

getLocalStorage();
localStorage.getItem('city') === null ? getCurPos() : getWeather();
getQuote();
createImgArr();
setBgGreet();
showDateTime();