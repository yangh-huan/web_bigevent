$(function () {
  //表单验证规则
  var form = layui.form
  
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samep:function (value) {
      // value是$('.input-newp').val()
      if (value === $('.input-psw').val()) {
        return '两次密码不能相同'
      }
    },
    checkp:function (value) {
      if (value !== $('.input-newp').val()) {
        return '请重新确认密码'
      }
    }
  });

  // 监听提交
  $('.form-chenge').on('submit', function(e){
    e.preventDefault();
    // console.log($(this).serialize());
    //id=9651&username=itheima11&nickname=yanghu&email=163%40163.com
    $.post('/my/updatepwd',
      // data:$(this).serialize(),
      {
        oldPwd:$('.input-psw').val(),
        newPwd:$('.input-newp').val()
      },
      function (result) {
        if (result.status !== 0) {
          return layer.msg(result.message)
        }
        layer.msg(result.message)
        
        //可以返回主页
        // setTimeout(function () {
        //   parent.location.reload()
        // },1000)

        //也可以重置表单项，调用form的reset()方法
        console.log($('.form-chenge'));
        // $('.form-chenge')是一个特定的jQuery数组，他的索引号为0的元素才是原生的dom元素
        $('.form-chenge')[0].reset()
      }
    )
  });


})
