$(function () {
  //表单验证规则
  var form = layui.form
  var user= {}
  
  form.verify({
    nickname:function (value) {
      if (value.length > 8 ) {
        return '昵称长度在1-6之间'
      }
    }
  })
  //发起请求获取用户信息并进行渲染
  getInfo()

  function getInfo() {
    $.ajax({
      methods: 'GET',
      url: '/my/userinfo',
      success:function (res) {
        console.log(res);
        if (res.status !== 0) {
          // console.log('触发了');
          return layer.msg(res.message)
        }
        var userInfo = res.data
        user = userInfo
        $('.input-uname').val(userInfo.username)
        $('.input-nickname').val(userInfo.nickname)
        $('.input-email').val(userInfo.email)
      }

    })
  }

  //重置表单数据
  $('.btn-reset').on('click',function (e) {
    //阻止表单的默认重置
    e.preventDefault()
    //再次调用，获取并渲染原用户信息即可
    getInfo()
    
  })

  // 监听提交
  $('.form-chenge').on('submit', function(e){
    e.preventDefault();
    
    var nickname = $('.input-nickname').val()
    var email = $('.input-email').val()
    console.log(nickname);
    console.log(email);
    console.log(user.id);
    console.log($(this).serialize());
    //id=9651&username=itheima11&nickname=yanghu&email=163%40163.com
    $.post('/my/userinfo',
      // data:$(this).serialize(),
      {
        id:user.id,
        username:user.username,
        nickname:nickname,
        email:email
      },
      function (result) {
        if (result.status !== 0) {
          return layer.msg(result.message)
        }
        layer.msg(result.message)
        // getInfo()
        // getUserInfo()

        // 需要调用父页面中的方法，重新渲染用户的头像和用户的信息
        
        // window.parent.getUserInfo() --> 没生效
        // getUserinfo()要在window全局作用域下，将getUserinfo()提取出来写在jQuery的入口函数外面即可
        setTimeout(function () {
          parent.location.reload()
        },1000)
      }
    )
  });



})
