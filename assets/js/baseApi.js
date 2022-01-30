//统一设置根路径和权限的接口headers
//ajaxPrefilter()函数用于指定预先处理Ajax参数选项的回调函数
$.ajaxPrefilter(function(option) {

  option.url = 'http://www.liulongbin.top:3007'+ option.url

  //只在调用有权限的接口时才设置
  //在调用不需要权限的接口时设置可能会发生错误
  if (option.url.indexOf('/my/') !== -1) {
    option.headers={
      Authorization:localStorage.getItem('token')  || ''
    }
  }

  
      //无论成功或者失败，$.ajax()都会调用complete回调函数,其中服务器的参数与success略有不同
      //控制用户权限，获取用户信息，判断是否含有token
      
  option.complete= function (res) {
    console.log(res);
    //在complete中可以使用respenseJSON拿到服务器相应回的数
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    // 1. 强制清空 token
    localStorage.removeItem('token')
    // 2. 强制跳转到登录页面
    location.href = '/login.html'
    }
    
  }

      //---假token并不生效---
})