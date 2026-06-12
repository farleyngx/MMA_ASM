import { useState } from "react";
import { apiClient } from "../../../shared/services/api";
import { WeatherDataResponse } from "../../../types";
import axios from "axios";

export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export const useCitySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const searchCity = async (
    cityName: string,
  ): Promise<WeatherDataResponse | null> => {
    const query = cityName.trim();
    if (!query) return null;

    setLoading(true);
    setError(null);

    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
      setLoading(false);
      setError("Chưa cấu hình API Key. Vui lòng thêm EXPO_PUBLIC_WEATHER_API_KEY vào tệp .env.");
      return null;
    }

    try {
      const response = await apiClient.get<WeatherDataResponse>("/weather", {
        params: {
          q: query,
          units: "metric",
          appid: apiKey,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);

      if (!err.response) {
        setError("Không có kết nối Internet. Vui lòng kiểm tra mạng.");
      } else if (err.response.status === 401) {
        setError("API Key không hợp lệ hoặc không có quyền truy cập.");
      } else if (err.response.status === 404) {
        setError("Không tìm thấy thành phố này. Vui lòng nhập lại chính xác.");
      } else {
        setError("Đã xảy ra lỗi hệ thống khi lấy dữ liệu.");
      }
      return null;
    }
  };

  const fetchSuggestions = async (query: string): Promise<CitySuggestion[]> => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return [];
    }

    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) return [];

    setSuggestionsLoading(true);
    try {
      const response = await axios.get<CitySuggestion[]>(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: trimmed,
            limit: 5,
            appid: apiKey,
          },
        }
      );
      setSuggestions(response.data || []);
      setSuggestionsLoading(false);
      return response.data || [];
    } catch (err) {
      setSuggestionsLoading(false);
      return [];
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    searchCity,
    loading,
    error,
    setError,
    suggestions,
    suggestionsLoading,
    fetchSuggestions,
    clearSuggestions,
  };
};
