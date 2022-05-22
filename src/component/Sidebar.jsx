import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import {
  Stack, TextField, InputAdornment, Button, Box, List, ListItem, ListItemText, IconButton, Drawer, buttonBaseClasses
} from '@mui/material'

import LogoutIcon from '@mui/icons-material/Logout';

import '../assets/css/Sidebar.css';

function Sidebar(props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);

  const toggleSlider = () => {
    setOpen(!open);
  };

  const logout = () => {
    navigate('/')
  }

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
    <>
      <section className="sideBar">
        {/* <IconButton onClick={toggleSlider}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleSlider}>
        {sideList()}
      </Drawer> */}
        <Stack className="pt-28">
          {props.page === 'pipeline' ? (
            <div className="selectedButton">
              <p className="text-2xl py-4 pl-12">Pipeline</p>
            </div>
          ) : (
            <Link to="/pipeline">
              <p className="text-2xl py-4 pl-12">Pipeline</p>
            </Link>
          )}

          {props.page === 'source' ? (
            <div className="selectedButton">
              <p className="text-2xl py-4 pl-12">Sources</p>
            </div>
          ) : (
            <Link to="/source">
              <p className="text-2xl py-4 pl-12">Sources</p>
            </Link>
          )}

          {props.page === 'destination' ? (
            <div className="selectedButton">
              <p className="text-2xl py-4 pl-12">Destination</p>
            </div>
          ) : (
            <Link to="/Destination">
              <p className="text-2xl py-4 pl-12">Destination</p>
            </Link>
          )}

          {props.page === 'transform' ? (
            <div className="selectedButton">
              <p className="text-2xl py-4 pl-12">Transform</p>
            </div>
          ) : (
            <Link to="/transform">
              <p className="text-2xl py-4 pl-12">Transform</p>
            </Link>
          )}
        </Stack>
        
        <button className="logoutButton" onClick={() => logout()}>
          <Stack direction="row" className="mx-auto">
            <LogoutIcon />
            <p className="text-lg pl-2">Logout</p>
          </Stack>
        </button>

      </section >
    </>
  );
}

export default Sidebar;
