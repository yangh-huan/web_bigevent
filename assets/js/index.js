// 在使用layui渲染页面时，由于ajax的请求数据是异步请求，所以页面首先加载dom元素，加载完了之后ajax的数据才会返回，这就导致页面中用户信息的二次加载，会根据用户的实际信息进行判断应当如何加载，这时候页面会进行刷新，所以就出现一个闪动问题


$(function(){
  
  // console.log($);
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
        // console.log(res);

        if (res.status !== 0) {
          // console.log(res.message);
          layui.layer.msg('获取用户信息失败')
          return location.href='login.html'
        } else {
          //调用renderAvater 渲染用户头像
          renderAvater(res.data)
          
        }
      },

    });
  }

  function renderAvater(user) {
    //获取用户昵称
    var uname= user.nickname || user.username
    //欢迎 **
    $('.welcome').html('欢迎&nbsp&nbsp'+uname)

    if (user.user_pic) {
      // $('.layui-nav-img').attr({src:user.user_pic})也可以，但是为了解决闪动问题，页面中display都设置为none了，所以要加.show()
      $('.layui-nav-img').attr({src:user.user_pic}).show()
      
      $('.avater').hide()
    } else {
      $('.layui-nav-img').hide()

      //首字母/汉字 转大写
      var first= uname[0].toUpperCase()
      $('.avater').text(first).show()
      // $('.avater').text(first) 
    }
  }

  //退出功能
  $('.logout').on('click',function() {
    console.log('点击了退出');
    layer.confirm('确认退出？', {icon: 3, title:'提示'}, function(index){
      //do something
      localStorage.removeItem('token')
      location.href='login.html'
      
      layer.close(index);
    });

    
    getUserInfo()
  })


})