import React, { useEffect, useState } from 'react';
import { Layout, Table, Modal, Form, Input, Button, Avatar, Dropdown, MenuProps } from 'antd';
import "./index.css"
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logo2.jpg'
import { ColumnsType } from 'antd/es/table';
import { UserOutlined } from '@ant-design/icons';
import SabecoLogo from '../../assets/sabeco.jpg'

const { Header, Content, Footer } = Layout;

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

  const logout = () => {
    navigate("/")
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
    {
      title: 'Action', key: 'Operation', render: (_, product) => {
        if (!product.Distributor) {
          return <a onClick={() => actionOnClickHandler(product)}>Edit</a>
        }
      }
    },
  ];

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: "Logout",
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    navigate("/")
  }

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
          method: 'GET',
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
    queryAllProduct();
  }, [handleOk1, handleOk2])

  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div>
          <img src={Logo} alt="" style={{
            float: 'left',
            display: 'block',
            width: '110px',
            height: 'auto',
            marginTop: '15px'
          }}>
          </img>
        </div>
        <Dropdown menu={{ items, onClick }} placement="bottomRight">
          <Avatar src={SabecoLogo} style={{ float: 'right', marginTop: '8px' }} shape="square" size={48} icon={<UserOutlined />} />
        </Dropdown>
        <span style={{ float: 'right', marginRight: '10px', color: '#fff' }}>Sabeco</span>
      </Header>
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
              rules={[{ required: true, message: 'Please input the product ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
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
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please input the product ID!' }]}
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