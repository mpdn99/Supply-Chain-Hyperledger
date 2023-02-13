import React, { useContext, useEffect, useState } from 'react';
import { Layout, Table, Modal, Form, Input, Button } from 'antd';
import "./index.css"
import { useNavigate } from "react-router-dom";
import { ColumnsType } from 'antd/es/table';
import { AuthContext } from '../../App';
import PageHeader from '../../components/PageHeader';

const { Content, Footer } = Layout;

interface productResponseItemProps {
  ProductId: string,
  Name: string,
  Manufacturer: string,
  Distributor: string,
  Retailer: string,
  Consumer: string,
  Status: string,
  Position: positionItemProps[],
  Price: number,
}

interface positionItemProps {
  Date: string
  Organization: string
  Longtitude: number
  Latitude: number
}

const DeliverConfirmation: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [productResponse, setProductResponse] = useState<productResponseItemProps[]>([]);
  const [err, setErr] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const utils = useContext(AuthContext)


  const queryAllProduct = () => {
    fetch(`http://35.240.137.145:3000/query?channelid=supplychain&chaincodeid=supplychain&function=queryAllProducts`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(respose => respose.json())
      .then(data => setProductResponse(data))
      .catch(() => setErr(true))
  }

  const columns: ColumnsType<productResponseItemProps> = [
    { title: 'ProductId', dataIndex: 'ProductId', key: 'ProductId' },
    { title: 'Name', dataIndex: 'Name', key: 'ProductId' },
    { title: 'Manufacturer', dataIndex: 'Manufacturer', key: 'ProductId' },
    { title: 'Distributor', dataIndex: 'Distributor', key: 'ProductId' },
    { title: 'Retailer', dataIndex: 'Retailer', key: 'ProductId' },
    { title: 'Customer', dataIndex: 'Customer', key: 'ProductId' },
    { title: 'Status', dataIndex: 'Status', key: 'ProductId' },
    { title: 'Price', dataIndex: 'Price', key: 'ProductId' },
  ];


  const confirmBtnHandler = () => {
    setOpenModal(true);
  }

  const handleOk = () => {
    setConfirmLoading(true);
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        fetch(`http://35.240.137.145:3000/invoke?channelid=supplychain&chaincodeid=supplychain&function=sentToDistributor&args=${values.productId}&args=${values.distributorId}&args=${values.longtitude}&args=${values.latitude}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(respose => respose.text())
          .then(data => console.log(data))
          .catch(() => setErr(true))
      });
    setTimeout(() => {
      setOpenModal(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (!utils.token || utils.token.Organization != "DistributorOrg") {
      navigate("/login")
    } else {
      queryAllProduct();
    }
  }, [handleOk])

  return (
    <Layout className="layout">
      <PageHeader />
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <h1>DELIVER MANAGEMENT</h1>
        {
          err ? <p style={{ color: 'red' }}> Cannot get data from server!</p> : null
        }
        <Button style={{ margin: '16px 8px 16px 8px' }} id="addProductBtn" type="primary" onClick={confirmBtnHandler}>Confirm new Product</Button>
        <Table
          columns={columns}
          dataSource={productResponse}
        />
        <Modal
          title="Confirm new product"
          open={openModal}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{ distributorId: "GiaoHangTietKiem", longtitude: 11.841790, latitude: 107.633600 }}
          >
            <Form.Item
              name="productId"
              label="Product ID"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="distributorId"
              label="Distributor ID"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="longtitude"
              label="Longtitude"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
              hidden
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
      <Footer style={{ textAlign: 'center' }}>SupChain ©2023 Created by DucNghiaPham</Footer>
    </Layout>
  )
}

export default DeliverConfirmation;