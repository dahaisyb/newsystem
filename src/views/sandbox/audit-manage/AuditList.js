import React, {useEffect, useState} from 'react';
import {Button, notification, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";
import axios from "axios";
import login from "../../login/Login";

function AuditList(props) {
    let {username} = JSON.parse(localStorage.getItem("token"))
    //请求列表数据
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=password`).then(res => {
            setDataSource(res.data)
            console.log(res.data)
        })
    }, [username]);

    //列表渲染数据
    const [dataSource, setDataSource] = useState([]);
    //列表结构
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'password',
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["", 'orange', 'green', 'red']
                const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
                return (

                    <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
                )
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        {
                            item.auditState === 1 && <Button onClick={() => handleRervert(item)}>撤销</Button>
                        }
                        {
                            item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
                        }
                        {
                            item.auditState === 3 &&
                            <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
                        }
                    </div>

                )
            }
        },
    ]

    //撤销
    const handleRervert = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到草稿箱中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }
    //发布
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            "publishState": 2
        }).then(res => {
            props.history.push('/publish-manage/published')

            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }
    //更新
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }
    return (
        <div>

            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>

        </div>
    );
}

export default AuditList;
