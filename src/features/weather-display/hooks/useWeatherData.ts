import { useEffect, useState } from "react";
import { apiClient } from "../../../shared/services/api";
import { ForecastItem, ForecastResponse } from "../../../types";

export interface FormattedHourlyItem {
  time: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface FormattedForecastItem {
  dayName: string;
  dateStr: string;
  tempMax: number;
  tempMin: number;
  icon: string;
  condition: string;
}

export const useWeatherData = (lat: number, lon: number, cityName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hourly, setHourly] = useState<FormattedHourlyItem[]>([]);
  const [forecast, setForecast] = useState<FormattedForecastItem[]>([]);

  useEffect(() => {
    const fetchWeatherDetails = async () => {
      if (!lat && !lon) return;

      setLoading(true);
      setError(null);

      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        setLoading(false);
        setError("Chưa cấu hình API Key.");
        return;
      }

      try {
        const response = await apiClient.get<ForecastResponse>("/forecast", {
          params: {
            lat,
            lon,
            units: "metric",
            appid: apiKey,
          },
        });

        const list = response.data.list;

        // Generate 24 hourly items, separated by exactly 1 hour, starting from the current hour (Now)
        const parsedHourly: FormattedHourlyItem[] = [];
        const startTimestamp = Math.floor(Date.now() / 1000);

        for (let i = 0; i < 24; i++) {
          const targetTime = startTimestamp + i * 3600;
          const targetDate = new Date(targetTime * 1000);
          
          const hours = targetDate.getHours();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
          const timeStr = i === 0 ? "Now" : `${formattedHours} ${ampm}`;

          // Find the two forecast items that sandwich targetTime
          let itemA = list[0];
          let itemB = list[0];
          
          for (let j = 0; j < list.length - 1; j++) {
            if (list[j].dt <= targetTime && list[j + 1].dt >= targetTime) {
              itemA = list[j];
              itemB = list[j + 1];
              break;
            }
          }

          // If targetTime exceeds list boundary, fallback to last item
          if (targetTime > list[list.length - 1].dt) {
            itemA = list[list.length - 1];
            itemB = list[list.length - 1];
          }

          let temp = itemA.main.temp;
          let icon = itemA.weather[0]?.icon || "01d";
          let condition = itemA.weather[0]?.main || "Clear";

          // Perform linear interpolation between A and B
          if (itemA.dt !== itemB.dt) {
            const fraction = (targetTime - itemA.dt) / (itemB.dt - itemA.dt);
            temp = itemA.main.temp + fraction * (itemB.main.temp - itemA.main.temp);
            
            // Assign weather conditions and icon of the closer interval point
            const closerItem = fraction < 0.5 ? itemA : itemB;
            icon = closerItem.weather[0]?.icon || "01d";
            condition = closerItem.weather[0]?.main || "Clear";
          }

          parsedHourly.push({
            time: timeStr,
            temp: Math.round(temp),
            icon,
            condition,
          });
        }

        // Parse 5-day forecast (take one reading around noon daily)
        const parsedForecast: FormattedForecastItem[] = [];
        const daysMap: Record<string, ForecastItem[]> = {};

        list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toDateString();
          if (!daysMap[dayKey]) {
            daysMap[dayKey] = [];
          }
          daysMap[dayKey].push(item);
        });

        const dayKeys = Object.keys(daysMap).slice(0, 6); // Up to 6 days including today
        const weekdayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        dayKeys.forEach((dayKey, idx) => {
          const dayItems = daysMap[dayKey];
          const temps = dayItems.map((di) => di.main.temp);
          const tempMax = Math.round(Math.max(...temps));
          const tempMin = Math.round(Math.min(...temps));

          // Find an item closest to 12:00 PM for the daily icon/condition representation
          const midDayItem =
            dayItems.find((di) => {
              const hour = new Date(di.dt * 1000).getHours();
              return hour >= 11 && hour <= 14;
            }) || dayItems[Math.floor(dayItems.length / 2)];

          const dateObj = new Date(midDayItem.dt * 1000);
          const dayName =
            idx === 0
              ? "Today"
              : idx === 1
              ? "Tomorrow"
              : weekdayNames[dateObj.getDay()];
          const dateStr = dateObj.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
          });

          parsedForecast.push({
            dayName,
            dateStr,
            tempMax,
            tempMin,
            icon: midDayItem.weather[0]?.icon || "01d",
            condition: midDayItem.weather[0]?.main || "Clear",
          });
        });

        setHourly(parsedHourly);
        setForecast(parsedForecast);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError("Không thể tải thông tin dự báo thời tiết.");
      }
    };

    fetchWeatherDetails();
  }, [lat, lon, cityName]);

  return { hourly, forecast, loading, error };
};
