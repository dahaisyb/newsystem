import {useEffect, useState} from "react";
import axios from "axios";
import {notification} from "antd";

function usePublish(type){
    //列表渲染数据
    const [dataSource, setDataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"))
    //请求列表数据
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=password`).then(res=>{
            setDataSource(res.data)
            console.log(res.data)
        })
    }, [username]);

    const handlePublish=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `已发布，您可以到【已经发布】中查看您的新闻`,
                placement:"bottomRight"
            });
        })
    }

    const handleSunset=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
            "publishState": 3,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `已下线，您可以到【已下线】中查看您的新闻`,
                placement:"bottomRight"
            });
        })
    }

    const handleDelete=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`/news/${id}`).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement:"bottomRight"
            });
        })
    }





    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}
export default usePublish
