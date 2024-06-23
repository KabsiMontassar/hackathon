import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase"; // Adjust this import according to your Firebase setup
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Ensure Firestore is imported
import {
  collection,
  query,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import CheckIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";

const Demende = ({ demende }) => {
  const [userKey, setUserKey] = useState("");
  const [demendesData, setDemendesData] = useState([]);
  const [filteredDemendes, setFilteredDemendes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    const q = query(collection(db, "utilisateurs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(usersData);
    });
    return unsubscribe;
  }, []);

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "Demende"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const demendeData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDemendesData(demendeData);
      setFilteredDemendes(demendeData);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribeUsers;
    fetchUsers().then((sub) => {
      unsubscribeUsers = sub;
      console.log("fetching users data...");
    });

    let unsubscribeDemendes;
    fetchData().then((sub) => {
      unsubscribeDemendes = sub;
      console.log("fetching demendes data...");
    });

    return () => {
      if (unsubscribeUsers) {
        unsubscribeUsers();
      }
      if (unsubscribeDemendes) {
        unsubscribeDemendes();
      }
    };
  }, [fetchUsers, fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!userKey ) {
      alert("Please fill all the fields");
      return;
    }

    let data = {
      userKey,
      
      DatedeDemenade: firebase.firestore.Timestamp.now(),
      State: "En attente",
    };

    try {
      if (editId) {
        const docRef = doc(db, "Demende", editId);
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
    setUserKey("");
    setEditId(null);
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = demendesData.filter((demende) => {
      const user = users.find((user) => user.id === demende.userKey);
      const searchCondition =
        !searchTerm ||
        user?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.address.toLowerCase().includes(searchTerm.toLowerCase());
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
            {filteredDemendes.map((item) => {
              const user = users.find((user) => user.id === item.userKey);
              return (
                <div key={item.id} className="menu-items">
                  <ListItem divider>
                    <ListItemAvatar className="demendeimage">
                      <Avatar sx={{ width: 130, height: 130 }} src={demendeImage} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.address} `}
                      secondary={
                        user && (
                          <>
                            <span>
                              Nom Complet : {user.nom} {user.prenom}
                            </span>
                            <br />
                            <span>Numero de télephone : {user.numtel}</span>
                            <br />
                            <span>Email : {user.email}</span>
                            <br />
                            <span>
                              Date de demende :{" "}
                              {item.DatedeDemenade.toDate().toLocaleString()}
                            </span>
                            <br />
                            <span>Etat : {item.State}</span>
                          </>
                        )
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
              );
            })}
          </div>
        </Box>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter Demende</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="userKey-label">Utilisateur</InputLabel>
              <Select
                labelId="userKey-label"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.nom} {user.prenom} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Demende;
