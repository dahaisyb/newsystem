import React from 'react';
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import NewsRouter from "../../components/sandbox/NewRouter"
import './SandBox.css'

import {Layout} from "antd";

const {Content} = Layout;

function SandBox(props) {
    return (
        <Layout>
            <SideMenu></SideMenu>

            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}
                >
                    <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>

    );
}

export default SandBox;
