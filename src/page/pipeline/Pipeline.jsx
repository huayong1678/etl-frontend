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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setPipelineTemp(null)
    setIsModalOpen(false)
  }

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        console.log(token)
        if (!token) {
          navigate('/')
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.defaults.withCredentials = true

        console.log('0')
        const sourceRes = await axios.get(`${SERVICE}/sources/list`)
        if (sourceRes.status === 200) {
          console.log('1')
          setSourceList(sourceRes.data)
        } else {
          toast.error(`Get Source Error`)
        }

        const destinationRes = await axios.get(`${SERVICE}/dests/list`)
        if (destinationRes.status === 200) {
          console.log('2')
          setDestinationList(destinationRes.data)
        } else {
          toast.error(`Get Destination Error`)
        }

        const pipelineRes = await axios.get(`${SERVICE}/pipelines/list`)
        if (pipelineRes.status === 200) {
          console.log('3')
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
      toast.error(`Error`)
    }
  }

  const editButtonHandler = (row) => {
    setPipelineTemp(row)
    openModal()
  }

  const editPipeline = async (newPipeline) => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const res = await axios.post(`${SERVICE}/pipelines/update/${newPipeline.id}`, newPipeline)
      if (res.status === 200) {
        toast.success(`Edit Pipeline Success`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })
        const newList = [...pipelineList]
        newList[pipelineList.indexOf(pipelineTemp)] = newPipeline
        setPipelineList(newList)
      } else {
        return toast.error(`Error`)
      }
    } catch (e) {
      return toast.error(`Error`)
    }
  }

  const deletePipeline = async () => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true
      const res = await axios.post(`${SERVICE}/pipelines/delete/${pipelineTemp.id}`)
      if (res.status === 200) {
        const newList = [...pipelineList]
        newList.splice(pipelineList.indexOf(pipelineTemp), 1)
        setPipelineList(newList)

        toast.success(`Delete Pipeline Success`, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })

        closeDialog()
      } else {
        toast.error(`Error`)
      }
    } catch (e) {
      toast.error(`Error`)
    }
  }

  const openDialog = (item) => {
    setPipelineTemp(item)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  if (isLoad) {
    return (
      <section className="grid grid-cols-12">
        {/* <IconButton onClick={toggleSlider}>
        <MenuIcon />isFetch
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
                    <TableCell>
                      <IconButton
                        aria-label="close"
                        className="tableEditIcon"
                        size="small"
                        onClick={() => editButtonHandler(row)}
                      >
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="close"
                        className="tableDeleteIcon"
                        size="small"
                        onClick={() => openDialog(row)}
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
        <ToastContainer position="bottom-right" />
        {isModalOpen ? (
          <CreatePipelineModal
            isOpen={isModalOpen}
            handleClose={() => closeModal()}
            sourceList={sourceList}
            destinationList={destinationList}
            toast={toast}
            createPipeline={(data) => createPipeline(data)}
            editPipeline={(newPipeline) => editPipeline(newPipeline)}
            pipelineTemp={pipelineTemp}
          />
        ) : null}
        {pipelineTemp !== null ? (
          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
          >
            <DialogTitle>
              {'Are you sure that you want to delete this source?'}
            </DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12">
                  {`Pipeline Tag : ${pipelineTemp.tag}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Source Tag : ${getSourceTag(pipelineTemp.source)}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Source Database : ${getSourceDatabase(pipelineTemp.source)}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Destination Tag: ${getDestinationTag(pipelineTemp.dest)}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Destination Database : ${getDestinationDatabase(pipelineTemp.dest)}`}
                </DialogContentText>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog()}>Disagree</Button>
              <Button onClick={() => deletePipeline()} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
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
