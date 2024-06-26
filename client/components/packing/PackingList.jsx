import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField, List, ListItem, ListItemText, IconButton, Paper, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const PackingList = () => {
  // packingLists = variable that holds the current state
    // currently an empty array until setPackingLists is called with a new value
  // setPackingLists = used to update packingLists
    // when called, it will trigger a re-render of the component with updated state
  const [packingLists, setPackingLists] = useState([]);
  // newListName = variable that holds the current state aka empty string
  // setNewListName = used to update newListName
  const [newListName, setNewListName] = useState('');
  // editing = variable that holds the current state aka null
  // setEditing = used to update editing
  const [editing, setEditing] = useState(null);
  // editingName = variable that holds the current state aka empty string
  // setEditingName = used to update editingName
  const [editingName, setEditingName] = useState('');

  // useEffect = hook which is used to make a get request to /packingList
  // whatever passed in is executed after every render
  // get request is done when the component mounts and ONLY when it mounts
  // [] = dependency array
  useEffect(() => {
    axios.get('/api/packingList')
    // response object contains props: data, status, statusText, headers, config
    // we want the data prop and we want it to be assigned to packingLists
      .then((response) => {
        setPackingLists(response.data)
      })
      .catch((err) => {
        console.error('Error getting packing lists', err)
      })
  }, []);

  // add a new packing list and make sure the component's state is updated so the new list is shown
  const handleAdd = () => {
    // send post req to /packingList
    // req body contains object w prop name so we are setting it to newListName
    axios.post('/api/packingList', { name: newListName })
      .then(() => {
        // setNewListName is called to clear the newListName input
        // reset it to empty string
        setNewListName('');
        // after clearing newListName, get req is sent to /packingList to get the updated lists
        axios.get('/api/packingList')
          .then((response) => {
            // assign data prop to packingLists by using setPackingLists
            setPackingLists(response.data);
          })
          .catch((err) => {
            console.error('Error getting new packing lists', err);
          })
      })
      .catch((err) => {
        console.error('Error adding new packing list', err);
      })
  };

  // delete a packing list by its id
  const handleDelete = (id) => {
    // send delete req to /packingList/id
    // takes in the specific id of the list we wanna delete
    axios.delete(`/api/packingList/${id}`)
      .then(() => {
        // filter through the current packingLists
        // check each list's id and if the id does not match the id to delete, add that list to the filter function's array
        setPackingLists(packingLists.filter(list => list.id !== id));
      })
      .catch((err) => {
        console.error('Error deleting packing list', err);
      })
  };

  // set up state for editing a specific packing list
  const handleEdit = (id, name) => {
    // updates the state to whatever item is being edited by its id
    setEditing(id);
    // sets the name state to the current name
    setEditingName(name);
  };

  // update a packing list by its id
  const handleUpdate = (id) => {
    // send put req to /packingList/id taking in the specific id of the list we wanna update
    // req body has a name prop which is set to the current val of editingName
    axios.put(`/api/packingList/${id}`, { name: editingName })
    .then(() => {
      // no item is being edited
      setEditing(null);
      // get req to /packingList to get the updated packing lists
      axios.get('/api/packingList')
        .then((response) => {
          // assign data prop to packingLists by using setPackingLists
          setPackingLists(response.data);
        })
        .catch((err) => {
          console.error('Error getting updated packing list', err);
        })
    })
    .catch((err) => {
      console.error('Error updating packing list', err);
    })
  };

  return (
    // use box as a wrapper for my styling
    <Box p={3}>
      <Typography variant='h4'>Packing Lists</Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="New List"
              fullWidth
              // set the value of input field to newListName
              value={newListName}
              // update newListName with the current input field value when it changes
              onChange={(event) => setNewListName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* call handleAdd function when button is clicked */}
            <Button onClick={handleAdd} variant='contained' fullWidth>Add List</Button>
          </Grid>
        </Grid>
      </Paper>
      <List>
        {/* map function to iterate over packingLists */}
        {/* for each list, return a listitem component */}
        {packingLists.map((list) => (
          // give it a key because there will be an error in the browser if not
          <Paper key={list.id} elevation={3} sx={{ marginBottom: 2 }}>
            <ListItem>
              {/* if the current item is being edited aka if editing = list.id aka current list item is being edited */}
              {editing === list.id ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    {/* render a TextField component so the user can type a new name for the packing list */}
                    {/* set value to be the editingName state variable */}
                    {/* onChange will update editingName to whatever someone typed */}
                    <TextField
                      value={editingName}
                      fullWidth
                      onChange={(event) => setEditingName(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {/* when the Save button is clicked, call handleUpdate with the list id to save the changes */}
                    <Button onClick={() => handleUpdate(list.id)} variant="contained" fullWidth>Save</Button>
                  </Grid>
                </Grid>
              ) : (
                // if it is not being edited, render a link to the packing lists
                <Link to={`/packing-lists/${list.id}`} style={{ textDecoration: 'none', flexGrow: 1 }}>
                  {/* make the name of the packing list as the text of the link */}
                  <ListItemText primary={list.name} />
                </Link>
              )}
              {editing !== list.id && (
                <Box>
                  {/* if it isn't being edited, make a button with the edit icon where it can handle edits of the name */}
                  <IconButton onClick={() => handleEdit(list.id, list.name)} sx={{ backgroundColor: 'lightgreen' }}>
                    <EditIcon sx={{ color: 'black' }} />
                  </IconButton>
                  {/* or can delete the list */}
                  <IconButton onClick={() => handleDelete(list.id)} sx={{ backgroundColor: 'lightgreen' }}>
                    <DeleteIcon sx={{ color: 'black' }} />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default PackingList;