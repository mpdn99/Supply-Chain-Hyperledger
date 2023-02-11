import React, { useEffect, useState } from 'react';
import { Layout, Button, Input, Timeline, Table } from 'antd';
import "./index.css"
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logo2.jpg'

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
  const [productResponse, setProductResponse] = useState<productResponseItemProps | null>();
  const [err, setErr] = useState(false);

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

  useEffect(() => {

  }, [])
    return(
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
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px' }}>
          <h1>Product management</h1>
          <Table columns={columns} dataSource={data} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>SupChain ©2023 Created by DucNghiaPham</Footer>
      </Layout>
    )
}

export default ProductManagement;