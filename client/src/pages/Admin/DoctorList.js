import React,{ useEffect, useState }  from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { Table } from "antd";
import {toast} from 'react-hot-toast'
function DoctorList() {

  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
}

const changeDoctorStatus = async (record, status) => {
  try {
    dispatch(showLoading());
    const response = await axios.post("/api/v1/admin/changeDoctorStatus",{doctorId: record._id, userId:record.userId, status:status}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(hideLoading());
    if (response.data.success) {
      toast.success(response.data.message)
      getDoctorsData();
    }
  } catch (error) {
    toast.error("something Went wrong")
    dispatch(hideLoading());
  }
}

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>{record.firstName} {record.lastName}</span>
      ),
    },
     {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status==="pending" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'approved')}>Approve</h1>}
          {record.status==="approved" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'blocked')}>Block</h1>}
          
        </div>
      ),
    },
  ];

  return (
    <Layout>
         <h1 className='page-header'>Doctors List</h1>
         <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default DoctorList