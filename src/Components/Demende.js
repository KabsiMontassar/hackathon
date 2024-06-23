import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase"; // Adjust this import according to your Firebase setup
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Ensure Firestore is imported

import {
  collection,
  query,
  addDoc,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"; // Import necessary Firestore methods

import demendeImage from "../img/demende.png";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  DialogActions,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';

const Demende = ({ demende }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numtel, setNumtel] = useState("");
  const [Address, setAddress] = useState("");
  const [DemendesData, setDemendesData] = useState([]);
  const [filteredDemendes, setFilteredDemendes] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "Demende"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const DemendeData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setDemendesData(DemendeData);
      setFilteredDemendes(DemendeData);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    fetchData().then((sub) => {
      unsubscribe = sub;
      console.log("fetching data for Demendes...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!email || !nom || !prenom || !numtel || !Address) {
      alert("Please fill all the fields");
      return;
    }

    let data = {
      email,
      nom,
      prenom,
      numtel,
      DatedeDemenade: firebase.firestore.Timestamp.now(),
      Address,
      State: "En attente",
    };

    try {
      if (EditId) {
        const docRef = doc(db, "Demende", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "Demende"), data);
      }
      clearForm();
    } catch (e) {
      console.error("Error adding/updating document: ", e);
    }
  };

  const changeStatetoDone = async (id) => {
    try {
      const docRef = doc(db, "Demende", id);
      await updateDoc(docRef, {
        State: "Done",
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const changeStatetoCanceled = async (id) => {
    try {
      const docRef = doc(db, "Demende", id);
      await updateDoc(docRef, {
        State: "Canceled",
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const clearForm = () => {
    setEmail("");
    setNom("");
    setPrenom("");
    setEditId(null);
    setNumtel("");
    setAddress("");
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = DemendesData.filter((User) => {
      const searchCondition =
        !searchTerm ||
        User.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.Address.toLowerCase().includes(searchTerm.toLowerCase());
      return searchCondition;
    });

    setFilteredDemendes(filteredData);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    handleSearchAndFilter(searchTerm);
  };

  return (
    <>
      {demende && (
        <Box>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Ajouter Demende
          </Button>
        </Box>
      )}
      {demende && (
        <Box p={2}>
          <TextField
            name="search"
            label="Rechercher par nom, prenom ou address"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <div>
            {filteredDemendes.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemAvatar className="demendeimage">
                    <Avatar sx={{ width: 130, height: 130 }} src={demendeImage} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${item.Address} `}
                    secondary={
                      <>
                        <span>Nom Complet : {item.nom} {item.prenom}</span>
                        <br />
                        <span>Numero de télephone : {item.numtel}</span>
                        <br />
                        <span>Email : {item.email}</span>
                        <br />
                        <span>Date de demende : {item.DatedeDemenade.toDate().toLocaleString()}</span>
                        <br />
                        <span>Etat : {item.State}</span>
                      </>
                    }
                  />
                  <IconButton onClick={() => console.log("take me to map")} color="info">
                    <MapIcon />
                  </IconButton>
                  <IconButton onClick={() => changeStatetoDone(item.id)} color="success">
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={() => changeStatetoCanceled(item.id)} color="warning">
                    <CancelIcon />
                  </IconButton>
                </ListItem>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter Demende</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              required
              fullWidth
              margin="dense"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="dense"
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="dense"
              label="Prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="dense"
              label="Numero de telephone"
              value={numtel}
              onChange={(e) => setNumtel(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="dense"
              label="Address"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} type="submit" color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Demende;
