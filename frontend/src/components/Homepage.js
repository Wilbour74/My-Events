import React, { useEffect, useState } from 'react';
import { auth, provider } from './Account/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import './CSS/style.css';
import axios from 'axios';


function Homepage() {
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState('Rien du tout');
  const [pseudo, setPseudo] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setEmail(savedUser.email);
    }

    const savedDescription = localStorage.getItem('profileDescription');
    if (savedDescription) {
      setDescription(savedDescription);
    }

    const savedPseudo = localStorage.getItem('pseudo');
    if (savedPseudo) {
      setPseudo(savedPseudo);
    }

    const savedProfilePhotoURL = localStorage.getItem('profilePhotoURL');
    if (savedProfilePhotoURL) {
      setProfilePhotoURL(savedProfilePhotoURL);
    }
    
  }, []);

  const handleClickSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: profilePhotoURL,
        description: description,
        pseudo: pseudo,
        uid: result.user.uid,
      };
      console.log(userData)
      // addUserToSymfony(userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', result.user.uid);
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google :', error);
    }
  };

  // const addUserToSymfony = async (userData) => {
  //   try {
  //     const response = await axios.post('https://localhost:8000/register', userData);
  //     console.log(userData)
  //   } catch (error) {
  //     console.error('Erreur lors de l\'ajout d\'utilisateur à Symfony :', error);
  //   }
  // };
  

  const handleClickSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem('user');
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion :', error);
      });
  };

  const handleSaveDescription = () => {
    localStorage.setItem('profileDescription', description);
    setIsEditingDescription(false);
  };

  const handleSavePseudo = () => {
    localStorage.setItem('pseudo', pseudo);
    setIsEditingPseudo(false);
  };

  const handleProfilePhotoChange = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhotoURL(imageUrl);
      localStorage.setItem('profilePhotoURL', imageUrl);
    }
  };

  const valider = () => {
    const email = user.email;
    const userId = localStorage.getItem('userId');
    axios.post('https://localhost:8000/make/user' , {email: email, pseudo: pseudo, photo: profilePhotoURL, description: description, userId: userId})
    .then(response => {
      console.log(response.data);
      const userId = response.data.userId;
      localStorage.setItem('userId', userId);
      console.log('ID de l\'utilisateur :', userId);
    })
    .catch(error => {
      console.error(error);
    })
  }
  
  const renderProfilePhotoInput = () => {
    return (
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleProfilePhotoChange(e.target.files[0])}
        />
        <button onClick={() => setIsEditingPhoto(false)}>Annuler</button>
      </div>
    );
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenue, {user.displayName} !</p>
          <img
            src={profilePhotoURL || user.photoURL}
            alt="Photo de profil"
            className="profile-photo"
            onClick={() => setIsEditingPhoto(true)}
          />
          {isEditingPhoto ? (
            renderProfilePhotoInput()
          ) : (
            <button onClick={() => setIsEditingPhoto(true)}>
              Changer la photo de profil
            </button>
          )}
          <p>Email : {user.email}</p>

          {isEditingDescription ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <button onClick={handleSaveDescription}>Sauvegarder la description</button>
            </div>
          ) : (
            <div>
              <p>Description du profil :</p>
              <p>{description}</p>
              <button onClick={() => setIsEditingDescription(true)}>Modifier la description</button>
            </div>
          )}

          {isEditingPseudo ? (
            <div>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
              />
              <button onClick={handleSavePseudo}>Sauvegarder le pseudo</button>
            </div>
          ) : (
            <div>
              <p>Pseudo :</p>
              <p>{pseudo}</p>
              <button onClick={() => setIsEditingPseudo(true)}>Modifier le pseudo</button>
            </div>
          )}

          <button onClick={handleClickSignOut}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleClickSignIn}>Se connecter avec Google</button>
      )}
      <button onClick={valider}>Enregistrer les modifications</button>
    </div>
  );
}

export default Homepage;
