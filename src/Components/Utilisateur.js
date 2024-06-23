import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, query } from "firebase/firestore";
import { addDoc, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
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
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import female from "../img/female.png";
import male from "../img/male.png";

const Utilisateurs = ({ utilisateurs }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [numtel, setNumtel] = useState("");
  const [sexe, setSexe] = useState("");
  const [address, setAddress] = useState("");
  const [UsersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "utilisateurs"));
    const unsubscribe = onSnapshot(q, (snapshot) => { // Subscribe to Firestore
      const UsersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsersData(UsersData);
      setFilteredUsers(UsersData); // Initialize filtered list with all data
    });
     
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe; // Declare unsubscribe outside to avoid re-declaration on every render
    fetchData().then((sub) => {
      unsubscribe = sub; // Assign the returned unsubscribe function
      console.log("fetching data for Users...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call unsubscribe to cancel the listener
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (email.trim() === '' ||
        nom.trim() === '' ||
        prenom.trim() === '' ||
        age === '' ||
        numtel === '' || 
        sexe === '' ||
      address.trim() === ''
      ) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    let data = {
      email: email,
      nom: nom,
      prenom: prenom,
      sexe: sexe,
      age: age,
      numtel: numtel,
      address: address,
    };

    try {
      if (EditId) {
        const docRef = doc(db, "utilisateurs", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "utilisateurs"), data);
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
      await deleteDoc(doc(db, "utilisateurs", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEdit = (User) => {
    setEditId(User.id);
    setEmail(User.email);
    setNom(User.nom);
    setPrenom(User.prenom);
    setAge(User.age);
    setNumtel(User.numtel);
    setSexe(User.sexe);
    setAddress(User.address);
    setShowModal(true);
  };

  const clearForm = () => {
    setEmail("");
    setNom("");
    setPrenom("");
    setEditId(null);
    setAge("");
    setNumtel("");
    setSexe("");
    setAddress("");
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = UsersData.filter((User) => {
      const searchCondition = !searchTerm ||
        User.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        User.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            label="Rechercher par nom, prenom ou email"
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
                    <Avatar src={item.sexe === "Femme" ? female : male} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${item.nom} ${item.prenom}`}
                    secondary={
                      <>
                        <span>Email : {item.email}</span>
                        <br />
                        <span>Age : {item.age}</span>
                        <br />
                        <span>Numero de telephone : {item.numtel}</span>
                        <br />
                        <span>Address : {item.address}</span>
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
              name="nom"
              label="nom"
              type="text"
              fullWidth
              margin="dense"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <TextField
              required
              name="prenom"
              label="prenom"
              type="text"
              fullWidth
              margin="dense"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <TextField
              required
              name="age"
              label="age"
              type="number"
              fullWidth
              margin="dense"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <TextField
              required
              name="numtel"
              label="numtel"
              type="number"
              fullWidth
              margin="dense"
              value={numtel}
              onChange={(e) => setNumtel(e.target.value)}
            />
            <TextField
              required
              name="address"
              label="address"
              type="text"
              fullWidth
              margin="dense"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select
                labelId="sexe-label"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
              >
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </Select>
            </FormControl>
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
