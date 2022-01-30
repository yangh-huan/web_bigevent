$(document).ready(function(){
  console.log(layui);
  //layui的弹出层
  // layui.use('layer', function(){
    var layer = layui.layer;
    // layer.msg('hello');
  // })
  //layui的form表单，下面use不可用，layer可以用use
  // layui.use('form', function(){
    var form = layui.form;
    
    //各种基于事件的操作，下面会有进一步介绍
  // });

  
  // var usernameregInput =$(".username-reg")

  // 还需要做继续优化 ：简化代码，加入一些动画效果

  $("#link-reg").click(function(){
    $(".login-form").hide()
    $(".reg-form").show()
  })

  $("#link-login").click(function(){
    $(".login-form").show()
    $(".reg-form").hide()
  })

  //加入layui注册表单验证
  form.verify({
    username: function(value){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      // if(value === 'xxx'){
      //   alert('用户名不能为敏感词');
      //   return true;
      // }
    },
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] 
  });

  // ----登录事件----监听表单的提交事件并阻止默认提交
  //并非监听按钮的点击事件，而且选择器还能写错
  $(".login-form").on('submit',function(e){
    // $("layui-btn-reg").click(function(e){
      e.preventDefault();
      
      $.post("/api/login",
      {
        username:$(".username-login").val(),
        password:$(".password-login").val()
      },
      function(res){
        if (res.status === 0) {
          layer.msg('登陆成功');
          // console.log(res.token);
          localStorage.setItem('token',res.token)
          // 直接跳转
          window.location.href='index.html';
          // 定时跳转
          //setTimeout("javascript:location.href='index.html'", 5000);
        } else {
          // alert(res.message)
          layer.msg(res.message);
          $(".username-login").val('')
          $(".password-login").val('')
        }
      });
      
    })

  // ----注册事件----监听表单的提交事件并阻止默认提交
  //并非监听按钮的点击事件，而且选择器还能写错
  $(".reg-form").on('submit',function(e){
  // $("layui-btn-reg").click(function(e){
    e.preventDefault();

    var usernamereg = $(".username-reg").val()
    var passwordreg = $(".password-reg").val()
    console.log(usernamereg);
    //判断两次密码是否相同
    //如果相同发起请求
    
    if ($(".password-reg").val() === $(".passwordcheck").val()) {

      $.post("/api/reguser",
    {
      username: usernamereg,
      password: passwordreg
    },
    function(res){
      if (res.status === 0) {
        layer.msg('注册成功');
        $("#link-login").click()
        $(".username-login").val(usernamereg)
        $(".password-login").val(passwordreg)
        console.log(passwordreg);
      } else {
        layer.msg(res.message);
      }
    });
    } else {
        layer.msg('您两次输入的密码不一致');
    }
    
  })

  


});