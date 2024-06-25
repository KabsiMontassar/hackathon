import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, query } from "firebase/firestore";
import { addDoc, doc, deleteDoc, onSnapshot, updateDoc  , GeoPoint} from "firebase/firestore";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

const Utilisateurs = ({ utilisateurs }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");   // eslint-disable-line

  const [photoUrl, setPhotoUrl] = useState("");
  const [UsersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "User"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const UsersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsersData(UsersData);
      setFilteredUsers(UsersData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    fetchData().then((sub) => {
      unsubscribe = sub;
      console.log("fetching data for Users...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || displayName.trim() === '' || phoneNumber.trim() === '') {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

   // let positionArray = position.split(',').map(coord => parseFloat(coord.trim()));

let positionArray = [74, 88];
let geoPoint = new GeoPoint(positionArray[0], positionArray[1]);

    let data = {
      email: email,
      display_name: displayName,
      phone_number: phoneNumber,
      position: geoPoint,
      photo_url: photoUrl,
      created_time: new Date(),
      fill: "",
      invitation: "",
      mission: "",
      password: "",
      score: 0,
      uid: "",
      Balance: 0,
      hederaAccountId: ""
    };

    try {
      if (EditId) {
        const docRef = doc(db, "User", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "User"), data);
      }
      clearForm();
    } catch (e) {
      console.error("Error adding/updating document: ", e);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "User", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEdit = (User) => {
    setEditId(User.id);
    setEmail(User.email);
    setDisplayName(User.display_name);
    setPhoneNumber(User.phone_number);
    setPosition(`${User.position.latitude}, ${User.position.longitude}`); // Convert GeoPoint to string for input
    setPhotoUrl(User.photo_url);
    setShowModal(true);
  };

  const clearForm = () => {
    setEmail("");
    setDisplayName("");
    setPhoneNumber("");
    setPosition("");
    setPhotoUrl("");
    setEditId(null);
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = UsersData.filter((User) => {
      const searchCondition = !searchTerm ||
        User.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.email.toLowerCase().includes(searchTerm.toLowerCase());
      return searchCondition;
    });

    setFilteredUsers(filteredData);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    handleSearchAndFilter(searchTerm);
  };

  return (
    <>
      {utilisateurs && (
        <Box>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Ajouter Utilisateurs
          </Button>
        </Box>
      )}
      {utilisateurs && (
        <Box p={2}>
          <TextField
            name="search"
            label="Rechercher par nom ou email"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <div>
            {filteredUsers.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemAvatar>
                    {item.photo_url ? (
                      <Avatar alt={item.display + " photo"} src={item.photo_url} />
                    ) : (
                      <Avatar>{item.display_name.charAt(0)}</Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.display_name}
                    secondary={
                      <>
                        <span>Email : {item.email}</span>
                        <br />
                        <span>Phone Number : {item.phone_number}</span>
                        <br />
                        <span>Position : {item.position.latitude}, {item.position.longitude}</span> {/* Convert GeoPoint to string */}
                      </>
                    }
                  />
                  <IconButton onClick={() => console.log("historique")} color="success">
                    <InfoIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{EditId ? "Edit membre" : "Ajouter membre"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              required
              name="email"
              label="email"
              type="email"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              name="display_name"
              label="Display Name"
              type="text"
              fullWidth
              margin="dense"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
              required
              name="phone_number"
              label="Phone Number"
              type="text"
              fullWidth
              margin="dense"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {/* <TextField
              name="position"
              label="Position (lat, lng)"
              type="text"
              fullWidth
              margin="dense"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            /> */}
            {/* <TextField
              name="photo_url"
              label="Photo URL"
              type="url"
              fullWidth
              margin="dense"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            /> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              clearForm();
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} type="submit" color="primary" variant="contained">
            {EditId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className="Modal"
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Utilisateurs;
