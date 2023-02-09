import React from 'react';
import { Layout, Button, Input, Timeline } from 'antd';
import "./index.css"

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const App: React.FC = () => {
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
    .then(data => console.log(data))
  }


  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div
          style={{
            float: 'left',
            width: 120,
            height: 31,
            margin: '16px 24px 16px 0',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Button style={{float: 'right', margin: '16px 0px 0px 0px'}} id="loginBtn" type="primary">Login</Button>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <h1>Product tracking</h1>
        <Search placeholder="Product Code" enterButton="Search" size="large" onSearch={queryProduct}></Search>
        <p>
          <span className='productTxt'>
            Product name:
          </span> 
          <span>
            Beer 333
          </span>
        </p>
        <p>
          <span className='productTxt'>
            Manufacturer:
          </span> 
          <span>
            Sabeco
          </span>
        </p>
        <p>
          <span className='productTxt'>
            Status:
          </span>
          <span>
          Sold
          </span> 
        </p>
        <p>
          <span className='productTxt'>Tracking Proceess</span>
        </p>
        <Timeline style={{ margin: '20px 30px 20px 30px' }}>
          <Timeline.Item color="green">Product was manufactured at Sabeco 04-01-2023</Timeline.Item>
          <Timeline.Item color="yellow">Product was transfered to GiaoHangNhanh 05-01-2023</Timeline.Item>
          <Timeline.Item color="blue">Product was transfered to SieuThiA 06-01-2023</Timeline.Item>
          <Timeline.Item color="grey">Product was sold to customer 04-01-2023</Timeline.Item>
        </Timeline>
          
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;