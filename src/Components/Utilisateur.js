import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, query } from "firebase/firestore";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar,  
  IconButton, 
  DialogContentText,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import female from "../img/female.png";
import male from "../img/male.png";

const Utilisateur = ({ Utilisateur }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [numtel, setNumtel] = useState("");
  const [sexe, setSexe] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "Utilisateur"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const utilisateursData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUtilisateurs(utilisateursData);
      setFilteredUtilisateurs(utilisateursData); // Initialize filtered list with all data
    });

    return unsubscribe;
  }, []);


  useEffect(() => {
    let unsubscribe; // Declare unsubscribe outside to avoid re-declaration on every render
    fetchData().then((sub) => {
      unsubscribe = sub; // Assign the returned unsubscribe function
      console.log("fetching data for utilisateurs...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call unsubscribe to cancel the listener
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();
    let data = {
      email: email,
      nom: nom,
      prenom: prenom,
      age: age,
      numtel: numtel,
      sexe: sexe
    };

    try {
      if (EditId) {
        const docRef = doc(db, "Utilisateur", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "Utilisateur"), data);
      }
      clearForm();
    } catch (e) {
      console.error("Error adding/updating document: ", e);
    }
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "Utilisateur", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  }

  const handleEdit = (utilisateur) => {
    setEditId(utilisateur.id);
    setEmail(utilisateur.email);
    setNom(utilisateur.nom);
    setPrenom(utilisateur.prenom);
    setAge(utilisateur.age);
    setNumtel(utilisateur.numtel);
    setSexe(utilisateur.sexe);
    setShowModal(true);
  }

  const clearForm = () => {
    setEmail("");
    setNom("");
    setPrenom("");
    setEditId(null);
    setAge("");
    setNumtel("");
    setSexe("");
    setShowModal(false);
  };


  
  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredData = utilisateurs.filter(
      (utilisateur) =>
        utilisateur.nom.toLowerCase().includes(searchTermLower) ||
        utilisateur.prenom.toLowerCase().includes(searchTermLower) ||
        utilisateur.email.toLowerCase().includes(searchTermLower)
    );
    setFilteredUtilisateurs(filteredData);
  };

 

  return (
    <>
      {Utilisateur && (
        <Box>
          <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
            Ajouter Utilisateur
          </Button>
          <TextField
            label="Rechercher par nom, prenom ou email"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "16px", marginTop: "16px" }}
            onKeyUp={handleSearch}
          />
        </Box>
      )}
      {Utilisateur && (
        <Box mb={2}>
          <div>
            {filteredUtilisateurs.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar src={item.sexe === "Femme" ? female : male} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${item.nom} ${item.prenom}`} 
                    secondary={
                      <>
                        <span>Email : {item.email}</span><br />
                        <span>Age : {item.age}</span><br />
                        <span>Numero de telephone : {item.numtel}</span>
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
     
      <Dialog open={showModal} onClose={clearForm} maxWidth="sm" fullWidth>
        <DialogTitle>{EditId ? "Edit utilisateur" : "Ajouter utilisateur"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              label="email"
              type="email"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="nom"
              type="text"
              fullWidth
              margin="dense"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <TextField
              label="prenom"
              type="text"
              fullWidth
              margin="dense"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <TextField
              label="age"
              type="number"
              fullWidth
              margin="dense"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <TextField
              label="numtel"
              type="number"
              fullWidth
              margin="dense"
              value={numtel}
              onChange={(e) => setNumtel(e.target.value)}
            />
            <Select
              fullWidth
              margin="dense"
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
            >
              <MenuItem value="Femme">Femme</MenuItem>
              <MenuItem value="Homme">Homme</MenuItem>
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {EditId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this utilisateur?
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

export default Utilisateur;
