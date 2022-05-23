import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import { styled, Box } from '@mui/system'
import {
  Stack, TextField, Button, List, ListItem, ListItemText, LinearProgress,
  IconButton, InputBase, MenuItem, Select, Checkbox,
  RadioGroup, FormControlLabel, Radio, TextareaAutosize, CircularProgress
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

import Sidebar from '../../component/Sidebar'

import '../../assets/css/System.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

const Backdrop = styled('div')`
  z-index: -10;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#fbfbf8',
    border: '1px solid #ced4da',
    fontSize: 15,
    padding: '4px 8px 4px 12px',

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  '& .MuiMenuItem': {
    root: {
      fontSize: 15,
      '&$selected': {
        fontSize: 15,
      },
    },
  },
}))

function CreateTranform(props) {
  const navigate = useNavigate()
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = async (data) => {
    // const sourceData = {
    //   host: data.host,
    //   tag: data.tag,
    //   user: data.user,
    //   port: parseInt(data.port),
    //   password: data.password,
    //   database: data.database,
    //   tablename: data.tablename,
    //   engine: data.engine,
    // }

    let schemas = {}
    for (let i = 0; i < sourceColumnList.length; i++) {
      if (sourceColumnList[i].isSelected) {
        schemas[sourceColumnList[i].key] = sourceColumnList[i].value
      }
    }

    // const tags = `${'"['}${"'"}${data.tag}${"'"}${']"'}`
    const transformData = {
      tags: data.tag,
      scripts: [],
      schemas,
      pk: data.sourceColumnPK,
      pipeline_id: pipelineTemp.id,
    }

    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const res = await axios.post(`${SERVICE}/transforms/create`, transformData)
      if (res.status === 200) {
        setPipeline('')
        setPipelineTemp(null)
        setIsFetch(false)

        setSourceConnectText('')
        setDestinationConnectText('')
        setSourceColumnList([])
        setSourceColumnPKList([])
      } else {
        return toast.error(`Error`)
      }
      
    } catch (e) {
      return toast.error(`Error`)
    }

    // try {
    //   const token = localStorage.getItem("cookies");
    //   if (!token) {
    //     navigate('/')
    //   }
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //   axios.defaults.withCredentials = true

    //   const source = location.state.source
    //   if (source === null) {
    //     const res = await axios.post(`${SERVICE}/sources/create`, sourceData)
    //     if (res.status === 200) {
    //       toast.success(`Creare Source Success`, {
    //         position: "bottom-right",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         progress: undefined,
    //       })
    //       reset()
    //     } else {
    //       return toast.error(`Error`)
    //     }
    //   } else {
    //     const res = await axios.post(`${SERVICE}/sources/update/${source.id}`, sourceData)
    //     if (res.status === 200) {
    //       toast.success(`Edit Source Success`, {
    //         position: "bottom-right",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         progress: undefined,
    //       })
    //     } else {
    //       return toast.error(`Error`)
    //     }
    //   }
    // } catch (e) {
    //   return toast.error(`Error`)
    // }
  }

  const location = useLocation()

  const [open, setOpen] = useState(false);

  const [pipelineList, setPipelineList] = useState([]);
  const [pipeline, setPipeline] = useState('');
  const [pipelineTemp, setPipelineTemp] = useState(null);

  const [header, setHeader] = useState('')
  const [tag, setTag] = useState('')

  const [sourceConnectText, setSourceConnectText] = useState('')
  const [destinationConnectText, setDestinationConnectText] = useState('')

  const [sourceColumnList, setSourceColumnList] = useState([])
  const [sourceColumnPKList, setSourceColumnPKList] = useState([])
  const [sourceColumnPK, setSourceColumnPK] = useState('')

  const [isLoad, setIsLoad] = useState(false)
  const [isFetch, setIsFetch] = useState(false)

  useEffect(() => {
    const transform = location.state.transform
    if (transform === null) {
      setHeader('Create')
    } else {
      setHeader('Edit')
    }

    async function fetchData() {
      try {
        const token = localStorage.getItem("cookies");
        if (!token) {
          navigate('/')
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.defaults.withCredentials = true

        const pipelineRes = await axios.get(`${SERVICE}/pipelines/list`)
        if (pipelineRes.status === 200) {
          setPipelineList(pipelineRes.data)
        } else {
          toast.error(`Get Pipeline Error`)
        }

        setIsLoad(true)
      } catch (e) {
        toast.error(`Error`)
      }
    }
    fetchData()

    setIsLoad(true)
  }, [])

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
    navigate('/transform')
  }

  const onPipelineChangeHandler = async (index) => {
    setPipeline(index)
    setPipelineTemp(pipelineList[index])
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const pipelineRes = await axios.get(`${SERVICE}/pipelines/connection/${pipelineList[index].id}`)
      if (pipelineRes.status === 200) {
        setIsFetch(true)
        setDestinationConnectText(pipelineRes.data.dest)
        setSourceConnectText(pipelineRes.data.source)

        if (checkConnection(pipelineRes.data.source)) {
          getSourceColumn(index)
        }
      } else {
        toast.error(`Pipeline Connection Error`)
      }

      setIsLoad(true)
    } catch (e) {
      toast.error(`Error`)
    }
  }

  const checkConnection = (text) => {
    if (text === 'Connection Success'){
      return true
    }
    return false
  }

  const getSourceColumn = async (index) => {
    try {
      const token = localStorage.getItem("cookies");
      if (!token) {
        navigate('/')
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.withCredentials = true

      const pipelineRes = await axios.get(`${SERVICE}/pipelines/source/${pipelineList[index].source}`)
      if (pipelineRes.status === 200) {
        const columnList = []
        for (const [key, value] of Object.entries(pipelineRes.data.data[1])) {
          const columnObject = {
            key,
            value,
            isSelected: false,
          }
          columnList.push(columnObject)
        }
        setSourceColumnList(columnList)
      } else {
        toast.error(`Pipeline Connection Error`)
      }

      setIsLoad(true)
    } catch (e) {
      toast.error(`Error`)
    }
  }

  const checkboxHandler = (index, checked) => {
    const newList = [...sourceColumnList]
    newList[index].isSelected = checked
    setSourceColumnList(newList)

    const newPKList = [...sourceColumnPKList]
    if (checked) {
      newPKList.push(newList[index].key)
    } else {
      newPKList.splice(newPKList.indexOf(newList[index].key), 1)
    }
    setSourceColumnPKList(newPKList)
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
          <Sidebar page={`transform`} />
        </div>
        <div className="contentBox">
          <p className="text-4xl">Transforms</p>
          <p className="text-md pt-1">Transform / {header} Transform</p>

          <Stack className="mt-5 flex items-center" direction="row" spacing={2}>
            <p className="pl-1 pb-1 text-lg">Pipeline : </p>
            <Select
              input={<BootstrapInput />}
              className="w-3/6 py-0"
              placeholder="โปรดระบุ"
              onChange={(e) => onPipelineChangeHandler(e.target.value)}
              value={pipeline}
              MenuProps={{
                sx: {
                  '&& .MuiMenuItem-root': {
                    fontSize: 12,
                    padding: 1.5,
                  },
                  '&& .MuiList-root': {
                    padding: 0,
                  },
                },
              }}
            >
              {
                pipelineList.map((item, index) => (
                  <MenuItem key={`pipeline-${index}`} value={index}>{item.tag}</MenuItem>
                ))
              }
            </Select>
          </Stack>
          
          <form>
            <div className="pipelineBox">
                {pipeline === '' ? (
                  <p className="text-xl mx-auto">Please Select Pipeline</p>
                ) : (
                  <>
                    {isFetch ? (
                      <div className="grid grid-cols-12 w-full">
                        <Stack className="col-span-12 md:col-span-6 flex justify-content-center">
                          <p className="text-lg mx-auto">Source</p>
                          <p className="text-lg mx-auto">{sourceConnectText}</p>
                          <div className="mx-auto">
                          {sourceColumnList.length > 0 ? (
                            <>
                              {sourceColumnList.map((item, index) => (
                                <Stack direction="row" spacing={1} key={`source-column-${index}`} className="flex items-center">
                                  <Stack spacing={1}>
                                  <Checkbox
                                    checked={sourceColumnList[index].isSelected}
                                    onChange={(e) => checkboxHandler(index, e.target.checked)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                  />
                                  </Stack>
                                  <p>{item.key} : {item.value}</p>
                                </Stack>
                              ))}
                              <Stack direction="row" spacing={1} className="flex items-center">
                                <p className="whitespace-nowrap">PK : </p>
                                <Stack className="w-4/6">
                                  <Controller
                                    name="sourceColumnPK"
                                    control={control}
                                    rules={{
                                      required: true,
                                    }}
                                    defaultValue={sourceColumnPK}
                                    render={({ field: { onChange, value } }) => (
                                      <Select
                                        input={<BootstrapInput />}
                                        className="w-full py-0"
                                        placeholder="โปรดระบุ"
                                        onChange={onChange}
                                        value={value}
                                        MenuProps={{
                                          sx: {
                                            '&& .MuiMenuItem-root': {
                                              fontSize: 12,
                                              padding: 1.5,
                                            },
                                            '&& .MuiList-root': {
                                              padding: 0,
                                            },
                                          },
                                        }}
                                      >
                                        {
                                          sourceColumnPKList.map((item, index) => (
                                            <MenuItem key={`source-pk-${index}`} value={item}>{item}</MenuItem>
                                          ))
                                        }
                                      </Select>
                                    )}
                                  />
                                  <p className="errorText text-left">
                                    {errors.sourceColumnPK?.type === 'required' && 'โปรดระบุ PK'}
                                  </p>
                                </Stack>
                              </Stack>

                              <Stack direction="row" spacing={1} className="flex items-center">
                                <p className="whitespace-nowrap">Tag : </p>
                                <Stack className="w-4/6">
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
                                        placeholder="Transform Tag"
                                      />
                                    )}
                                  />
                                  <p className="errorText text-left">
                                    {errors.tag?.type === 'required' && 'โปรดระบุชื่อ Tag'}
                                  </p>
                                </Stack>     
                              </Stack>
                            </>
                          ) : (
                            <p>Don't have any column in this database</p>
                          )}
                          </div>
                        </Stack>
                        <Stack className="col-span-12 md:col-span-6">
                          <p className="text-lg mx-auto">Destination</p>
                          <p className="text-lg mx-auto">{destinationConnectText}</p>
                        </Stack>
                      </div>
                    ) : <CircularProgress className="mx-auto"/>}
                  </>
                )}
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
                {header} Transform
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

export default CreateTranform;
