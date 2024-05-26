import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from 'antd'
import './Register.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/v1/user/register', values);
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                toast("Redirecting you to login page")
                navigate("/login")
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
                <p className="half-para">Your Health, Your Time, Your Choice - Register yourself to Book Your Appointment Today!</p>
            </div>
            <div className="authentication">
                <div className="authentication-form card p-2">
                    <h1 className="card-title">REGISTER YOURSELF</h1>
                    <Form layout='vertical' autoComplete='off' onFinish={onFinish}>
                        <Form.Item label='Name'
                            name="name"
                            rules={[{
                                required: true,
                                message: 'Please input your name!',
                            },
                            { type: 'text' },
                            { whitespace: true },

                            ]}
                            hasFeedback
                        >
                            <Input placeholder='Enter your Name' />
                        </Form.Item>

                        <Form.Item label='Email'
                            name="email"
                            rules={[{
                                required: true,
                                message: 'Please input your email!'
                            },
                            {
                                type: 'email',
                                message: 'Please Enter a Valid Email!'
                            },

                            ]}
                            hasFeedback
                        >
                            <Input placeholder='Enter your Email' />
                        </Form.Item>

                        <Form.Item label='Password'
                            name="password"
                            rules={[{
                                required: true,

                            },
                            { min: 6 },
                            {
                                validator: (_, value) => {

                                    if (
                                        !/(?=.*[A-Z])/.test(value) ||
                                        !/(?=.*[a-z])/.test(value) ||
                                        !/(?=.*\d)/.test(value) ||
                                        !/(?=.*[@#$%^&*!])/g.test(value) ||
                                        value.length < 8
                                    ) {
                                        return Promise.reject(
                                            'Password must have A-Z, a-z, special character.'
                                        );
                                    }

                                    return Promise.resolve();
                                }
                            },

                            ]}>
                            <Input.Password placeholder='Enter your Password' />
                        </Form.Item>

                        <Form.Item label='Confirm Password'
                            name="confirmpassword"
                            dependencies={['password']}
                            rules={[{
                                required: true,
                                message: 'Please input your Password!'
                            }
                                ,
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject('Entered Password does not matched')
                                }
                            })
                            ]}>
                            <Input.Password placeholder='Confirm your Password' />
                        </Form.Item>

                        <Button className='primary-button my-2' htmlType='submit'>Register</Button>
                        <p className='para'>Already have an account? <Link to='/login' className='anchor'>Login</Link></p>


                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register
