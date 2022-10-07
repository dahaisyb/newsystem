import React, {useEffect, useState, useRef} from 'react';
import {Button, Modal, Switch, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

import UserForm from "../../../components/user- manage/UserForm";


// const {Option} = Select;

function UserList(props) {


    //Table列表数据
    const [dataSource, setDataSource] = useState([]);
    //区域数据
    const [regionsList, setRegionsList] = useState([]);
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionsList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"全球",
                    value:"全球"
                }
            ],

            onFilter:(value,item)=>{
                if(value==="全球"){
                    return item.region===""
                }
                return item.region===value
            },
            render: (region) => {
                return (
                    <b>{region === '' ? '全球' : region}</b>
                )
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => {
                    changeState(item)
                }}></Switch>
            }
        },

        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
                            showModal(item)
                        }} disabled={item.default}/>

                        {/*    权限勾选*/}
                        <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
                            handleUpdate(item)
                        }} disabled={item.default}/>
                    </div>

                )
            }
        },
    ]

    const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios.get('http://localhost:5000/users?_expand=role').then(res => {
            setDataSource(res.data)
            const list = res.data
            setDataSource(roleObj[roleId]==="superadmin"?list:[
                ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
            ])
        })
    }, [roleId,region,username]);


    //弹出确认窗口
    const [visible, setVisible] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    const [id, setId] = useState({});

    const showModal = (item) => {
        setId(item)
        setVisible(true);
    };

    const handleOk = () => {
        setDataSource(dataSource.filter(data => data.id !== id.id))
        axios.delete(`http://localhost:5000/users/${id.id}`)
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);

    };

    //添加用户表单

    //弹出框显示
    const [isvisible, setIsvisible] = useState(false);

    //角色数据
    const [roleIdList, setRoleIdList] = useState([]);
    //
    const addForm = useRef()

    //请求区域数据
    useEffect(() => {
        axios.get('http://localhost:5000/regions').then(res => {
            setRegionsList(res.data)
        })
    }, []);
    //请求角色数据
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
            setRoleIdList(res.data)
        })
    }, []);
    //确认添加事件
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            addForm.current.resetFields()
            axios.post('http://localhost:5000/users', {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                console.log(res.data)
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleIdList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(err => {
            console.log(err)
        })
        setIsvisible(false)
    }


    //更改用户状态
    const changeState = (item) => {
        console.log(item)
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })


    }

    //修改用户信息
    //    弹出信息框
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const updateForm = useRef()
    const [isupdateDisabled, setIsupdateDisabled] = useState(false);
    //
    const [current, setCurrent] = useState(null);

    //点击修改按钮
    const handleUpdate = (item) => {
        setIsUpdateVisible(true)
        console.log(item)
        setTimeout(() => {
            if (item.roleId === 1) {
                setIsupdateDisabled(true)
            } else {
                setIsupdateDisabled(false)
            }
            updateForm.current.setFieldsValue(item)
        }, 0)

        setCurrent(item)


    }
    //点击更新按钮触发事件
    const updateFormOk = (item) => {
        setIsupdateDisabled(!isupdateDisabled)
        setIsUpdateVisible(false)
        updateForm.current.validateFields().then(value => {
            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleIdList.filter(item => item.id === value.roleId)[0]
                    }
                }
                return item
            }))
            axios.patch(`http://localhost:5000/users/${current.id}`,value)
        })


    }


    return (
        <div>
            {/*添加用户*/}
            <Button type="primary" onClick={() => {
                setIsvisible(true)
            }}> 添加用户</Button>

            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>

            {/*删除弹窗确认窗口*/}
            <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
            </Modal>


            {/*    添加用户弹出表单*/}
            <Modal
                visible={isvisible}
                title="Create a new collection"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsvisible(false)
                }}
                onOk={() => {
                    addFormOk()
                }}
            >
                <UserForm ref={addForm} roleIdList={roleIdList} regionsList={regionsList}></UserForm>
            </Modal>

            {/*    更新用户弹出表单*/}
            <Modal
                visible={isUpdateVisible}
                title="更新信息"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                }}
                onOk={() => {
                    updateFormOk()

                }}
            >
                <UserForm ref={updateForm} roleIdList={roleIdList} regionsList={regionsList}
                          isupdateDisabled={isupdateDisabled}></UserForm>
            </Modal>

        </div>
    );
}

export default UserList;
