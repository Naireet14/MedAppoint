import React,{ useEffect, useState }  from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { Table } from "antd";
import {toast} from 'react-hot-toast'
import moment from 'moment';

const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
  
    const getAppointmentsData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/v1/doctor/get-appointments-by-doctor-id", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
            setAppointments(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
      }
  }
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/doctor/changeAppointmentStatus",{appointmentId:record._id,status:status}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message)
        getAppointmentsData();
      }
    } catch (error) {
      toast.error("something Went wrong")
      dispatch(hideLoading());
    }
  }

  const columns = [
    {
        title:"1d",
        dataIndex:"_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => (
        <span>{record.userInfo.name} </span>
      ),
    },
     {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <span>{record.doctorInfo.phoneNumber} </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>{moment(record.date).format("DD-MM-YYYY ")}{moment(record.time).format("HH:mm")}</span>
      ),
    },
    {
        title:"status",
        dataIndex:"status",
    },
    {
        title: "Actions",
        dataIndex: "actions",
        render: (text, record) => (
          <div className="d-flex">
            {record.status==="pending" &&( 
                <div className="d-flex">
                    <h1 className="anchor px-2" onClick={()=>changeAppointmentStatus(record,'approved')}>Approve</h1>
            <h1 className="anchor" onClick={()=>changeAppointmentStatus(record,'blocked')}>Reject</h1>
            
                </div>
            )}
            
            
            
          </div>
        ),
      },
   
  ];

    useEffect(() => {
        getAppointmentsData();
      }, []);
  return (
    <Layout>
         <h1 className='page-header'>Appointments</h1>
         <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default DoctorAppointments