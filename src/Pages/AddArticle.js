import React, {useState,useEffect} from 'react';
import marked from 'marked'
import '../static/css/AddArticle.css'
import {Row, Col, Input, Select, Button, DatePicker, message} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
import { OmitProps } from 'antd/lib/transfer/ListBody';

const {Option} = Select
const {TextArea} = Input



function AddArticle(props) {
    
    const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState('')   //文章标题
    const [articleContent , setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd,setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml,setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate,setShowDate] = useState()   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState() //选择的文章类别

    useEffect(()=>{
        getTypeInfo()
        //获取文章id
        let tmpId = props.match.params.id
        // 如果有ID
        if(tmpId){
            setArticleId(tmpId)
            getArticleById(tmpId)
        }
    },[])

    marked.setOptions({
        renderer: marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
      }); 

      const changeContent = (e) =>{
          setArticleContent(e.target.value)
          let html = marked(e.target.value)
          setMarkdownContent(html)
      }

      const changeIntroduce = (e) => {
          setIntroducemd(e.target.value)
          let html = marked(e.target.value)
          setIntroducehtml(html)
      }

      const getTypeInfo = () =>{
          axios({
              method:'get',
              url:servicePath.getTypeInfo,
              //跨域cookie
              withCredentials: true
          }).then(
                res=>{
                    if(res.data.data == 'unlogin'){
                        //清空本地存储
                        localStorage.removeItem('openId')
                        //跳转到首页
                        props.history.push('/')
                    }else{
                        setTypeInfo(res.data.data)
                    }
                }
          )
      }

      const selectTypeHandler = (value) => {
          setSelectType(value + 1)
      }

      const saveArticle = () => {
          //如果类型不为空
        if(!selectedType){
            message.error('Please select the article type!')
            return false
        }else if(!articleTitle){
            message.error('Please select the article title!')
            return false
        }else if(!articleContent){
                message.error('Please select the article content!')
                return false
        }else if(!introducemd){
                message.error('Please select the article introduction!')
                return false
        }else if(!showDate){
                message.error('Please select the date!')
                return false
        }else{
            console.log('909090---------------------------')
            let dataProps={}   //传递到接口的参数
            dataProps.type_id = selectedType 
            dataProps.title = articleTitle
            dataProps.article_content =articleContent
            dataProps.introduce =introducemd
            // let datetext= showDate.replace('-','/') //把字符串转换成时间戳
            // dataProps.addTime =(new Date(datetext).getTime())
            dataProps.addTime = showDate

            
            console.log(dataProps)

            
        if(articleId==0){
            dataProps.view_count =Math.ceil(Math.random()*100)+1000
            axios({
                method:'post',
                url:servicePath.addArticle,
                data:dataProps,
                withCredentials: true
            }).then(
                res=>{
                    setArticleId(res.data.insertId)
                    if(res.data.isSuccess){
                        message.success('文章添加成功')
                    }else{
                        message.error('文章添加失败');
                    }

                }
            )
            }else{
                dataProps.id = articleId
                axios({
                    method:'post',
                    url: servicePath.updateArticle,
                    data: dataProps,
                    withCredentials: true
                }).then(
                    res => {
                        if(res.data.isSuccess){
                            message.success('The article is saved.')
                        }else{
                            message.error('Save Fail!')
                        }
                    }
                )
            }
        
        }

      }
    
      const getArticleById = (id) =>{
          axios(servicePath.getArticleById + id,{
              withCredentials:true
          }).then(
              res=>{
                  let articleInfo = res.data.data[0]
                  setArticleTitle(articleInfo.title)
                  setArticleContent(articleInfo.article_content)
                  let html = marked(articleInfo.article_content)
                  setMarkdownContent(html)
                  setIntroducemd(articleInfo.introduce)
                  let tmpInt = marked(articleInfo.introduce)
                  setIntroducehtml(tmpInt)
                  setShowDate(articleInfo.addTime)
                  setSelectType(articleInfo.typeId)
              }
          )
      }


    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input placeholder='title'
                                value={articleTitle}
                                size='large'
                                onChange={(e)=>{setArticleTitle(e.target.value)}}
                                />
                        </Col>

                        <Col span={4}>
                            &nbsp;
                            {/* 下拉框默认为1 */}
                            {/* 设置类型改变 */}
                            <Select defaultValue='Type' size='large' onChange={selectTypeHandler}>
                                {/* 下拉框选项 */}
                                {
                                    typeInfo.map((item,index)=>{
                                        return (<Option 
                                           key={index} 
                                           value ={item.id}>{item.typeName}</Option>)
                                    })
                                }
                                
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                className='markdown-content'
                                rows={35}
                                placeholder='Article Content'
                                onChange={changeContent}
                                value={articleContent}
                                />
                        </Col>

                        <Col span={12}>
                            <div className='show-html'dangerouslySetInnerHTML={{__html:markdownContent}}> 

                            </div>
                        </Col>

                    </Row>
                </Col>
                {/* 右侧 */}
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size='large'>
                                暂存文章
                            </Button>&nbsp;
                            <Button type='primary' size='large' onClick={saveArticle}>
                                发布文章
                            </Button>
                            <br />
                        </Col>

                        <Col span={24}>
                            <br />
                            <TextArea 
                                rows={4} 
                                value={introducemd}  
                                onChange={changeIntroduce} 
                                onPressEnter={changeIntroduce}
                                placeholder="文章简介"
                                value={introducemd}
                            />
                            <div 
                                className="introduce-html"
                                dangerouslySetInnerHTML = {{__html:'文章简介：'+introducehtml}} >
                            </div>
                        </Col>

                        <Col span={12}>
                            <div className='date-select'>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder='发布日期'
                                    size='size'
                                    // 设置日期改变
                                    onChange={(value,dateString)=>{setShowDate(dateString)}}
                                    />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AddArticle
