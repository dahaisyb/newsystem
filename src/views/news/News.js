import React, {useState} from 'react';
import {Card, Col, List, PageHeader, Row} from "antd";
import axios from "axios";
import _ from 'lodash'

function News(props) {
    //新闻数据
    const [newsContent, setnewsContent] = useState([]);
    //请求新闻数据
    axios.get('/news?publishState=2&_expand=password').then(res => {
        setnewsContent(Object.entries(_.groupBy(res.data, item => item.password)))
    })


    return (
        <div>
            <PageHeader
                style={{
                    border: "1px solid rgb(235, 237, 240)"
                }}
                title="全球新闻网"
                subTitle="查阅新闻"
            />

            {/*    卡片*/}
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>

                    {
                        newsContent.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>)
                    }

                </Row>
            </div>
        </div>
    );
}

export default News;
