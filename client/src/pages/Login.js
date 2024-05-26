import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from 'antd'
import './Login.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/v1/user/login', values);
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                toast("Redirecting you to home page")
                localStorage.setItem("token", response.data.token)
                navigate("/")
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }
    }

    return (
        <div className="Container">
            <div className="Half-Portion">
                <h1 className="half-portion-title">MedAppoint</h1>
                <p className="half-para">Your Health, Your Time, Your Choice - Login yourself to Book Your Appointment Today!</p>
            </div>
            <div className="Lauthentication">
                <div className="Lauthentication-form card p-2">
                    <h1 className="card-title">Login Yourself</h1>
                    <Form layout='vertical' autoComplete='off' onFinish={onFinish}>

                        <Form.Item label='Email' name="email" rules={[{
                            required: true,
                            message: 'Please input your Email!',
                        },]}>
                            <Input className="input" type="text" placeholder='Enter your Email' />
                        </Form.Item>

                        <Form.Item label='Password' name="password" rules={[{
                            required: true,
                            message: 'Please input your Password!',
                        },]}>
                            <Input.Password type="password" placeholder='Enter your Password' />
                        </Form.Item>

                        <Button className='primary-button my-2' htmlType='submit'>Login</Button>
                        <p className='para'>Don't have an account? <Link to='/register' className='anchor'>Register</Link></p>


                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login
