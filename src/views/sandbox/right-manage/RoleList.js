import React, {useEffect, useState} from 'react';
import {Button, Modal,  Table, Tree} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import login from "../../login/Login";

function RoleList(props) {

    //Table列表数据
    const [dataSource, setDataSource] = useState([]);
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
            title: '角色名称',
            dataIndex: 'roleName',

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
                            getsetCheckedKeys(item)
                            setIsModalVisible(true)
                            setCurrentId(item.id)
                        }}/>
                    </div>

                )
            }
        },
    ]
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
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
        axios.delete(`http://localhost:5000/roles/${id.id}`)
        setVisible(false);
        setDataSource(dataSource.filter(data => data.id !== id.id))

    };

    const handleCancel = () => {
        setVisible(false);
        setIsModalVisible(false)
    };


    //树形控件
    const [RightList, setRightList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            // console.log(res.data)
            setRightList(res.data)
        })
    }, []);

    //获取权限详情
    const getsetCheckedKeys = (item) => {
       axios.get(`http://localhost:5000/roles/${item.id}`).then(res=>{
           // console.log(res.data.rights)
           setCheckedKeys(res.data.rights)
       })

    }
    //点击复选框事件
    const onCheck=(content)=>{
        console.log(content.checked)
        setCheckedKeys(content.checked)
    }

    //点击ok确认修改权限
    const handleCheckedKeyOk=()=>{
        setIsModalVisible(false)
        setDataSource(dataSource.map(item =>{
            if (item.id===currentId){
                return {
                    ...item,
                    rights:checkedKeys

                }
            }
            return item
        }))
        axios.patch(`http://localhost:5000/roles/${currentId}`,{
            rights:checkedKeys
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

            {/*    权限选择弹出窗口*/}
            <Modal title="权限分配" visible={isModalVisible} onOk={handleCheckedKeyOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly={true}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={RightList}
                />
            </Modal>

        </div>
    );
}

export default RoleList;
