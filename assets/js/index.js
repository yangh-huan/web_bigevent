$(document).ready(function(){
  // var token =localStorage.getItem('token')  || ''
  // console.log(token);
  getUserInfo()

  function getUserInfo() {
    $.ajax({
      methods: 'GET',
      url:'/my/userinfo',
      //headers不是header
      // headers:{
      //   Authorization:token
      // },
      success: function(res){
        console.log(res);

        if (res.status !== 0) {
          // console.log(res.message);
          layui.layer.msg('获取用户信息失败')
          return location.href='login.html'
        } else {
          //调用renderAvater 渲染用户头像
          renderAvater(res.data)
          
        }
      },

      //无论成功或者失败，$.ajax()都会调用complete回调函数,其中服务器的参数与success略有不同
      //控制用户权限，获取用户信息，判断是否含有token
      
      complete: function (res) {
        console.log(res);
        //在complete中可以使用respenseJSON拿到服务器相应回的数据

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 1. 强制清空 token
        localStorage.removeItem('token')
        // 2. 强制跳转到登录页面
        location.href = '/login.html'
      }
        
      }

      //---假token并不生效---
    });
  }

  function renderAvater(user) {
    //获取用户昵称
    var uname= user.nickname || user.username
    //欢迎 **
    $('.welcome').html('欢迎&nbsp&nbsp'+uname)

    if (user.user_pic) {
      // $('.layui-nav-img').attr({src:user.user_pic}).show()
      $('.layui-nav-img').attr({src:user.user_pic})
      $('.avater').hide()
    } else {
      $('.layui-nav-img').hide()

      //首字母/汉字 转大写
      var first= uname[0].toUpperCase()
      // $('.avater').text(first).show()
      $('.avater').text(first) 
    }
  }

  //退出功能
  $('.logout').on('click',function() {
    console.log('点击了退出');
    localStorage.removeItem('token')
    getUserInfo()
  })


})