import React, {useState} from 'react';
import {Avatar, Dropdown, Layout, Menu} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SmileOutlined
} from '@ant-design/icons';
import {withRouter} from "react-router-dom";
const {Header} = Layout;

function TopHeader(props) {

    const [collapsed, setCollapsed] = useState(false);

    const changehandleClick = () => {
        setCollapsed(!collapsed)
    }

    const menu = (
        <Menu>
            <Menu.Item>
                超级管理员
            </Menu.Item>
            <Menu.Item danger onClick={()=>{
                localStorage.removeItem("token")
                props.history.replace("/login")
            }}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    // const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))
    const {username}=JSON.parse(localStorage.getItem("token"))

    return (
        <Header className="site-layout-background" style={{padding: '0 16px'}}>
            {
                collapsed ? <MenuUnfoldOutlined onClick={changehandleClick}/> :
                    <MenuFoldOutlined onClick={changehandleClick}/>
            }

            <div style={{float:"right"}}>
                <span>欢迎回来{username}回来</span>
                <Dropdown overlay={menu}>
                            <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header>
    );
}

export default withRouter(TopHeader);
