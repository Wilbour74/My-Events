import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

function SortieDetail() {
  const { id } = useParams(); 
  const [sortieData, setSortieData] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    const userID = localStorage.getItem('userId');
    if (userID) {
      console.log(userID);
      setUserId(userID);
    }

    axios.get(`https://localhost:8000/sortie/${id}`).then((response) => {
      setSortieData(response.data);
    });

    axios.get(`https://localhost:8000/message/${id}`).then((response) => {
      setMessages(response.data);
    });
  }, [id]);

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    axios.post('https://localhost:8000/create', { message: newMessage, sortieId: id, id_user: userId })
      .then((response) => {
        console.log(response.data);
        setNewMessage('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Sortie : {sortieData.nom}</h1>
      <p>Date de début : {sortieData.date_debut ? format(new Date(sortieData.date_debut.date), 'dd/MM/yyyy') : 'N/A'}</p>
      <p>Date de fin : {sortieData.date_fin ? format(new Date(sortieData.date_fin.date), 'dd/MM/yyyy') : 'N/A'}</p>

      <p>Accessibilité : {sortieData.accessibilite ? 'Oui' : 'Non'}</p>
      <img src={sortieData.photo_url} alt={sortieData.nom} />

      <h2>Messages user</h2>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index}>
            <p>{message.pseudo}: {message.message}</p>
          </div>
        ))}
      </div>

      <div className="message-form">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button onClick={handleSubmitMessage}>Envoyer</button>
      </div>
    </div>
  );
}

export default SortieDetail;
