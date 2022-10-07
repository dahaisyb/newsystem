import React, {useEffect, useState} from 'react';
import {Button, Descriptions, PageHeader} from "antd";
import axios from "axios";
import moment from "moment";
import login from "../../login/Login";

function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null);
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=role&_expand=password`).then(res => {
            setNewsInfo(res.data)
        })
        console.log(props)
    }, [props.match.params.id]);

    const auditList = ["未审核", '审核中', '已通过', '未通过']
    const publishList = ["未发布", '待发布', '已上线', '已下线']

    return (
        <div className="site-page-header-ghost-wrapper">
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.password}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item
                                label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item
                                label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态">{auditList[newsInfo.auditState]}</Descriptions.Item>
                            <Descriptions.Item label="发布状态">{publishList[newsInfo.publishState]}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                <div dangerouslySetInnerHTML={{
                    __html:newsInfo.content
                }} style={{
                    margin:"0 24px",
                    border:"1px solid gray"
                }}></div>
                </div>
            }
        </div>
    );
}

export default NewsPreview;
