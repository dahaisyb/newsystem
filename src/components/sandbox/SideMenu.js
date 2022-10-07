import React, {useEffect, useState} from 'react'
import {Layout, Menu} from 'antd';
import './index.css'
import '../../util/http'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {withRouter} from "react-router-dom";
import axios from "axios";

const {Sider} = Layout;
const {SubMenu} = Menu

const iconList = {
    "/home": <UserOutlined/>,
    "/user-manage/list": <UserOutlined/>,
    "/right-manage/role/list": <UserOutlined/>,
    "/right-manage/right/list": <UserOutlined/>,
    "/news-manage/add": <UserOutlined/>,
    "/news-manage/draft": <UserOutlined/>,
    "/news-manage/category": <VideoCameraOutlined/>,
    "/audit-manage/audit": <VideoCameraOutlined/>,
    "/audit-manage/list": <VideoCameraOutlined/>,
    "/publish-manage/unpublished": <UploadOutlined/>,
    "/publish-manage/published": <UploadOutlined/>,
    "/publish-manage/sunset": <UploadOutlined/>
}

function SideMenu(props) {
    const [menu, setMenu] = useState([]);
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setMenu(res.data)
        })
    }, []);

    const {role:{rights}}=JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                props.history.push(item.key);
            }
            }>{item.title}</Menu.Item>
        })
    }

    const selectKeys=[props.location.pathname]
    const openKeys=["/"+props.location.pathname.split("/")[1]]
    return (

        <Sider trigger={null} collapsible collapsed={false}>
            <div className="logo">全球新闻发布管理系统</div>

            <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                {renderMenu(menu)}
            </Menu>
        </Sider>


    )
}

export default withRouter(SideMenu)
