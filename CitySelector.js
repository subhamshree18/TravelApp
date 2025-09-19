import React, { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";

const CitySelector = ({ onCitySelect, defaultCity }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  // Custom styles to match the theme of TripScreen.js
  const customSelectStyles = {
    container: (provided) => ({
      ...provided,
      width: "80%", // Match the width of other inputs
      marginBottom: 15, // Match the margin of other inputs
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: 10,
      borderColor: state.isFocused ? "#80bdff" : "#ccc", // Highlight on focus
      boxShadow: state.isFocused ? "0 0 0 1px #80bdff" : "none",
      "&:hover": {
        borderColor: "#80bdff",
      },
      padding: 4, // Adjust padding to align with TextInput's 12px total
    }),
    input: (provided) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#333", // Match placeholder color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
  };

  // Fetch cities from Nominatim API (wrapped in AllOrigins proxy to avoid CORS issues)
  const fetchCities = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      inputValue
    )}&format=json&limit=10`;

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const res = await fetch(proxyUrl);
    const data = await res.json();

    return data.map((c) => ({
      value: c,
      label: c.display_name,
    }));
  };

  // Debounce fetch
  const debouncedFetch = useCallback(debounce(fetchCities, 500), []);

  const handleChange = (option) => {
    setSelectedCity(option);

    if (option) {
      const coords = { lat: option.value.lat, lon: option.value.lon };
      onCitySelect({ name: option.label, coords });
    } else {
      onCitySelect(null);
    }
  };

  // Load default city when provided
  useEffect(() => {
    const loadDefaultCity = async () => {
      if (!defaultCity) return;
      const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        defaultCity
      )}&format=json&limit=1`;

      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        url
      )}`;

      const res = await fetch(proxyUrl);
      const data = await res.json();

      if (data.length > 0) {
        const cityObj = {
          value: data[0],
          label: data[0].display_name,
        };
        setSelectedCity(cityObj);
        onCitySelect({
          name: cityObj.label,
          coords: { lat: data[0].lat, lon: data[0].lon },
        });
      }
    };
    loadDefaultCity();
  }, [defaultCity, onCitySelect]);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={false}
      loadOptions={debouncedFetch}
      onChange={handleChange}
      value={selectedCity}
      styles={customSelectStyles}
      placeholder="Type to search city..."
      isClearable
    />
  );
};

export default CitySelector;
