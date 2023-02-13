import { Button, Form, Input } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import Logo from '../../assets/logo.jpg'
import './index.css'


const Login: React.FC = () => {
    const navigate = useNavigate();
    const utils: any = useContext(AuthContext)

    const onFinish = (values: any) => {
        utils.handleLogin(values.username, values.password)
    };

    useEffect(() => {
        if (utils.token && utils.token.Organization == "ManufacturerOrg") {
            navigate('/product-management')
        }
        if (utils.token && utils.token.Organization == "DistributorOrg") {
            navigate('/product-confirmation')
        }
        if (utils.token && utils.token.Organization == "RetailerOrg") {
            navigate('/saler-confirmation')
        }
    }, [utils.token])

    return (
        <div className='login-view'>
            <img src={Logo} alt="" />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, border: '2px solid #52C8FA', padding: '20px', margin: '30px', borderRadius: '10px' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
                {
                    utils?.err ? <p style={{ color: 'red' }}> Incorrect username or password!</p> : null
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
            <Link to="/" style={{ textAlign: 'right' }}>Back to Home page</Link>
        </div>
    )
}

export default Login;