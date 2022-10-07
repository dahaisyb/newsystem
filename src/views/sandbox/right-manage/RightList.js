import React, {useEffect, useState} from 'react';
import {Button, Modal, Popover, Table, Tag,Switch} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import login from "../../login/Login";


function RightList(props) {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            const list = res.data

            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })

            setDataSource(list)
        })
    }, []);


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
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return (
                    <Tag color="orange">{key}</Tag>
                )
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>{showModal(item)}}/>
                        <Popover content={
                            <Switch checked={item.pagepermisson} onChange={()=> {
                                switchMethod(item)
                            }}/>
                        } title="权限修改" trigger={item.pagepermisson===undefined?'':'click'} >
                        <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.pagepermisson===undefined}/>
                        </Popover>
                    </div>

                )
            }
        },
    ];

    const switchMethod=(item)=>{
        item.pagepermisson = item.pagepermisson===1?0:1
        setDataSource([...dataSource])
        if (item.grade===1){
            axios.patch(`http://localhost:5000/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`http://localhost:5000/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }
    //弹出确认窗口
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [id, setId] = useState({});

    const showModal = (item) => {
        console.log(item)
        setId(item)
        setVisible(true);
    };

    const handleOk = () => {
        if (id.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== id.id))
            axios.delete(`http://localhost:5000/rights/${id.id}`)
        }else{
            let list = dataSource.filter(data=>data.id===id.rightId)
            list[0].children = list[0].children.filter(data=>data.id!==id.id)
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${id.id}`)
        }
        setVisible(false);

    };

    const handleCancel = () => {

        setVisible(false);
    };


    return (
        <div>
            <Table dataSource={dataSource} columns={columns}/>;

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

export default RightList;
