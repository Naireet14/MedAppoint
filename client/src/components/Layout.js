import React, { useState } from 'react';
import '../Layout.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Badge } from 'antd';
function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const location = useLocation();
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-file-list-line',
        },
        {
            name: 'Apply Doctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line',
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-user-line',
        },

    ];

    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Appointments',
            path: '/doctor/appointments',
            icon: 'ri-file-list-line',
        },
       {
            name: 'Profile',
            path: `/doctorProfile/${user?._id}`,
            icon: 'ri-user-line',
        },

    ];

    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: 'ri-user-line',

        },
        {
            name: 'Doctors',
            path: '/admin/doctors',
            icon: 'ri-user-star-line',
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-user-line',
        },


    ];


    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu ;
    const role=user?.isAdmin?"Admin":user?.isDoctor?"Doctor":"user";
    return (
        <div className='main'>
            <div className="d-flex layout">
                <div className='sidebar'>
                    <div className="sidebar-header">
                        <h1 className="logo">MEDA</h1>
                        <h1 className='role'>{role}</h1>

                    </div>

                    <div className="menu">
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path
                            return (
                                <div key={menu.name} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}

                                </div>
                            );
                        })}
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.clear()
                            navigate('/login')
                        }}>
                            <i className='ri-logout-circle-line'></i>
                            {!collapsed && <Link to='/login'>Logout</Link>}

                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className="header">
                        {collapsed ?
                            (<i className="ri-menu-line header-action-icon"
                                onClick={() => setCollapsed(false)}>
                            </i>
                            ) : (
                                <i className="ri-close-circle-line header-action-icon"
                                    onClick={() => setCollapsed(true)}>
                                </i>)}

                        <div className="d-flex align-item-center px-4">
                            <Badge count={user?.unSeenNotification.length} onClick={() => navigate('/notifications')}>
                                <i className="ri-notification-2-fill header-action-icon"></i>
                            </Badge>

                            <button className="btn"><Link className="anch" to='/profile'>{user?.name}</Link></button>
                        </div>
                    </div>

                    <div className="body">

                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
