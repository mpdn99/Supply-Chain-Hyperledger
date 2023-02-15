import React, { useEffect, useState } from 'react';
import { Layout, Input, Timeline } from 'antd';
import "./index.css"
import PageHeader from '../../components/PageHeader';

const { Content, Footer } = Layout;
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
  const [productResponse, setProductResponse] = useState<productResponseItemProps | null>();
  const [err, setErr] = useState('');
  const [item, setItem] = useState<any>([]);

  const queryProduct = (productId: string) => {
    fetch(`https://customer.ducnghiapham.online/query?channelid=supplychain&chaincodeid=supplychain&function=queryProduct&args=${productId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(respose => respose.json())
      .then(data => {
        setProductResponse(data)
        checkItem(data)
      })
      .catch(() => setErr(productId))
  }

  const getUniqueListBy = (arr:any, key:any) => {
    return [...new Map(arr.map((item:any) => [item[key], item])).values()]
  }

  const checkItem = (data: any) => {
    if(data.Position[0]?.Date){
      setItem((prev:any) => getUniqueListBy([...(prev || []), {
        color: 'green',
        label: data.Position[0]?.Date,
        children: `Product was manufactured at ${data.Position[0]?.Organization}`
      }], "color"))
    }
    if(data.Position[1]?.Date){
      setItem((prev:any) => getUniqueListBy([...(prev || []), {
        color: 'yellow',
        label: data.Position[1]?.Date,
        children: `Product was transfered to ${data.Position[1]?.Organization}`
      }], "color"))
    }
    if(data.Position[2]?.Date){
      setItem((prev:any) => getUniqueListBy([...(prev || []), {
        color: 'blue',
        label: data.Position[2]?.Date,
        children: `Product was transfered to ${data.Position[2]?.Organization}`
      }], "color"))
    }
    if(data.Position[3]?.Date){
      setItem((prev:any) => getUniqueListBy([...(prev || []), {
        color: 'gray',
        label: data.Position[3]?.Date,
        children: `Product was sold at ${data.Position[2]?.Organization}`
      }], "color"))
    }
  }

  return (
    <Layout className="layout">
      <PageHeader />
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
                <span className='productTxt'>Tracking Proceess:</span>
              </p><Timeline style={{ margin: '20px 30px 20px 30px' }} items={item} mode="left">
              </Timeline>
            </>
          ) :
          (
            err ? <p style={{ color: 'red' }}>{err} not found!</p> : null
          )
        }
      </Content>
      <Footer style={{ textAlign: 'center' }}>SupChain ©2023 Created by DucNghiaPham</Footer>
    </Layout>
  );
};

export default Home;