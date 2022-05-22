import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import {
  Button, Box, List, ListItem, ListItemText, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import {
  CalendarToday, MedicalServices, Edit, Delete, Add,
} from '@mui/icons-material'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function Source() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [sourceList, setSourceList] = useState([]);
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
        console.log(e)
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
        <ToastContainer position="bottom-right" />
      </section>
    );
  } else {
    return (
      <>
      </>
    )
  }
}

export default Source;
