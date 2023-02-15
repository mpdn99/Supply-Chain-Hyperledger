import { Layout, Button, Avatar, Dropdown, MenuProps } from 'antd';
import Logo from '../../assets/logo2.jpg'
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../App';
import './index.css'
const { Header } = Layout;

interface tokenProps {
    Name: string;
    UserId: string;
    Email: string;
    UserType: string;
    Organization: string;
    ManufacturerOrg: string;
    Address: string;
}

const PageHeader = () => {
    const navigate = useNavigate()
    const utils = useContext(AuthContext)

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: "Logout",
        },
    ];

    const onClick: MenuProps['onClick'] = ({ key }) => {
        utils.handleLogout()
        navigate("/")
    }

    const handleLoginBtn = () => {
        console.log(navigate)
        navigate("/login")
    }

    const handleUserView = () => {
        if(utils.token.Organization == "ManufacturerOrg"){
            navigate("/product-management")
        }
        if(utils.token.Organization == "DistributorOrg"){
            navigate("/product-confirmation")
        }
        if(utils.token.Organization == "RetailerOrg"){
            navigate("/saler-confirmation")
        }
    }

    useEffect(() => {
        console.log(utils.token)
    }, [])
    return (
        <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
            <div>
                <img src={Logo} alt=""
                onClick={() => navigate("/")}
                style={{
                    float: 'left',
                    display: 'block',
                    width: '110px',
                    height: 'auto',
                    marginTop: '15px'
                }}>
                </img>
            </div>
            {
                utils.token ? (
                    <view >
                        <Dropdown menu={{ items, onClick }} placement="bottomRight">
                            <Avatar style={{ float: 'right', marginTop: '8px' }}size={48} icon={<UserOutlined />} />
                        </Dropdown>
                        <span className='user-view' onClick={handleUserView} style={{ float: 'right', marginRight: '10px' }}>{ utils.token.Name }</span>
                    </view>
                ) : (
                    <Button style={{ float: 'right', margin: '16px 0px 0px 0px' }} id="loginBtn" type="primary" onClick={handleLoginBtn}>Login</Button>
                )
            }
        </Header>
    )
}

export default PageHeader;