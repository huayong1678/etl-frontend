import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import {
  Stack, TextField, InputAdornment, Button,
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';

import '../../assets/css/Auth.css';
import 'react-toastify/dist/ReactToastify.min.css'

const SERVICE = process.env.REACT_APP_SERVICE

function Register() {
  const {
    register, formState: { errors }, handleSubmit, reset, control,
  } = useForm()
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setIsPasswordValidate(false)
    } else {
      setIsPasswordValidate(true)
    }

    if (data.email.trim() === '') {
      setIsEmailValidate(false)
    } else if (!validateEmail(data.email)) {
      setIsEmailValidate(false)
    } else {
      setIsEmailValidate(true)
    }

    const registerData = {
      email: data.email,
      name: data.name,
      password: data.password
    }

    try {
      const res = await axios.post(`${SERVICE}/users/register`, registerData)
      toast.success(`Register Success`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        })
    } catch (e) {
      return toast.error(`Error`)
    }
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isPasswordValidate, setIsPasswordValidate] = useState(true)
  const [isEmailValidate, setIsEmailValidate] = useState(true)

  const validateEmail = (emailValidate) => {
    const re = /\S+@\S+\.\S+/
    return re.test(emailValidate)
  }

  return (
    <section className="grid grid-cols-12">
      <div className="loginBackground" />
      <div className="loginBox">
        <p className="text-3xl">Get's Started</p>
        <p className="text-md pt-4">Already have an account? <Link to="/" className="linkText">Login</Link></p>

        <form>
          <Stack className="w-full pt-10">
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={name}
              render={({ field: { onChange, value } }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  value={value}
                  placeholder="Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <p className="errorText">
              {errors.name?.type === 'required' && 'โปรดระบุชื่อของคุณ'}
            </p>
          </Stack>

          <Stack className="w-full pt-4">
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
            {!isEmailValidate ? (
              <p className="errorText">รูปแบบของอีเมลผิดพลาด</p>
            ) : null}
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

          <Stack className="w-full pt-4">
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={confirmPassword}
              render={({ field: { onChange, value } }) => (
                <TextField
                  size="small"
                  onChange={onChange}
                  value={value}
                  placeholder="Confirm Password"
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
              {errors.confirmPassword?.type === 'required' && 'โปรดยืนยันพาสเวิร์ด'}
            </p>
            {!isPasswordValidate ? (
              <p className="errorText">พาสเวิร์ดไม่ตรงกัน</p>
            ) : null}
          </Stack>

          <div className="mt-8">
            <Button
              variant="contained"
              className="saveButton w-full"
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              Register
            </Button>
          </div>

        </form>

      </div>
      <ToastContainer position="bottom-right" />
    </section>
  );
}

export default Register;
