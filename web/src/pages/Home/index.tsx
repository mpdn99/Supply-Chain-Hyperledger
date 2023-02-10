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
  Price: number,
  error: string
}

interface positionItemProps {
  Date: string
  Organization: string
  Longtitude: number
  Latitude: number
}

const Home: React.FC = () => {
  const queryProduct = ( productId: string) => {
    console.log(productId)
    fetch(`http://35.240.137.145:3000/query?channelid=supplychain&chaincodeid=supplychain&function=queryProduct&args=${productId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(respose => respose.json())
    .then(data => setProductResponse(data))
    .then(() => console.log(productResponse))
  }
  const [productResponse, setProductResponse] = useState([]);
  const navigate = useNavigate()
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
          <img src={Logo} style={{
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
        {
          productResponse && productResponse.length > 0 && productResponse?.map((item:productResponseItemProps) => {
            console.log(item.Position)
            if(item.error){
              return(
                <p style={{color: 'red'}}>{item.error}</p>
              )
            }
            return(
              <>
                <p>
                  <span className='productTxt'>
                    Product name:
                  </span>
                  <span>
                    {item.Name}
                  </span>
                </p><p>
                    <span className='productTxt'>
                      Manufacturer:
                    </span>
                    <span>
                      {item.Manufacturer}
                    </span>
                  </p><p>
                    <span className='productTxt'>
                      Status:
                    </span>
                    <span>
                      {item.Status}
                    </span>
                  </p><p>
                    <span className='productTxt'>Tracking Proceess</span>
                  </p><Timeline style={{ margin: '20px 30px 20px 30px' }}>
                    <Timeline.Item color="green">Product was manufactured at {item?.Position[0]?.Organization} {item?.Position[0]?.Date}</Timeline.Item>
                    <Timeline.Item color="yellow">Product was transfered to {item?.Position[1]?.Organization} {item?.Position[0]?.Date}</Timeline.Item>
                    <Timeline.Item color="blue">Product was transfered to {item?.Position[2]?.Organization} {item?.Position[0]?.Date}</Timeline.Item>
                    <Timeline.Item color="grey">Product was sold to {item?.Position[3]?.Organization} {item?.Position[0]?.Date}</Timeline.Item>
                  </Timeline>
                </>
            )
          })
        }
          
      </Content>
      <Footer style={{ textAlign: 'center' }}>SupChain ©2023 Created by DucNghiaPham</Footer>
    </Layout>
  );
};

export default Home;