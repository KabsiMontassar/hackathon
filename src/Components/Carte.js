import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Custom icon for the marker
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 13);
    }
  }, [selectedLocation, map]);

  return null;
};

const Carte = ({ demendes = [] }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleRowClick = (address) => {
    // Geocode the address to get lat/lng (for simplicity, using static values here)
    // You should use a geocoding service to get the actual lat/lng for the address
    const locations = {
      "123 Main St": { lat: 40.7128, lng: -74.0060 },
      "456 Elm St": { lat: 34.0522, lng: -118.2437 },
      // Add more addresses and their lat/lng here
    };
    setSelectedLocation(locations[address]);
  };



  demendes = [
    {
      id: 1,
      nom: "John",
      prenom: "Doe",
      Address: "123 Main St",
      email: "3",
      numtel: "123-456-7890"
    },
  ]
  return (
    <Box display="flex">
      <Box flex={1}>
        <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "100vh" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}
          <MapComponent selectedLocation={selectedLocation} />
        </MapContainer>
      </Box>
      <Box flex={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prenom</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Numtel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demendes.map((demende) => (
                <TableRow
                  key={demende.id}
                  onClick={() => handleRowClick(demende.Address)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{demende.nom}</TableCell>
                  <TableCell>{demende.prenom}</TableCell>
                  <TableCell>{demende.Address}</TableCell>
                  <TableCell>{demende.email}</TableCell>
                  <TableCell>{demende.numtel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Carte;
