import React, {useEffect, useState} from 'react';
import {Button, Modal, notification, Table,} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";
import login from "../../login/Login";

function NewsDraft(props) {
    //Table列表数据
    const [dataSource, setDataSource] = useState([]);
    //用户本地缓存数据
    const {username} = JSON.parse(localStorage.getItem("token"))


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return (
                    <b>{id}</b>
                )
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return (
                    <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
                )
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
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
                            showModal(item)
                        }}/>

                        {/*    权限勾选*/}
                        <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
                            props.history.push(`/news-manage/update/${item.id}`)
                        }}/>
                        {/*    权限勾选*/}
                        <Button type="primary" shape="circle" icon={<UploadOutlined/>} onClick={() => {
                            handlecheck(item.id)
                        }}/>
                    </div>

                )
            }
        },
    ]
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=catefory`).then(res => {
            setDataSource(res.data)
        })
    }, []);

    //弹出确认窗口
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [id, setId] = useState({});

    const showModal = (item) => {
        // console.log(item)
        setId(item)
        setVisible(true);
    };

    const handleOk = () => {
        axios.delete(`/news/${id.id}`)
        setVisible(false);
        setDataSource(dataSource.filter(data => data.id !== id.id))

    };

    const handleCancel = () => {
        setVisible(false);
    };

    //上传审核列表
    const handlecheck=(id)=>{
        axios.patch(`/news/${id}`,{
            "auditState":1
        }).then(res =>{
            props.history.push('/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `您可以到审核列表`,
                placement:'bottomRight',
            });
        })
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>

            {/*删除弹窗确认窗口*/}
            <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
            </Modal>


        </div>
    );
}

export default NewsDraft;

