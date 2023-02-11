import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.jpg'
import './index.css'

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState();
    const [err, setErr] = useState(false);

    const onFinish = (values: any) => {
        fetch(`http://35.240.137.145:3000/query?channelid=supplychain&chaincodeid=supplychain&function=signIn&args=${values.username}&args=${values.password}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(respose => respose.json())
            .then(data => setTransaction(data))
            .catch(() => setErr(true))
    };

    useEffect(() => {
        if (transaction) {
            navigate('/product-management')
        }
    }, [transaction])

    return (
        <div className='login-view'>
            <img src={Logo} alt=""/>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, border: '2px solid #52C8FA', padding: '20px', margin: '30px', borderRadius: '10px' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
                {
                    err ? <p style={{color: 'red'}}> Incorrect username or password!</p> : null
                }
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Link to="/" style={{textAlign: 'right'}}>Back to Home page</Link>
        </div>
    )
}

export default Login;