import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import {
  Button, Box, List, ListItem, ListItemText, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material'

import {
  CalendarToday, MedicalServices, Edit, Delete, Add,
} from '@mui/icons-material'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';

function Destination() {
  const navigate = useNavigate()
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = (data) => {
    console.log(data)
  }

  const [open, setOpen] = useState(false);
  const [destinationList, setDestinationList] = useState([
    {
      id: 1,
      host: 'localhost',
      tag: 'postgres-local',
      user: 'postgres',
      port: '5432',
      password: 'docker',
      database: 'postgres',
      tablename: 'contacts',
      engine: 'pg',
    },
    {
      id: 2,
      host: 'localhost',
      tag: 'postgres-local',
      user: 'postgres',
      port: '5432',
      password: 'docker',
      database: 'postgres',
      tablename: 'contacts',
      engine: 'pg',
    },
  ]);

  const toggleSlider = () => {
    setOpen(!open);
  };

  const sideList = () => (
    <Box component="div">
      <List>
        <ListItem button>
          <ListItemText primary="Pipeline" />
        </ListItem>
      </List>
    </Box>
  );

  const createDestination = () => {
    navigate('/create-destination', { state: { destination: null } })
  }

  const editDestination = (index) => {
    navigate('/create-destination', { state: { destination: destinationList[index] } })
  }

  return (
    <section className="grid grid-cols-12">
      {/* <IconButton onClick={toggleSlider}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleSlider}>
        {sideList()}
      </Drawer> */}

      <div className="hidden md:flex md:col-span-3 lg:col-span-2 xl:col-span-2">
        <Sidebar page={`destination`} />
      </div>
      <div className="contentBox">
        <p className="text-4xl">Destinations</p>
        <p className="text-md pt-1">Destination / Lists</p>

        <Button variant="contained" className="createButton" onClick={() => createDestination()}>Create Destination</Button>

        <TableContainer component={Paper} className="mt-8">
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Host</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Database</TableCell>
                <TableCell>Tablename</TableCell>
                <TableCell>Engine</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {destinationList.map((row, index) => (
                <TableRow
                  key={`destinationList-${index}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.host}
                  </TableCell>
                  <TableCell>{row.tag}</TableCell>
                  <TableCell>{row.database}</TableCell>
                  <TableCell>{row.tablename}</TableCell>
                  <TableCell>{row.engine}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="close"
                      className="tableEditIcon"
                      size="small"
                      onClick={() => editDestination(index)}
                    >
                      <Edit fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                      className="tableDeleteIcon"
                      size="small"
                      onClick={() => console.log("delete")}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
}

export default Destination;
