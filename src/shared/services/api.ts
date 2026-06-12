import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_API_URL || "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
});
