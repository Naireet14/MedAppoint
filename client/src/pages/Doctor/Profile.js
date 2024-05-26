import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import DoctorForm from '../../components/DoctorForm'
import moment from 'moment'
import {InputText} from 'primereact/inputtext';
import imgg from '../../image/Nazuko.jpg'



function Profile() {
    
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const params=useParams();
  const [doctor,setDoctor]=useState(null);
  //const navigate = useNavigate();
    const [image,setImage]=useState("");


   const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/v1/doctor/updateDoctorProfile',
                {
                    ...values,
                    userId: user._id,
                    timings:[
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                //navigate("/home");
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Something went wrong')
        }
    }


    const getDoctorData = async () => {
      try {
        dispatch(showLoading())
          const response = await axios.post('/api/v1/doctor/getDoctorInfo',
          {
              userId:params.userId,
          },
            
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
              });
          dispatch(hideLoading())
          if (response.data.success) {
              setDoctor(response.data.data);

          }
         
      } catch (error) {
        console.log(error)
          dispatch(hideLoading())
          
      }
  }
  useEffect(() => {
      
          getDoctorData();
      
  }, [])
  return (
    <Layout>
        <h1>Doctor Profile</h1>
        <hr/>
        <div className="image text-center p-4">
            <div className='flex flex-column justify-content-center align-items-center'>
                <img className="Profile-image"
                src={imgg} alt=""
                />
               
                <InputText type="file"
                accept='/image/*'
                onChange={(event)=>{
                    const file=event.target.files[0];
                    if(file && file.type.substring(0,5)==="image"){
                        setImage(file);
                    }
                    else{
                        setImage(null)
                    }
                }}/>
                
            </div>
        </div>
        { doctor && <DoctorForm onFinish={onFinish} initialValues={doctor}/>}
    </Layout>
  )
}

export default Profile