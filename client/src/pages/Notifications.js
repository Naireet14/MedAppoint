import React from 'react'
import Layout from '../components/Layout'
import { Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import {setUser} from "../redux/userSlice";

function Notifications() {
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const markAllAsSeen = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/v1/user/mark-all-notifications-as-seen', { userId: user._id },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }

    }


    const deleteAllNotifications = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/v1/user/delete-all-notifications', { userId: user._id },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }

    }
    // Check if user is null or undefined
    if (!user) {
        return (
            <Layout>
                <h1 className='page-title'>Notifications</h1>
                <div>Loading user data...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className='page-title'>Notifications</h1>
            <Tabs>
                <Tabs.TabPane tab='Unseen' key={0}>
                    <div className='d-flex justify-content-end'>
                        <h2 className='anchor' onClick={() => markAllAsSeen()}>Mark all as read</h2>
                    </div>

                    {user?.unSeenNotification.map((notification) => (
                        <div className="Not-card card p-2 mt-2" key={notification.id} onClick={() => navigate(notification.onClickPath)}>
                            <div className="card-text">
                                {notification.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
                <Tabs.TabPane tab='Seen' key={1}>
                    <div className='d-flex justify-content-end'>
                        <h2 className='anchor' onClick={()=>deleteAllNotifications()}>Delete all notifications</h2>
                    </div>
                    {user?.seenNotification.map((notification) => (
                        <div className="Not-card card p-2 mt-2 " key={notification.id} onClick={() => navigate(notification.onClickPath)}>
                            <div className="card-text">
                                {notification.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    )
}

export default Notifications
