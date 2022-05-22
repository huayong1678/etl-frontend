import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import {
  Button, Box, List, ListItem, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';

function Transform() {
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = (data) => {
    console.log(data)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const [open, setOpen] = useState(false);

  const [pipelineList, setPipelineList] = useState([
    {
      id: 1,
      dest: 1,
      source: 1,
      tag: 'pipeline-1',
      isSensitive: true,
    },
    {
      id: 2,
      dest: 2,
      source: 2,
      tag: 'pipeline-2',
      isSensitive: true,
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

  return (
    <section className="grid grid-cols-12">
      {/* <IconButton onClick={toggleSlider}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleSlider}>
        {sideList()}
      </Drawer> */}

      <div className="hidden md:flex md:col-span-3 lg:col-span-2 xl:col-span-2">
        <Sidebar page={`transform`} />
      </div>
      <div className="contentBox">
        <p className="text-4xl">Transforms</p>
        <p className="text-md pt-1">Transform / Lists</p>

        <Button variant="contained" className="createButton" onClick={() => openModal()}>Create Transform</Button>

        <TableContainer component={Paper} className="mt-8">
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Pipeline Tag</TableCell>
                <TableCell>Source Tag</TableCell>
                <TableCell>Source Database</TableCell>
                <TableCell>Destination Tag</TableCell>
                <TableCell>Destination Database</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pipelineList.map((row, index) => (
                <TableRow
                  key={`pipelineList-${index}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.tag}
                  </TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
}

export default Transform;
