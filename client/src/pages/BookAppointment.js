import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";

function BookAppointment() {
  const dispatch = useDispatch();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/doctor/getDoctorInfoByIdd",
        {
          doctorId: params.doctorId,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/user/check-booking-availability",
        {
          doctorId: params.doctorId,

          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings:</b>
                {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <div className="d-flex flex-column ">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />

                <Button className="btncheck mt-3" onClick={checkAvailability}>
                  Check Availability
                </Button>
                {isAvailable && (
                  <Button className="btncheck mt-3" onClick={bookNow}>
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
