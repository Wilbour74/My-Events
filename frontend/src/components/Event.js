import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Event.css";
import { useNavigate } from "react-router-dom";
import { getDistance } from "geolib";

function Event() {
  const [events, setEvents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [adresse, setAdresse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?limit=100"
      )
      .then((response) => {
        setEvents(response.data.results);
        console.log(response.data.results);
      
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const filteredByCity = events.filter(
      (event) =>
        event.location_city &&
        event.location_city.toLowerCase().includes(searchInput.toLowerCase())
    );
  
    const filteredByDepartment = events.filter(
      (event) =>
        event.location_department &&
        event.location_department.toLowerCase().includes(departmentInput.toLowerCase())
    );

    const filteredByAddress = events.filter(
      (event) =>
        event.location_address &&
        event.location_address.toLowerCase().includes(adresse.toLowerCase())
    );

    
  
    let filteredByTheme = events;
    if (selectedTheme) {
      filteredByTheme = events.filter((event) =>
        event.keywords_fr && event.keywords_fr.some((keyword) =>
          keyword.toLowerCase().includes(selectedTheme.toLowerCase())
        )
      );
    }
  

    let filtered = filteredByCity
      .filter((event) => filteredByDepartment.includes(event))
      .filter((event) => filteredByAddress.includes(event))
      .filter((event) => filteredByTheme.includes(event));

  

    if (latitude !== null && longitude !== null) {
      filtered = filtered
        .map((event) => ({
          ...event,
          distance: getDistance(
            { latitude: latitude, longitude: longitude },
            { latitude: event.location_coordinates.lat, longitude: event.location_coordinates.lon }
          ) / 1000,
        }))
        .sort((a, b) => a.distance - b.distance);
    }
  
    setFilteredEvents(filtered);
  }, [searchInput, departmentInput, selectedTheme, adresse, events, latitude, longitude]);
  
  return (
    <>
      <p>Longitude = {longitude}, Latitude = {latitude}</p>
      <div className="filter-box">
        <input
          type="text"
          placeholder="Entre une ville"
          onChange={(event) => setSearchInput(event.target.value)}
          value={searchInput}
        ></input>
        <input
          type="text"
          placeholder="Entre un département"
          onChange={(event) => setDepartmentInput(event.target.value)}
          value={departmentInput}
        ></input>

        <input
          type="text"
          placeholder="Entre une adresse"
          onChange={(event) => setAdresse(event.target.value)}
          value={adresse}
        />

        <select onChange={(event) => setSelectedTheme(event.target.value)}>
          <option value="">Tous les thèmes</option>
          <option value="Concert">Concert</option>
          <option value="Théâtre">Théâtre</option>
          <option value="Exposition">Exposition</option>
          <option value="Spectacle">Spectacle</option>
          <option value="Chant">Chant</option>
          <option value="Danse">Danse</option>
        </select>
      </div>
      
      <h1>Voici la liste des évènements autour de toi</h1>
      {filteredEvents.map((event, index) => (
        <div key={index} className="event-box" onClick={() => navigate(`/events/${event.uid}`)}>
          <h3>{event.title_fr}</h3>
          <h3>{event.location_city}</h3>
          <p>à {event.distance ? event.distance.toFixed(2) : "N/A"} km de chez vous</p>
          <img src={event.image} alt={event.title_fr}></img>
        
          {/* <div dangerouslySetInnerHTML={{ __html: event.longdescription_fr }} className="event-details" /> */}
        </div>
      ))}
    </>
  );
}

export default Event;
