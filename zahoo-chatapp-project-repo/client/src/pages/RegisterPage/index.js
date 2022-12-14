import { Button, InputAdornment, TextField, Typography } from '@material-ui/core'
import { AccountCircle, Lock, Phone } from '@material-ui/icons'
import { Form, Formik } from "formik"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import DescriptionAlerts from '../../components/Alert/Alert'
import { register } from '../../redux/actions/authAction'
import AuthLaylout from './../../components/Layout/AuthLayout'
import { validationRegister } from './../../util/Validation'
import useStyles from './styles'

function RegisterPage() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history= useHistory()

    const { auth} = useSelector(state => state)
    useEffect(() => {
        if(auth.token) {
            history.push("/messenger")
        }
    }, [auth,history,dispatch])
    useEffect(() => {
        document.title = 'Trang đăng ký';
    })
 
    const handleSubmitForm = (values) => {
        const data = {
            username: values.username,
            phoneNumber: values.phoneNumber,
            password: values.password,
        }
        dispatch(register(data))
    }
    return (
        <AuthLaylout>
            <DescriptionAlerts/>
            <Formik
                initialValues={{ 
                    username:'',
                    phoneNumber: '',
                    password: '',
                    cf_password: '',
                }}
                validationSchema={validationRegister}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    handleSubmitForm(values)
                    setSubmitting(true);
                    resetForm();
                    setSubmitting(false);
                }}
            >
                {({
                values,
                errors,
                touched,
                resetForm,
                handleChange,
                handleSubmit,
                isSubmitting
                }) => (
                    <Form 
                        className={classes.form} 
                        autoComplete="off"
                        onSubmit={handleSubmit}>
                        <Typography variant="h4" color="primary" align="center">Đăng ký</Typography>
                        <TextField
                            label="Số điện thoại"
                            error ={errors.phoneNumber}
                            helperText={errors.phoneNumber}
                            touched ={touched.phoneNumber}
                            variant="filled"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <Phone />
                                    </InputAdornment>
                                ),
                                }}
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            />
                        <TextField
                            label="Tên người dùng"
                            error ={errors.username}
                            helperText={errors.username}
                            touched ={touched.username}
                            variant="filled"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                ),
                                }}
                            value={values.username}
                            name="username"
                            onChange={handleChange}
                            />
                        
                        <TextField
                            label="Mật khẩu"
                            error ={errors.password}
                            helperText={errors.password}
                            touched ={touched.password}
                            type="password"
                            fullWidth
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <Lock />
                                    </InputAdornment>
                                ),
                                }}
                            name="password"
                            onChange={handleChange}
                            />
                        <TextField
                            label="Nhập lại mật khẩu"
                            error ={errors.cf_password}
                            helperText={errors.cf_password}
                            touched ={touched.cf_password}
                            type="password"
                            fullWidth
                            variant="filled"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <Lock />
                                    </InputAdornment>
                                ),
                                }}
                            name="cf_password"
                            onChange={handleChange}
                            />
                        <div style={{display:"flex",width:"100%"}}>
                            <Button variant="secondary" onClick={resetForm}>Xóa Trống</Button>{' '}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}

                            >Đăng ký
                            </Button>
                        </div>
                        <div className={classes.action}>
                            <Link to="/login">Quay lại</Link>
                        </div>
                    </Form>
            )}
            </Formik>
        </AuthLaylout>
    )
}

export default RegisterPage
