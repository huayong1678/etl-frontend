import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import {
  Stack, TextField, Button, Box, List, ListItem, ListItemText, LinearProgress
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function CreateSource(props) {
  const navigate = useNavigate()
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = async (data) => {
    const sourceData = {
      host: data.host,
      tag: data.tag,
      user: data.user,
      port: parseInt(data.port),
      password: data.password,
      database: data.database,
      tablename: data.tablename,
      engine: data.engine,
    }

    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const source = location.state.source
      if (source === null) {
        const res = await axios.post(`${SERVICE}/sources/create`, sourceData)
        if (res.status === 200) {
          toast.success(`Creare Source Success`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
          reset()
        } else {
          return toast.error(`Error`)
        }
      } else {
        const res = await axios.post(`${SERVICE}/sources/update/${source.id}`, sourceData)
        if (res.status === 200) {
          toast.success(`Edit Source Success`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
          })
        } else {
          return toast.error(`Error`)
        }
      }
    } catch (e) {
      console.log(e)
      return toast.error(`Error`)
    }
  }

  const location = useLocation()

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const source = location.state.source
    if (source === null) {
      setHeader('Create')
    } else {
      setHeader('Edit')
      setHost(source.host)
      setTag(source.tag)
      setUser(source.user)
      setPort(source.port)
      setPassword(source.password)
      setDatabase(source.database)
      setTablename(source.tablename)
      setEngine(source.engine)
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
  const [engine, setEngine] = useState('PG')

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

  const backButtonHandler = () => {
    navigate('/source')
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
          <p className="text-md pt-1">Source / {header} Source</p>

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

            <Stack className="mt-4 float-right" direction="row" spacing={2}>
              <Button
                variant="contained"
                className="float-right"
                onClick={() => backButtonHandler()}
              >
                Back
              </Button>
              <Button
                variant="contained"
                className="float-right"
                onClick={handleSubmit(onSubmit)}
              >
                {header} Source
              </Button>
            </Stack>
          </form>
        </div>
        <ToastContainer position="bottom-right" />
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

export default CreateSource;
