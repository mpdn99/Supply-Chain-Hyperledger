import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.jpg'
import './index.css'

interface ITransactionItem {
    transactionID?: string,
    err?: string
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<ITransactionItem | null>(null);
    const onFinish = (values: any) => {
        fetch(`http://35.240.137.145:3000/query?channelid=supplychain&chaincodeid=supplychain&function=signIn&args=${values.username}&args=${values.password}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(respose => respose.json())
            .then(data => console.log(data))
    };

    useEffect(() => {
        if (transaction) {
            navigate('/product-management')
        }
    },
        [transaction])

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='login-view'>
            <img src={Logo} />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, border: '2px solid #52C8FA', padding: '20px', margin: '30px', borderRadius: '10px' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
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
        </div>
    )
}

export default Login;