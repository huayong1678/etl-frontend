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

import '../../assets/css/System.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function Destination() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [destinationList, setDestinationList] = useState([]);
  const [destinationTemp, setdestinationTemp] = useState(null);

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
        const res = await axios.get(`${SERVICE}/dests/list`)
        if (res.status === 200) {
          setDestinationList(res.data)
          setIsLoad(true)
        } else {
          toast.error(`Error`)
        }
      } catch (e) {
        console.log(e)
        toast.error(`Error`)
      }
    }
    fetchData()
  }, [])

  const createDestination = () => {
    navigate('/create-destination', { state: { destination: null } })
  }

  const editDestination = (index) => {
    navigate('/create-destination', { state: { destination: destinationList[index] } })
  }

  const deleteDestination = async () => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true
      const res = await axios.get(`${SERVICE}/dests/delete/${destinationTemp.id}`)
      if (res.status === 200) {
        const newList = [...destinationList]
        newList.splice(destinationList.indexOf(destinationTemp), 1)
        setDestinationList(newList)

        toast.success(`Delete Destination Success`, {
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
      console.log(e)
      toast.error(`Error`)
    }
  }

  const openDialog = (item) => {
    setdestinationTemp(item)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
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
        {destinationTemp !== null ? (
          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
          >
            <DialogTitle>
              {'Are you sure that you want to delete this source?'}
            </DialogTitle>
            <DialogContent>
              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Host : ${destinationTemp.host}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Tag : ${destinationTemp.tag}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Database : ${destinationTemp.database}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Tablename : ${destinationTemp.tablename}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12">
                  {`Engine : ${destinationTemp.engine}`}
                </DialogContentText>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog()}>Disagree</Button>
              <Button onClick={() => deleteDestination()} autoFocus>
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

export default Destination;
