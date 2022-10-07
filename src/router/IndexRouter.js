import React from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/SandBox"
import News from "../views/news/News";
import Detail from "../views/news/Detail";
function IndexRouter(props) {
    return (
        <HashRouter>
            <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/news" component={News}/>
            <Route path="/detail" component={Detail}/>
            <Route path="/" render={()=>
                localStorage.getItem("token")?<NewsSandBox/>:<Redirect to="/Login"/>}/>
            </Switch>

        </HashRouter>
    );
}

export default IndexRouter;
