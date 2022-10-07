import React from 'react';
import {Table} from "antd";

function NewsPublish(props) {
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
            title: '操作',
            render:(item) => {
                return <div>{props.button(item.id)}</div>
            }
            // render: (item) => {
            //     return <div>{props.button(item.id)}</div>
            // }
        },
    ]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} rowKey={(item) => item.id}/>
        </div>
    );
}

export default NewsPublish;
