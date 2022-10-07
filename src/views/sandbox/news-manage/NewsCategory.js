import React, {useEffect, useState} from 'react';
import {Button, Table, Tag} from "antd";
import axios from "axios";

function NewsCategory(props) {

    //列表渲染数据
    const [dataSource, setDataSource] = useState([]);
    //获取列表数据
    useEffect(() => {
       axios.get('/categories').then(res =>{
           setDataSource(res.data)
       })
    }, []);

    //列表结构
    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '新闻分类',
            dataIndex: 'title',
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                      <Button danger onClick={()=>{handleDelete(item)}}>删除</Button>
                    </div>

                )
            }
        },
    ]
    //删除分类
    const handleDelete=(item)=>{
        axios.delete(`/categories/${item.id}`).then(res=>{
            console.log(res)
        })

        setDataSource(dataSource.filter(data=>data.id !== item.id))
    }



    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>
        </div>
    );
}

export default NewsCategory;
