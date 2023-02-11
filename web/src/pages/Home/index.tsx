import React, { useState } from 'react';
import { Layout, Button, Input, Timeline } from 'antd';
import "./index.css"
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logo2.jpg'

const { Header, Content, Footer } = Layout;
const { Search } = Input;

interface productResponseItemProps {
  ProductId: string,
  Name: string,
  Manufacturer: string,
  Distributor: string,
  Retailer: string,
  Consumer: string,
  Status: string,
  Position: positionItemProps[],
  Price: number
}

interface positionItemProps {
  Date: string
  Organization: string
  Longtitude: number
  Latitude: number
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [productResponse, setProductResponse] = useState<productResponseItemProps | null>();
  const [err, setErr] = useState('');

  const queryProduct = ( productId: string) => {
    fetch(`http://35.240.137.145:3000/query?channelid=supplychain&chaincodeid=supplychain&function=queryProduct&args=${productId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(respose => respose.json())
    .then(data => setProductResponse(data))
    .catch(() => setErr(productId))
  }

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        {/* <div
          style={{
            float: 'left',
            width: 120,
            height: 31,
            margin: '16px 24px 16px 0',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        /> */}
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
        <Button style={{float: 'right', margin: '16px 0px 0px 0px'}} id="loginBtn" type="primary" onClick={handleLogin}>Login</Button>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <h1>Product tracking</h1>
        <Search placeholder="Product Code" enterButton="Search" size="large" onSearch={queryProduct}></Search>
        {productResponse ?
          (
            <>
              <p>
                <span className='productTxt'>
                  Product name:
                </span>
                <span>
                  {productResponse.Name}
                </span>
              </p><p>
                  <span className='productTxt'>
                    Manufacturer:
                  </span>
                  <span>
                    {productResponse.Manufacturer}
                  </span>
                </p><p>
                  <span className='productTxt'>
                    Status:
                  </span>
                  <span>
                    {productResponse.Status}
                  </span>
                </p><p>
                  <span className='productTxt'>Tracking Proceess</span>
              </p><Timeline style={{ margin: '20px 30px 20px 30px' }} items={[
                {
                  color: 'green',
                  children: `Product was manufactured at ${productResponse.Position[0]?.Organization} ${productResponse.Position[0]?.Date}`
                },
                {
                  color: 'yellow',
                  children: `Product was transfered to ${productResponse.Position[1]?.Organization} ${productResponse.Position[1]?.Date}`
                },
                {
                  color: 'blue',
                  children: `Product was transfered to ${productResponse.Position[2]?.Organization} ${productResponse.Position[2]?.Date}`
                },
                {
                  color: 'gray',
                  children: `Product was sold at ${productResponse.Position[3]?.Organization} ${productResponse.Position[3]?.Date}`
                }
                ]}>
                </Timeline>
              </>
          ) :
          (
            err ? <p style={{color: 'red'}}>{err} not found!</p> : null
          )
        }
      </Content>
      <Footer style={{ textAlign: 'center' }}>SupChain ©2023 Created by DucNghiaPham</Footer>
    </Layout>
  );
};

export default Home;