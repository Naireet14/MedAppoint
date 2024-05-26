import React from "react";
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
function DoctorForm(props) {
  const { onFinish, initialValues } = props;
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        ...(initialValues && {
          timings: [
            moment(initialValues?.timings[0], "HH:mm"),
            moment(initialValues?.timings[1], "HH:mm"),
          ],
        }),
      }}
    >
      <h1 className="card-title mt-3">Personal Information</h1>
      {/* <h1 className="image"></h1> */}
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
              { type: "text" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter First Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
              { type: "text" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter last Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              { type: "text" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              { max: 10 },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter Phone Number" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your Address!",
              },
              { type: "text" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter Address" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[
              {
                required: true,
                message: "Please input your Specialization!",
              },
              { type: "text" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter Specialization" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[
              {
                required: true,
                message: "Please input your Experience!",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input type="number" placeholder="Enter Experience" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Fees Per Consultation"
            name="feePerConsultation"
            rules={[
              {
                required: true,
                message: "Please input your Fee!",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input type="text" placeholder="Enter Fee" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            label="Timings"
            name="timings"
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="btn" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
