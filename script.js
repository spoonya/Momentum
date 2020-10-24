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

  setTimeout(showDateTime, 1000);
};

//Add zero
const addZero = (n) => {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
};

//Set BG and greeting
const setBgGreet = () => {
  const TODAY = new Date(),
    HOURS = TODAY.getHours();

  if (HOURS >= 6 && HOURS < 12) {
    BODY_DOM.style.backgroundImage = 'url(assets/images/morning/06.jpg)';
    GREEETING_DOM.innerText = 'Good morning, ';
  } else if (HOURS >= 12 && HOURS < 18) {
    BODY_DOM.style.backgroundImage = 'url(assets/images/evening/05.jpg)';
    GREEETING_DOM.innerText = 'Good afternoon, ';
  } else if (HOURS >= 18 && HOURS < 24) {
    BODY_DOM.style.backgroundImage = 'url(assets/images/01.jpg)';
    GREEETING_DOM.innerText = 'Good evening, ';
  } else {
    BODY_DOM.style.backgroundImage = 'url(assets/images/day/05.jpg)';
    GREEETING_DOM.innerText = 'Good night, ';
  }
}

//Empty strings check
const isNotEmpty = (str) => {
  return (/([^\s])/.test(str));
};

//Set name
const setName = (itemName, e) => {
  if (e.type === 'keypress') {
    if (e.which === 13 || e.keyCode === 13) {
      if (!isNotEmpty(e.target.innerText)) {
        e.target.blur();
        return;
      }
      localStorage.setItem(itemName, e.target.innerText.replace(/\s+/g, ' ').trim());
      e.target.innerText = localStorage.getItem(itemName);
      e.target.blur();
    }
  } else if (isNotEmpty(e.target.innerText)) {
    localStorage.setItem(itemName, e.target.innerText.replace(/\s+/g, ' ').trim());
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
      localStorage.setItem('focus', e.target.value.replace(/\s+/g, ' ').trim());
      FOCUS_DOM.value = localStorage.getItem('focus');
      FOCUS_DOM.blur();
    }
  } else if (isNotEmpty(e.target.value)) {
    localStorage.setItem('focus', e.target.value.replace(/\s+/g, ' ').trim());
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
  // if (localStorage.getItem('name') === null) {
  //   NAME_DOM.innerText = '';
  // } else {
  //   placeholder = localStorage.getItem('name');
  // }
  // const clickEvent = new MouseEvent('click', {
  //   'view': window,
  //   'bubbles': true,
  //   'cancelable': false
  // });
  // e.target.dispatchEvent(clickEvent);

  if (e .target=== NAME_DOM) {
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
const getWeather = async () => {
  if (!localStorage.getItem('city')) return;

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY_DOM.innerText}&lang=en&appid=ad238bc7a61c1426e7873c1e86ee4cb1&units=metric`;
  const RES = await fetch(URL);
  const DATA = await RES.json();

  WEATHER_ICON_DOM.className = 'weather-icon owf';
  WEATHER_ICON_DOM.classList.add(`owf-${DATA.weather[0].id}`);
  WEATHER_TEMP_DOM.textContent = `${DATA.main.temp.toFixed(0)} °C`;
  WEATHER_WIND_DOM.textContent = `${DATA.wind.speed} m/s`;
  WEATHER_AIR_DOM.textContent = `${DATA.main.humidity.toFixed(0)} %`;
  WEATHER_DESCRIP_DOM.textContent = DATA.weather[0].description;
}

//Quotes
async function getQuote() {
  const URL = `https://api.chucknorris.io/jokes/random`;
  const RES = await fetch(URL);
  const DATA = await RES.json();
  QUOTE_DOM.textContent = DATA.value;
  // QUOTE_AUTHOR_DOM.textContent = DATA.quoteAuthor;
}
QUOTE_BTN.addEventListener('click', getQuote);


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

getQuote();
getLocalStorage();
getWeather();
showDateTime();
setBgGreet();
