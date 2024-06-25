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
  ListItemText,
  IconButton,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Achievements = ({ achievements }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [objective, setObjective] = useState("");
  const [reward, setReward] = useState("");
  const [AchievementsData, setAchievementsData] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [EditId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "achievement"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const AchievementsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAchievementsData(AchievementsData);
      setFilteredAchievements(AchievementsData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    fetchData().then((sub) => {
      unsubscribe = sub;
      console.log("fetching data for achievement...");
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (name.trim() === '' || type.trim() === '' || objective.trim() === '' || reward.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }

    let data = {
      name: name,
      type: type,
      objective: objective,
      reward: parseFloat(reward),
    };

    try {
      if (EditId) {
        const docRef = doc(db, "achievement", EditId);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "achievement"), data);
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
      await deleteDoc(doc(db, "achievement", deleteId));
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEdit = (Achievement) => {
    setEditId(Achievement.id);
    setName(Achievement.name);
    setType(Achievement.type);
    setObjective(Achievement.objective);
    setReward(Achievement.reward.toString());
    setShowModal(true);
  };

  const clearForm = () => {
    setName("");
    setType("");
    setObjective("");
    setReward("");
    setEditId(null);
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = AchievementsData.filter((Achievement) => {
      const searchCondition = !searchTerm ||
        Achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Achievement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Achievement.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Achievement.reward.toString().includes(searchTerm.toLowerCase());
      return searchCondition;
    });

    setFilteredAchievements(filteredData);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    handleSearchAndFilter(searchTerm);
  };

  return (
    <>
      {achievements && (
        <Box>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Add Achievement
          </Button>
        </Box>
      )}
      {achievements && (
        <Box p={2}>
          <TextField
            name="search"
            label="Search by name, type, objective, or reward"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: "16px" }}
          />
          <div>
            {filteredAchievements.map((item) => (
              <div key={item.id} className="menu-items">
                <ListItem divider>
                  <ListItemText
                    primary={item.name}
                    secondary={`Type: ${item.type}, Objective: ${item.objective}, Reward: ${item.reward}`}
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
        <DialogTitle>{EditId ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              required
              name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "16px" }}
            />
            <TextField
              required
              name="type"
                label="Type"
                variant="outlined"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ marginBottom: "16px" }}
            />
            <TextField
              required
              name="objective"
                label="Objective"
                variant="outlined"
                fullWidth
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                style={{ marginBottom: "16px" }}
            />
            <TextField
              required
              name="reward"
                label="Reward"
                variant="outlined"
                fullWidth
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                style={{ marginBottom: "16px" }}
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
            Cancel
          </Button>
          <Button onClick={handleSave} type="submit" color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
        </Dialog>

        <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm" fullWidth>
            
            <DialogTitle>Delete Achievement</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this achievement?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmDelete} color="secondary">
                    Delete
                </Button>
                <Button onClick={() => setShowDeleteModal(false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

export default Achievements;


