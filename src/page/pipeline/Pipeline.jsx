import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import {
  Button, Box, List, ListItem, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material'

import Sidebar from '../../component/Sidebar'
import CreatePipelineModal from './CreatePipelineModal'

import '../../assets/css/System.css';

function Pipeline() {
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

  const [sourceList, setSourceList] = useState([
    {
      id: 1,
      host: 'localhost',
      tag: 'postgres-local1',
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
      tag: 'postgres-local2',
      user: 'postgres',
      port: '5432',
      password: 'docker',
      database: 'postgres',
      tablename: 'contacts',
      engine: 'pg',
    },
  ]);

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

  const getSourceTag = (id) => {
    for (let i = 0; i < sourceList.length; i++){
      if (sourceList[i].id === id){
        return sourceList[i].tag
      }
    }
    return ''
  }

  const getDestinationDatabase = (id) => {
    for (let i = 0; i < destinationList.length; i++){
      if (destinationList[i].id === id){
        return destinationList[i].database
      }
    }
    return ''
  }

  const getDestinationTag = (id) => {
    for (let i = 0; i < destinationList.length; i++){
      if (destinationList[i].id === id){
        return destinationList[i].tag
      }
    }
    return ''
  }

  const getSourceDatabase = (id) => {
    for (let i = 0; i < sourceList.length; i++){
      if (sourceList[i].id === id){
        return sourceList[i].database
      }
    }
    return ''
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
        <Sidebar page={`pipeline`} />
      </div>
      <div className="contentBox">
        <p className="text-4xl">Pipelines</p>
        <p className="text-md pt-1">Pipeline / Lists</p>

        <Button variant="contained" className="createButton" onClick={() => openModal()}>Create Pipeline</Button>

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
                  <TableCell>{getSourceTag(row.source)}</TableCell>
                  <TableCell>{getSourceDatabase(row.source)}</TableCell>
                  <TableCell>{getDestinationTag(row.dest)}</TableCell>
                  <TableCell>{getDestinationDatabase(row.dest)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <CreatePipelineModal 
        isOpen={isModalOpen}
        handleClose={() => closeModal()}
        sourceList={sourceList}
        destinationList={destinationList}
      />
    </section>
  );
}

export default Pipeline;
