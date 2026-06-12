export interface WeatherCoord {
  lon: number;
  lat: number;
}

export interface WeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherDataResponse {
  coord: WeatherCoord;
  weather: WeatherInfo[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: {
    all: number;
  };
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: WeatherMain & { temp_kf?: number };
  weather: WeatherInfo[];
  clouds: { all: number };
  wind: WeatherWind;
  visibility: number;
  pop: number; // Probability of precipitation
  sys: { pod: string };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: WeatherCoord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
