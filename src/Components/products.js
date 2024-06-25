import React, { useState, useEffect, useCallback } from "react";
import { db } from "../Firebase";
import { collection, query } from "firebase/firestore";
import { addDoc, doc, deleteDoc, onSnapshot, updateDoc  } from "firebase/firestore";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  ListItem,
  ListItemText,
  IconButton,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Products = ({ products }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [ProductsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "Products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ProductsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProductsData(ProductsData);
      setFilteredProducts(ProductsData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    fetchData().then((sub) => {
      unsubscribe = sub;
      console.log("fetching data for Products...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (name.trim() === '' || cost.trim() === '') {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    let data = {
      name: name,
      cost: parseFloat(cost),
    };

    try {
      if (EditId) {
        const docRef = doc(db, "Products", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "Products"), data);
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
      await deleteDoc(doc(db, "Products", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEdit = (Product) => {
    setEditId(Product.id);
    setName(Product.name);
    setCost(Product.cost.toString());
    setShowModal(true);
  };

  const clearForm = () => {
    setName("");
    setCost("");
    setEditId(null);
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = ProductsData.filter((Product) => {
      const searchCondition = !searchTerm ||
        Product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Product.cost.toString().includes(searchTerm.toLowerCase());
      return searchCondition;
    });

    setFilteredProducts(filteredData);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    handleSearchAndFilter(searchTerm);
  };

  return (
    <>
      {products && (
        <Box>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Ajouter Produits
          </Button>
        </Box>
      )}
      {products && (
        <Box p={2}>
          <TextField
            name="search"
            label="Rechercher par nom ou coût"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <div>
            {filteredProducts.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemText
                    primary={item.name}
                    secondary={`Coût: ${item.cost}`}
                  />
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
        <DialogTitle>{EditId ? "Modifier Produit" : "Ajouter Produit"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              required
              name="name"
              label="Nom"
              type="text"
              fullWidth
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              name="cost"
              label="Coût"
              type="number"
              fullWidth
              margin="dense"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              clearForm();
            }}
            color="secondary"
          >
            Annuler
          </Button>
          <Button onClick={handleSave} type="submit" color="primary" variant="contained">
            {EditId ? "Modifier" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className="Modal"
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce produit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Products;
