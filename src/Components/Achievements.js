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
  const [description, setDescription] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [score, setScore] = useState("");
  const [quality, setQuality] = useState("");
  const [icon, setIcon] = useState("");
  const [uid, setUid] = useState("");
  const [achievementsData, setAchievementsData] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const q = query(collection(db, "achievement"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const achievementsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAchievementsData(achievementsData);
      setFilteredAchievements(achievementsData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribe;
    fetchData().then((sub) => {
      unsubscribe = sub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (name.trim() === '' || type.trim() === '' || description.trim() === '' || goalValue.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }

    let data = {
      name: name,
      type: type,
      description: description,
      goalvalue: goalValue,
      score: score,
      quality: quality,
      icon: icon,
      uid: uid
    };

    try {
      if (editId) {
        const docRef = doc(db, "achievement", editId);
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

  const handleEdit = (achievement) => {
    setEditId(achievement.id);
    setName(achievement.name);
    setType(achievement.type);
    setDescription(achievement.description);
    setGoalValue(achievement.goalvalue);
    setScore(achievement.score);
    setQuality(achievement.quality);
    setIcon(achievement.icon);
    setUid(achievement.uid);
    setShowModal(true);
  };

  const clearForm = () => {
    setName("");
    setType("");
    setDescription("");
    setGoalValue("");
    setScore("");
    setQuality("");
    setIcon("");
    setUid("");
    setEditId(null);
    setShowModal(false);
  };

  const handleSearchAndFilter = (searchTerm) => {
    const filteredData = achievementsData.filter((achievement) => {
      const searchCondition = !searchTerm ||
        achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.goalValue.toString().includes(searchTerm.toLowerCase());
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
            label="Search by name, type, description, or goal value"
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
                    secondary={`Type: ${item.type}, Description: ${item.description}, Goal Value: ${item.goalvalue}`}
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
        <DialogTitle>{editId ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
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
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              required
              name="goalValue"
              label="Goal Value"
              variant="outlined"
              fullWidth
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
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
