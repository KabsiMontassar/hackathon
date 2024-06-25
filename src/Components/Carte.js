import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet library

const Carte = ({ carte }) => {
  const [demendes, setDemendes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (carte) {
      const fetchUsers = async () => {
        const usersCollection = collection(db, "User");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
           
        setUsers(usersData);
      };

      const fetchDemendes = async () => {
        const demendesCollection = collection(db, "Demende");
        const demendesSnapshot = await getDocs(demendesCollection);
        const demendesData = demendesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setDemendes(demendesData);
      } 

      fetchUsers();
      fetchDemendes();
    }
  }, [carte]);

  useEffect(() => {
    if (carte) {
      // Initialize Leaflet map
      const map = L.map('map').setView([0, 0], 2);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Define marker icon
      const markerIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Add markers for each demende
      demendes.forEach((demende) => {
        const user = users.find(user => user.uid === demende.userKey);
        if (user && user.position) {
          const { latitude, longitude } = user.position;
          L.marker([latitude, longitude], { icon: markerIcon }).addTo(map)
            .bindPopup(`<b>${user.email}</b><br>${user.display_name}<br>${user.phone_number} <br> ${demende.type} `);
        }
      });

      // Cleanup function
      return () => {
        map.remove(); // Remove the map when component unmounts
      };
    }
  }, [carte, demendes, users]);

  return (
    <>
      {carte && (
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
      )}
    </>
  );
};

export default Carte;
