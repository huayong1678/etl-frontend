import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'

import { styled, Box } from '@mui/system'
import {
  IconButton, Stack, InputBase, MenuItem, Select,
  Button, RadioGroup, FormControlLabel, Radio, TextareaAutosize, TextField
} from '@mui/material'

import { Close } from '@mui/icons-material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ModalUnstyled from '@mui/base/ModalUnstyled'

import '../../assets/css/System.css';

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

function CreatePipelineModal(props) {
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = (data) => {
    if (pipelineTemp === null) {
      createPipeline(data)
    } else {
      const newPipeline = {
        id: pipelineTemp.id,
        tag: data.tag,
        source: data.source,
        dest: data.destination
      }
      editPipeline(newPipeline)
    }
    reset()
    closeModal()
  }

  const {
    handleClose, isOpen, sourceList, destinationList, createPipeline, pipelineTemp, editPipeline
  } = props

  const [tag, setTag] = useState('')
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')

  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    if (pipelineTemp === null) {
      setIsLoad(true)
    } else {
      setTag(pipelineTemp.tag)
      setSource(pipelineTemp.source)
      setDestination(pipelineTemp.dest)
      
      setIsLoad(true)
    }
  }, [])

  const closeModal = () => {
    reset()
    handleClose()
  }

  if (isLoad) {
    return (
      <ModalUnstyled
        className="styledModal"
        open={isOpen}
        onClose={closeModal}
        BackdropComponent={Backdrop}
      >
        <Box className="formModal">

          <div className="w-full">
            <IconButton
              className={"closeModalButton"}
              aria-label="close"
              onClick={() => closeModal()}
            >
              <Close fontSize="small" />
            </IconButton>
          </div>

          <p className="modalHeaderText">Create Your Pipeline</p>

          <section className="px-10">
            <form>
              <div className="w-full grid grid-cols-12 pt-3">

                <div className="flex col-span-3 self-center pr-2">
                  <p className="modalFormText">Tag</p>
                </div>

                <div className="flex col-span-9">
                  <Stack className="w-full">
                    <Controller
                      name="tag"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      defaultValue={tag}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          className="w-5/6"
                          size="small"
                          onChange={onChange}
                          value={value}
                          placeholder="Pipeline Tag"
                        />
                      )}
                    />
                    <p className="errorText">
                      {errors.tag?.type === 'required' && 'โปรดระบุชื่อ Tag'}
                    </p>
                  </Stack>
                </div>

              </div>

              <div className="w-full grid grid-cols-12 pt-1">

                <div className="flex col-span-3 pr-2 pt-2">
                  <p className="modalFormText">Source</p>
                </div>

                <div className="flex col-span-9">
                  <Stack className="w-full">
                    <Controller
                      name="source"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      defaultValue={source}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          input={<BootstrapInput />}
                          className="w-5/6 py-0"
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
                            sourceList.map((item, index) => (
                              <MenuItem key={`source-${index}`} value={item.id}>{item.tag}</MenuItem>
                            ))
                          }
                        </Select>
                      )}
                    />
                    <p className="errorText">
                      {errors.source?.type === 'required' && 'โปรดระบุ Source'}
                    </p>
                  </Stack>
                </div>

              </div>

              <div className="w-full grid grid-cols-12 pt-1">

                <div className="flex col-span-3 pr-2 pt-2">
                  <p className="modalFormText">Destination</p>
                </div>

                <div className="flex col-span-9">
                  <Stack className="w-full">
                    <Controller
                      name="destination"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      defaultValue={destination}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          input={<BootstrapInput />}
                          className="w-5/6 py-0"
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
                            destinationList.map((item, index) => (
                              <MenuItem key={`destination-${index}`} value={item.id}>{item.tag}</MenuItem>
                            ))
                          }
                        </Select>
                      )}
                    />
                    <p className="errorText">
                      {errors.destination?.type === 'required' && 'โปรดระบุ Destination'}
                    </p>
                  </Stack>
                </div>

              </div>

              <div className="w-full mt-6 flex pr-12">

                <Button
                  variant="contained"
                  className="saveButton"
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                >
                  บันทึก
                </Button>

              </div>
            </form>
          </section>

        </Box>

      </ModalUnstyled>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default CreatePipelineModal
