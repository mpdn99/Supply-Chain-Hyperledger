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

const ProductManagement: React.FC = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();

  const [productResponse, setProductResponse] = useState<productResponseItemProps[]>([]);
  const [err, setErr] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [productSelected, setProductSelected] = useState<productResponseItemProps>();
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
    { title: 'Name', dataIndex: 'Name', key: 'Name' },
    { title: 'Manufacturer', dataIndex: 'Manufacturer', key: 'Manufacturer' },
    { title: 'Distributor', dataIndex: 'Distributor', key: 'Distributor' },
    { title: 'Retailer', dataIndex: 'Retailer', key: 'Retailer' },
    { title: 'Customer', dataIndex: 'Consumer', key: 'Customer' },
    { title: 'Status', dataIndex: 'Status', key: 'Status' },
    { title: 'Price', dataIndex: 'Price', key: 'Price' },
    {
      title: 'Action', key: 'Operation', render: (_, product) => {
        if (!product.Distributor) {
          return <a onClick={() => actionOnClickHandler(product)}>Edit</a>
        }
      }
    },
  ];

  const addBtnHandler = () => {
    setOpenModal2(true);
  }

  const handleOk1 = () => {
    setConfirmLoading(true);
    form1
      .validateFields()
      .then((values) => {
        form1.resetFields();
        fetch(`http://35.240.137.145:3000/invoke?channelid=supplychain&chaincodeid=supplychain&function=updateProduct&args=${values.productId}&args=${values.name}&args=${values.price}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(respose => respose.text())
          .then(data => console.log(data))
          .catch(() => setErr(true))
      })
    setTimeout(() => {
      setOpenModal1(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleOk2 = () => {
    setConfirmLoading(true);
    form2
      .validateFields()
      .then((values) => {
        form2.resetFields();
        fetch(`http://35.240.137.145:3000/invoke?channelid=supplychain&chaincodeid=supplychain&function=createProduct&args=${values.name}&args=${values.manufacturer}&args=${values.longtitude}&args=${values.latitude}&args=${values.price}`, {
          method: 'POST',
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
      setOpenModal2(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpenModal1(false);
    setOpenModal2(false);
  };

  const actionOnClickHandler = (values: any) => {
    setOpenModal1(true);
    setProductSelected(values)
  }

  useEffect(() => {
    if (!utils.token || utils.token.Organization != "ManufacturerOrg") {
      navigate("/login")
    } else {
      queryAllProduct();
    }
  }, [handleOk1, handleOk2])

  return (
    <Layout className="layout">
      <PageHeader />
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <h1>PRODUCT MANAGEMENT</h1>
        {
          err ? <p style={{ color: 'red' }}> Cannot get data from server!</p> : null
        }
        <Button style={{ margin: '16px 8px 16px 8px' }} id="addProductBtn" type="primary" onClick={addBtnHandler}>Add Product</Button>
        <Table
          columns={columns}
          dataSource={productResponse}
        />
        <Modal
          title="Update product"
          open={openModal1}
          onOk={handleOk1}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form
            form={form1}
            layout="vertical"
            name="updateForm"
            initialValues={{ productId: productSelected?.ProductId, name: productSelected?.Name, price: productSelected?.Price }}
          >
            <Form.Item
              name="productId"
              label="Product Id"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Name">
              <Input type="textarea" />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input type="textarea" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Add product"
          open={openModal2}
          onOk={handleOk2}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form
            form={form2}
            layout="vertical"
            name="form_in_modal"
            initialValues={{ manufacturer: "Sabeco", longtitude: 10.851790, latitude: 106.637100 }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
              rules={[{ required: true, message: 'Please input the Manufacturer ID!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="longtitude"
              label="Longtitude"
              rules={[{ required: true, message: 'Please input the longtitude!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: 'Please input the latitude!' }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please input the price!' }]}
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

export default ProductManagement;