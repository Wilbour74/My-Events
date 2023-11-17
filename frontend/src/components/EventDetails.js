import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Event.css";
import geolib from "geolib";
// import { Map, TileLayer, Marker, Popup } from 'react-leaflet';


function EventDetails (){
    const [event, setEvents] = useState([]);
    const { id } = useParams();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [nom, setNom] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [eventLocation, setEventLocation] = useState({ latitude: null, longitude: null });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
       ApiData();
       
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

      const userID = localStorage.getItem('userId');
      if(userID){
        console.log(userID);
        setUserId(userID);
      }
    }, [])

    const ApiData = () => {
        axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=uid=${id}&limit=20`)
            .then(response => {
                console.log(response.data.results[0]);
                setEvents(response.data.results[0]);
                setNom(response.data.results[0].title_fr);
                setPhoto(response.data.results[0].image);
                
            })
            .catch(error => {
                console.error(error);
            })
    };

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

    const handleStartChange = (event) => {
      setStart(event.target.value);
    };
    
    const handleEndChange = (event) => {
      setEnd(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();

      axios.post('https://localhost:8000/make/sortie', {id: id, nom: nom, start: start, end: end, photo: photo, id_user: userId})
         .then(response => {
            console.log(response.data);
          
         })
         .catch(error => {
          console.error(error);
         })
    }
    return (
        <>
        <h1>Tu es sur l'évènement numéro {id}, Ton id_user est {userId}</h1>
        <div className="event-box">
        <button onClick={openModal} className="Form-button">Créer une sortie</button>
        <h3>{event.title_fr} : </h3>
            {event.location_coordinates && (
              <h3>{event.location_coordinates.lon} {event.location_coordinates.lat} {event.location_city}</h3>
            )}
                <img src={event.image}></img>
                <div dangerouslySetInnerHTML={{ __html: event.longdescription_fr}} className="event-details"/>
                
                </div>
                

{/* Fenêtre modale */}
{isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>
        &times;
      </span>
      <h2>Formulaire</h2>
      <form onSubmit={handleSubmit}>
        
        <label> Date du début de ta sortie:</label>
        <input type="datetime-local" value={start} onChange={handleStartChange}></input>
        <label> Date de la fin de ta sortie:</label>
        <input type="datetime-local" value={end} onChange={handleEndChange}></input>
        <button className="submit-button">Valider la sortie</button>
      </form>
    </div>
  </div>
)}
        
        </>
    )
}

export default EventDetails;