import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import AdminIndex from './AdminIndex'
import Login from './Login'

function Main(props) {
    

    return (
        //嵌套路由，上层的exact要删除
        <Router>
            <Route path='/' exact component={Login} />
           <Route path='/login' exact component={Login} />
           <Route path='/index' component={AdminIndex} />
        </Router>
    )
}

export default Main