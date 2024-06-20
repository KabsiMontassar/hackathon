import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, query } from "firebase/firestore";
import { addDoc, doc, deleteDoc,onSnapshot, updateDoc } from "firebase/firestore";
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
import female from "../img/femaledoctor.png";
import male from "../img/maledoctor.png";
import DoctorSpecialities from "./AllDoctorsSpectialities";

const Medecins = ({ Medecin }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [age, setAge] = useState("");
  const [numtel, setNumtel] = useState("");
  const [sexe, setSexe] = useState("");
 const [medecinsData, setMedecinsData] = useState([]);
  const [filteredMedecins, setFilteredMedecins] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "medecin"));
    const unsubscribe = onSnapshot(q, (snapshot) => { // Subscribe to Firestore
      const medecinsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
     setMedecinsData(medecinsData);
      setFilteredMedecins(medecinsData); // Initialize filtered list with all data
    });
     
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe; // Declare unsubscribe outside to avoid re-declaration on every render
    fetchData().then((sub) => {
      unsubscribe = sub; // Assign the returned unsubscribe function
      console.log("fetching data for Doctors...");
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
    specialite === '' ||  // Assuming the default value should be ''
    age === '' ||
    numtel === '' ||
    sexe === '') {
  alert('Veuillez remplir tous les champs obligatoires.');
  return;
}



    let data = {
      email: email,
      nom: nom,
      prenom: prenom,
      specialite: specialite,
      age: age,
      numtel: numtel,
      sexe: sexe,
    };

    try {
      if (EditId) {
        const docRef = doc(db, "medecin", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "medecin"), data);
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
      await deleteDoc(doc(db, "medecin", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEdit = (medecin) => {
    setEditId(medecin.id);
    setEmail(medecin.email);
    setNom(medecin.nom);
    setPrenom(medecin.prenom);
    setSpecialite(medecin.specialite);
    setAge(medecin.age);
    setNumtel(medecin.numtel);
    setSexe(medecin.sexe);
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
    setShowModal(false);
  };




 


  const handleSearchAndFilter = (searchTerm, filterSpeciality) => {
    let filteredData = medecinsData.filter((medecin) => {
      const searchCondition = !searchTerm ||
        medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medecin.email.toLowerCase().includes(searchTerm.toLowerCase());

      const filterCondition = !filterSpeciality || medecin.specialite === filterSpeciality;

      return searchCondition && filterCondition;
    });

    setFilteredMedecins(filteredData);
  }

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    handleSearchAndFilter(searchTerm, filterSpeciality);
  }

  const handleSpecialityChange = (e) => {
    const speciality = e.target.value;
    setFilterSpeciality(speciality);
    handleSearchAndFilter(searchTerm, speciality);
  }
  return (
    <>
      {Medecin && (
        <Box>
          <Button
          className="add-button"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Ajouter Medecin
          </Button>
         
         
        </Box>
      )}
      {Medecin && (
        <Box p={2}>
          <TextField
          name = "search"
            label="Rechercher par nom, prenom ou email"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <Select
          name = "specialite"
            value={filterSpeciality}

            onChange={handleSpecialityChange}

            variant="outlined"
            fullWidth
            displayEmpty
            style={{ marginBottom: "16px" }}
          
          >
            <MenuItem value="">Filtrer par spécialité</MenuItem>
            {DoctorSpecialities.map((speciality) => (
              <MenuItem key={speciality} value={speciality}>
                {speciality}
              </MenuItem>
            ))}
            <MenuItem value="Autre">Autre</MenuItem>
          </Select>
          <div>
            {filteredMedecins.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar src={item.sexe === "Femme" ? female : male} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${item.nom} ${item.prenom}`}
                    secondary={
                      <>
                        <span>Specialité : {item.specialite}</span> <br />
                        <span>Email : {item.email}</span>
                        <br />
                        <span>Age : {item.age}</span>
                        <br />
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

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{EditId ? "Edit Medecin" : "Ajouter Medecin"}</DialogTitle>
        <DialogContent>
          <form  onSubmit={handleSave}>
            <TextField
            required
              name = "email"
              label="email"
              type="email"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
            required
              name = "nom"
              label="nom"
              type="text"
              fullWidth
              margin="dense"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <TextField
            required
              name = "prenom"
              label="prenom"
              type="text"
              fullWidth
              margin="dense"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
             <FormControl fullWidth margin="dense" required>
             <InputLabel htmlFor="specialite">Spécialité</InputLabel>
            <Select
            required
              name = "specialite"
              label="specialite"
              fullWidth
              placeholder="Specialite"
              margin="dense"
              displayEmpty
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
            >
             
              {DoctorSpecialities.map((speciality) => (
                <MenuItem key={speciality} value={speciality}>
                  {speciality}
                </MenuItem>
              ))}
              <MenuItem value="Autre">Autre</MenuItem>
            </Select>
            </FormControl>
            <TextField
            required
              name = "age"
              label="age"
              type="number"
              fullWidth
              margin="dense"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <TextField
            required
              name = "numtel"
              label="numtel"
              type="number"
              fullWidth
              margin="dense"
              value={numtel}
              onChange={(e) => setNumtel(e.target.value)}
            />
             <FormControl fullWidth margin="dense" required>
             <InputLabel htmlFor="sexe">Sexe</InputLabel>
            <Select
            required
              name = "sexe"
              label="sexe"
              fullWidth
              margin="dense"
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
            >
              <MenuItem value="Femme">Femme</MenuItem>
              <MenuItem value="Homme">Homme</MenuItem>
            </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowModal(false);
              setEmail("");
              setNom("");
              setPrenom("");
              setSpecialite("");
              setEditId(null);
              setAge("");
              setNumtel("");
              setSexe("");
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSave}  type="submit"  color="primary" variant="contained">
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
            Are you sure you want to delete this Doctor?
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

export default Medecins;
