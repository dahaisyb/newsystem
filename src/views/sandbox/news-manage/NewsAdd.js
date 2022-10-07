import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, Input, PageHeader, Select, Steps, message, notification} from "antd";
import './NewsAdd.css'
import axios from "axios";
import login from "../../login/Login";
import NewsEditor from "../../../components/new-manage/NewsEditor";

const {Step} = Steps;
const {Option} = Select

function NewsAdd(props) {
    //获取表单值ref
    const NewsForm = useRef(null)
    //新闻内容数据
    const [content, setContent] = useState("");
    //新闻标题
    const [infoForm, setInfoForm] = useState({});
    //步骤显示
    const [current, setCurrent] = useState(0);
    //下一步
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then((res) => {
                setCurrent(current + 1)
                setInfoForm(res)
            }).catch((error) => {
                console.log(error)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                console.log(infoForm, content)
                setCurrent(current + 1)
            }

        }
    }
    //上一步
    const handleback = () => {
        setCurrent(current - 1)
    }


    //新闻类型数据
    const [category, setCategory,] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/categories').then(res => {
            const maps=res.data
            setCategory(maps)
            console.log(maps)
        })
    }, []);
    //本地储存数据
    const User=JSON.parse(localStorage.getItem("token"))

    //提交保存
    const handleSave = (auditState) => {
        axios.post('http://localhost:5000/news', {
            ...infoForm,
            "content": content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0
        }).then(res =>{
            props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState===0?'草稿箱':'审核列表'}`,
                placement:'bottomRight',
            });
        })
    }

    return (
        <div>
            {/*头部标题*/}
            <PageHeader
                className="site-page-header"
                title="攥写新闻"
                subTitle="This is a subtitle"
            />

            {/*步骤条*/}
            <Steps current={current}>
                <Step title="Finished" description="This is a description."/>
                <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description."/>
                <Step title="Waiting" description="This is a description."/>
            </Steps>

            {/*表单*/}
            <div className={current === 0 ? '' : 'active'}>
                <Form
                    name="basic"
                    ref={NewsForm}
                >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="新闻分类"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Select>
                            {
                                category.map(item =>
                                    <Option value={item.value} key={item.id}>{item.title}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <div className={current === 1 ? '' : 'active'}>
                <NewsEditor getContent={(value) => {
                    console.log(value)
                    setContent(value)
                }}/>
            </div>


            {/*步骤进行按钮*/}
            <div>
                {current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>}
                {
                    current === 2 && <span>
                    <Button type="primary" onClick={() => {
                        handleSave(0)
                    }
                    }>保存到草稿箱</Button>
                    <Button danger={true} onClick={() => {
                        handleSave(1)
                    }}>提交审核</Button>

                    </span>
                }
                {current > 0 && <Button onClick={handleback}>上一步</Button>}

            </div>
        </div>


    );
}

export default NewsAdd;
