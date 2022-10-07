

import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import {Button} from "antd";

function Unpublished(props) {
    const {dataSource,handlePublish}=usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handlePublish(id)}>
                发布
            </Button>}></NewsPublish>
        </div>
    );
}

export default Unpublished;
