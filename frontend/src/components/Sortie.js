import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sortie(props) {
  const [usersInscrits, setUsersInscrits] = useState([]);

  useEffect(() => {
    axios.get(`/event/user/${props.id_sortie}`)
      .then(response => {
        setUsersInscrits(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [props.id_sortie]);

  return (
    <div>
      {usersInscrits.length > 0 && (
        <div>
          <h2>Utilisateurs inscrits :</h2>
          <ul>
            {usersInscrits.map(user => (
              <li key={user.id}>{user.pseudo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sortie;
