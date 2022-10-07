import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Card, Col, Drawer, List, Row} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import axios from 'axios'
import _ from 'lodash'
import * as ECharts from 'echarts'
import 'echarts-gl';
import login from "../../login/Login";
import * as Echarts from "echarts";

const {Meta} = Card;

function Home(props) {
    const [viewList, setviewList] = useState([])
    const [starList, setstarList] = useState([])
    //抽屉显示状态
    const [visible, setVisible] = useState(false);
    //用户大屏展示数据
    const [allList, setAllList] = useState([]);
    //饼状图初始值
    const [pieChart, setPieChart] = useState(null);

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=password&_sort=view&_order=desc&_limit=6").then(res => {
            console.log(res.data)
            setviewList(res.data)
        })
    }, []);

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=password&_sort=star&_order=desc&_limit=6").then(res => {
            // console.log(res.data)
            setstarList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=password").then(res => {
            console.log(res.data)
            renderBarView(_.groupBy(res.data, item => item.password))
            setAllList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, []);
    const renderBarView = (obj) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = ECharts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        window.onresize = () => {
            // console.log("resize")
            myChart.resize()
        }
    }

    //饼状图
    const renderPieView = (obj) => {
        var currentList=allList.filter(item => item.author===username)
        var groupObj=_.groupBy(currentList,item=>item.password)
        console.log(groupObj)
        var list=[]
        for (var i in groupObj) {
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        var myChart
        if (!pieChart){
            myChart= ECharts.init(document.getElementById('pieRef'));
            setPieChart(myChart)
        }else {
            myChart=pieChart
        }
        var option;

        option = {
            title: {
                text: '用户个人新闻数据',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data:list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }



    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem("token"))

    return (
        <div>
            <div className="site-card-wrapper">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="用户最常浏览" bordered={true}>
                            <List
                                size="large"
                                dataSource={viewList}
                                renderItem={(item) => <List.Item><a
                                    href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户点赞最多" bordered={true}>
                            <List
                                size="large"
                                dataSource={starList}
                                renderItem={(item) => <List.Item><a
                                    href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <SettingOutlined key="setting" onClick={() => {
                                    setTimeout(() =>{
                                        setVisible(true)
                                        setTimeout(() =>{
                                            renderPieView()

                                        },0.1)
                                    },0)
                                }}/>,
                                <EditOutlined key="edit"/>,
                                <EllipsisOutlined key="ellipsis"/>,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                title={username}
                                description={roleName}

                            />
                        </Card>
                    </Col>
                </Row>
                {/*抽屉饼状图*/}
                <Drawer width="500px" title="用户个人数据展示" placement="right" onClose={() => {
                    setVisible(false)
                }} visible={visible}>

                    <div id="pieRef" style={{
                        width: '500px',
                        height: "600px",
                        marginTop: "30px"
                    }}></div>

                </Drawer>

                {/*柱状图*/}
                <div id="main" style={{height: "400px"}}></div>
            </div>

        </div>
    );
}

export default Home;
