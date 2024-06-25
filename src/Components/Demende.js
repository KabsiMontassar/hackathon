import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, query, getDocs,Timestamp } from "firebase/firestore";
import { addDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

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
  Select,
  MenuItem,
} from "@mui/material";

import MapIcon from "@mui/icons-material/Map";
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';

const Demende = ({ demende }) => {

  const [DemendesData, setDemendesData] = useState([]);
  const [filteredDemendes, setFilteredDemendes] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [type, setType] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "User");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
         
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

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

    if (!selectedUser) {
      alert("Please select a user");
      return;
    }
    let data = {
      userKey: selectedUser.props.value.id, // Assuming 'uid' is the unique identifier for users
      DatedeDemende: Timestamp.now(), // Use Firestore Timestamp
      State: "en attente",
      type :  type,
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

    setEditId(null);
    setSelectedUser("");
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = DemendesData.filter((User) => {
      const searchCondition =
        !searchTerm ||
        User.userKey.toLowerCase().includes(searchTerm.toLowerCase());
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
            label="Rechercher par utilisateur"
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
                <ListItemText
                  primary={`Utilisateur : ${item.userKey}`}
                  secondary={
                    <>
                      <span>Date de Demande : {item.DatedeDemende.toDate().toLocaleString()}</span>
                      <br/>
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
            <Select
              value={selectedUser}
              onChange={(event, newValue) => {
                setSelectedUser(newValue); // newValue is the selected value itself
              }}
              fullWidth
              label="Utilisateur"
            >
              <MenuItem value="">Select User</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.uid} value={user}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>

            <Select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              label="Type"
            >
              <MenuItem value="Hotel">Hotel</MenuItem>
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Restaurant">Restaurant</MenuItem>
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={clearForm}
            color="secondary"
          >
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
