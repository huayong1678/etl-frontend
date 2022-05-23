import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import {
  Stack, TextField, InputAdornment, Button,
} from '@mui/material'

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';

import '../../assets/css/Auth.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function Login() {
  const navigate = useNavigate()
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = async (data) => {
    const loginData = {
      email: data.email,
      password: data.password
    }

    try {
      const res = await axios.post(`${SERVICE}/users/login`, loginData)
      if (res.data.message === 'success') {
        localStorage.removeItem("cookies");
        localStorage.setItem('cookies', res.data.jwt)
        navigate('/pipeline')
      } else {
        return toast.error(`Error`)
      }
    } catch (e) {
      console.log(e)
      return toast.error(`Error`)
    }
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <section className="grid grid-cols-12">
      <div className="loginBackground" />
      <div className="loginBox">
        <p className="text-3xl">Sign in</p>
        <p className="text-md pt-4">Don't have an account? <Link to="/register" className="linkText">Sign up</Link></p>

        <form>
          <Stack className="w-full pt-10">
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={email}
              render={({ field: { onChange, value } }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  value={value}
                  placeholder="Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <p className="errorText">
              {errors.email?.type === 'required' && 'โปรดระบุอีเมล'}
            </p>
          </Stack>

          <Stack className="w-full pt-4">
            <Controller
              name="password"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={password}
              render={({ field: { onChange, value } }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  value={value}
                  placeholder="Password"
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <p className="errorText">
              {errors.password?.type === 'required' && 'โปรดระบุพาสเวิร์ด'}
            </p>
          </Stack>
          
          <div className="mt-8">
            <Button
              variant="contained"
              className="saveButton w-full"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Login
            </Button>
          </div>

        </form>

      </div>
      <ToastContainer position="bottom-right" />
    </section>
  );
}

export default Login;
