import React, {useState} from 'react'
import 'antd/dist/antd.css'
import {Card,Input,Button,Spin,message} from 'antd'
import {UserOutlined, KeyOutlined} from '@ant-design/icons';
import '../static/css/Login.css'
import axios from 'axios'
import servicePath from '../config/apiUrl'

function Login (props){

    const [userName, setUserName] = useState('')
    //检测登陆状态
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin=()=>{
        setIsLoading(true)
        // 判断username是否为空
        if (!userName) {
            message.error('User name is empty!')
            setTimeout(()=>{
                setIsLoading(false)
            },500)
            return false
        }else if (!password){
            message.error('Password is empty!')
            setTimeout(()=>{
                setIsLoading(false)
            },500)
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password

        }
        
        axios({
            method:'post',
            url:servicePath.checkLogin,
            data: dataProps,
            // 前端后端共享session
            withCredentials:true
        }).then(
            res=>{
                setIsLoading(false)
                if(res.data.data=='success'){
                    // 将OpenId缓存
                    localStorage.setItem('openId',res.data.openId)
                    // 登录成功后跳转首页
                    props.history.push('/index')
                }else{
                    message.error('Username or Password is wrong!')
                }

            }
        )
    }

    return (
        <div className='login-div'>
            {/* 加载 spinning是否为加载中状态，如果为true会显示*/}
            <Spin tip='Loading...' spinning={isLoading}>
                <Card title='Blog Admin System' bordered={true} style={{width:400}}>
                    <Input 
                    id='userName'
                    size='large'
                    placeholder='Enter your user name'
                    prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange={(e)=>{setUserName(e.target.value)}}
                    />

                    <br />
                    <br />

                    <Input.Password
                    id='password'
                    size='large'
                    placeholder='Enter your password'
                    prefix={<KeyOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <br />
                    <br />
                    <Button type='primary' size='large' block onClick={checkLogin}>
                        Login
                    </Button>

                    <br />
                    <br />
                </Card>
            </Spin>
            
        </div>
    )
}

export default Login