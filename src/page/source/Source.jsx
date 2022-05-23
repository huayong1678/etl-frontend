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

function Source() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [sourceList, setSourceList] = useState([]);
  const [sourceTemp, setSourceTemp] = useState(null);

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
        const res = await axios.get(`${SERVICE}/sources/list`)
        if (res.status === 200) {
          setSourceList(res.data)
          setIsLoad(true)
        } else {
          toast.error(`Error`)
        }
      } catch (e) {
        toast.error(`Error`)
      }
    }
    fetchData()
  }, [])

  const createSource = () => {
    navigate('/create-source', { state: { source: null } })
  }

  const editSource = (index) => {
    navigate('/create-source', { state: { source: sourceList[index] } })
  }

  const deleteSource = async () => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true
      const res = await axios.get(`${SERVICE}/sources/delete/${sourceTemp.id}`)
      if (res.status === 200) {
        const newList = [...sourceList]
        newList.splice(sourceList.indexOf(sourceTemp), 1)
        setSourceList(newList)

        toast.success(`Delete Source Success`, {
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
    setSourceTemp(item)
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
          <Sidebar page={`source`} />
        </div>
        <div className="contentBox">
          <p className="text-4xl">Sources</p>
          <p className="text-md pt-1">Source / Lists</p>

          <Button variant="contained" className="createButton" onClick={() => createSource()}>Create Source</Button>

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
                {sourceList.map((row, index) => (
                  <TableRow
                    key={`sourceList-${index}`}
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
                        onClick={() => editSource(index)}
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
        {sourceTemp !== null ? (
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
                  {`Host : ${sourceTemp.host}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Tag : ${sourceTemp.tag}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Database : ${sourceTemp.database}`}
                </DialogContentText>
                <DialogContentText className="col-span-12 sm:col-span-6">
                  {`Tablename : ${sourceTemp.tablename}`}
                </DialogContentText>
              </div>

              <div className="grid grid-cols-12 text-center">
                <DialogContentText className="col-span-12">
                  {`Engine : ${sourceTemp.engine}`}
                </DialogContentText>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog()}>Disagree</Button>
              <Button onClick={() => deleteSource()} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </section>
    );
  } else {
    return (
      <section className="w-full pt-1">
        <LinearProgress />
        <ToastContainer position="bottom-right" />
      </section>
    )
  }
}

export default Source;
