import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import {
  Button, Box, List, ListItem, ListItemText, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import {
  Edit, Delete,
} from '@mui/icons-material'

import Sidebar from '../../component/Sidebar'
import CreatePipelineModal from './CreatePipelineModal'

import '../../assets/css/System.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function Pipeline() {
  const navigate = useNavigate()
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
  const [destinationList, setDestinationList] = useState([]);

  const [sourceList, setSourceList] = useState([]);

  const [pipelineList, setPipelineList] = useState([]);
  const [pipelineTemp, setPipelineTemp] = useState(null);

  const [isLoad, setIsLoad] = useState(false)

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

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("cookies");
        if (!token) {
          navigate('/')
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.defaults.withCredentials = true

        const sourceRes = await axios.get(`${SERVICE}/sources/list`)
        if (sourceRes.status === 200) {
          setSourceList(sourceRes.data)
        } else {
          toast.error(`Get Source Error`)
        }

        const destinationRes = await axios.get(`${SERVICE}/dests/list`)
        if (destinationRes.status === 200) {
          setDestinationList(destinationRes.data)
        } else {
          toast.error(`Get Destination Error`)
        }

        const pipelineRes = await axios.get(`${SERVICE}/pipelines/list`)
        if (pipelineRes.status === 200) {
          setPipelineList(pipelineRes.data)
        } else {
          toast.error(`Get Pipeline Error`)
        }

        setIsLoad(true)
      } catch (e) {
        console.log(e)
        toast.error(`Error`)
      }
    }
    fetchData()
  }, [])

  const getSourceTag = (id) => {
    for (let i = 0; i < sourceList.length; i++) {
      if (sourceList[i].id === id) {
        return sourceList[i].tag
      }
    }
    return ''
  }

  const getDestinationDatabase = (id) => {
    for (let i = 0; i < destinationList.length; i++) {
      if (destinationList[i].id === id) {
        return destinationList[i].database
      }
    }
    return ''
  }

  const getDestinationTag = (id) => {
    for (let i = 0; i < destinationList.length; i++) {
      if (destinationList[i].id === id) {
        return destinationList[i].tag
      }
    }
    return ''
  }

  const getSourceDatabase = (id) => {
    for (let i = 0; i < sourceList.length; i++) {
      if (sourceList[i].id === id) {
        return sourceList[i].database
      }
    }
    return ''
  }

  const createPipeline = async (data) => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const pipelineData = {
        tag: data.tag,
        source: data.source,
        dest: data.destination
      }
      const res = await axios.post(`${SERVICE}/pipelines/create`, pipelineData)
      if (res.status === 200) {
        const newList = [...pipelineList]
        newList.push(res.data)
        setPipelineList(newList)
        toast.success(`Create Pipeline Success`)
      } else {
        toast.error(`Create Pipeline Error`)
      }

    } catch (e) {
      console.log(e)
      toast.error(`Error`)
    }
  }

  if (isLoad) {
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
          toast={toast}
          createPipeline={(data) => createPipeline(data)}
        />
      </section>
    );
  } else {
    <section className="w-full pt-1">
      <LinearProgress />
      <ToastContainer position="bottom-right" />
    </section>
  }
}

export default Pipeline;
