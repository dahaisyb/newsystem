import React, {useEffect, useState} from 'react';
import {Button, Descriptions, PageHeader} from "antd";
import axios from "axios";
import moment from "moment";
import {HeartTwoTone} from '@ant-design/icons';


function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null);
    useEffect(() => {
        var id = props.location.pathname.substr(props.location.pathname.lastIndexOf("/") + 1,)
        axios.get(`/news/${id}?_expand=role&_expand=password`).then(res => {
            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            })
            return res.data
        }).then(res=>{
            axios.patch(`/news/${id}`,{
                view:res.view+1
            })
        })
    }, []);

    //点赞
    const handlestars=()=>{
        var id = props.location.pathname.substr(props.location.pathname.lastIndexOf("/") + 1,)
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })
        axios.patch(`/news/${id}`,{
            star:newsInfo.star+1
        })
    }


    return (
        <div className="site-page-header-ghost-wrapper">
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.password}
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>{handlestars()}}/>
                        </div>}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item
                                label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin: "0 24px",
                        border: "1px solid gray"
                    }}></div>
                </div>
            }
        </div>
    );
}

export default Detail;
