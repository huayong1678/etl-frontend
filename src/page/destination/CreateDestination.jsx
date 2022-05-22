import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import {
  Stack, TextField, InputAdornment, Button, Box, List, ListItem, ListItemText, IconButton, Drawer,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DataGrid
} from '@mui/material'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';

function CreateDestination() {
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = (data) => {
    console.log(data)
  }

  const location = useLocation()

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const destination = location.state.destination
    if (destination === null) {
      setHeader('Create')
    } else {
      setHeader('Edit')
      setHost(destination.host)
      setTag(destination.tag)
      setUser(destination.user)
      setPort(destination.port)
      setPassword(destination.password)
      setDatabase(destination.database)
      setTablename(destination.tablename)
      setEngine(destination.engine)
    }
    setIsLoad(true)
  }, [])

  const [header, setHeader] = useState('')

  const [host, setHost] = useState('')
  const [tag, setTag] = useState('')
  const [user, setUser] = useState('')
  const [port, setPort] = useState('')
  const [password, setPassword] = useState('')
  const [database, setDatabase] = useState('')
  const [tablename, setTablename] = useState('')
  const [engine, setEngine] = useState('pg')

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
          <p className="text-md pt-1">Destination / {header} Destination</p>

          <form>
            <div className="grid grid-cols-12 mt-5">
              <div className="col-span-12 md:col-span-6 md:pr-2">
                <p className="pl-1 pb-1 text-lg">Host : </p>
                <Stack>
                  <Controller
                    name="host"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={host}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Host"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.host?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>

              <div className="col-span-12 md:col-span-6 md:pl-2">
                <p className="pl-1 pb-1 text-lg">Tag : </p>
                <Stack>
                  <Controller
                    name="tag"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={tag}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Tag"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.tag?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-2">
              <div className="col-span-12 md:col-span-6 md:pr-2">
                <p className="pl-1 pb-1 text-lg">User : </p>
                <Stack>
                  <Controller
                    name="user"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={user}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="User"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.user?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>

              <div className="col-span-12 md:col-span-6 md:pl-2">
                <p className="pl-1 pb-1 text-lg">Port : </p>
                <Stack>
                  <Controller
                    name="port"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={port}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Port"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.port?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-2">
              <div className="col-span-12 md:col-span-6 md:pr-2">
                <p className="pl-1 pb-1 text-lg">Password : </p>
                <Stack>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={password}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Password"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.password?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>

              <div className="col-span-12 md:col-span-6 md:pl-2">
                <p className="pl-1 pb-1 text-lg">Database : </p>
                <Stack>
                  <Controller
                    name="database"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={database}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Database"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.database?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-2">
              <div className="col-span-12 md:col-span-6 md:pr-2">
                <p className="pl-1 pb-1 text-lg">Tablename : </p>
                <Stack>
                  <Controller
                    name="tablename"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={tablename}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Tablename"
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.tablename?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>

              <div className="col-span-12 md:col-span-6 md:pl-2">
                <p className="pl-1 pb-1 text-lg">Engine : </p>
                <Stack>
                  <Controller
                    name="engine"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    defaultValue={engine}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        className="w-full"
                        size="small"
                        onChange={onChange}
                        value={value}
                        placeholder="Engine"
                        disabled
                      />
                    )}
                  />
                  <p className="errorText">
                    {errors.engine?.type === 'required' && 'โปรดระบุข้อมูล'}
                  </p>
                </Stack>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="contained"
                className="float-right"
                onClick={handleSubmit(onSubmit)}
              >
                Create Destination
            </Button>
            </div>
          </form>
        </div>
      </section>
    );
  } else {
    return (
      <>
      </>
    )
  }
}

export default CreateDestination;
