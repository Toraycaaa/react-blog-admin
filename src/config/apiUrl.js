let ipUrl = 'http://47.115.56.152:7001/default/'

let servicePath = {
    checkLogin: ipUrl + 'checkLogin',  //检查用户名和密码
    getTypeInfo: ipUrl + 'getTypeInfo',  //获得文章类别信息
    addArticle: ipUrl + 'addArticle',  //添加文章
    updateArticle: ipUrl + 'updateArticle', //修改文章
    getArticleList: ipUrl + 'getArticleList', //查询文章列表
    delArticle: ipUrl + 'delArticle/', //删除文章
    getArticleById: ipUrl + 'getArticleById/', //根据ID获得文章详情
   
}

export default servicePath

// 也可以用axios的baseurl封装
// export const baseUrl = 'https://cors-anywhere.herokuapp.com/https://api.motivationalmodelling.com';
// const mmApi = axios.create({
//     baseURL: baseUrl
// });

