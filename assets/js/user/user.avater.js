$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 裁剪区纵横比
    aspectRatio: 1,
    // aspectRatio: 16/9,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  //2.0为上传按钮绑定点击事件
  $('.btn-upload').on('click',function () {
    //2.1模拟点击行为，，，，同时带来一个问题，为什么之前login页面某个绑定requeired 的必填表单隐藏之后可以不用还是可以进行提交
    $('#file').click()
  })
  //2.2为文件选择框绑定change事件
  $('#file').on('change',function (e) {
    console.log(e);
    //2.3获取用户选择的文件 e.target.fails 是数组，储存了选择的文件数据
    var fileList = e.target.files
    console.log(fileList);
    if (fileList.length === 0) {
      //2.3.1用户没有选择照片
      return layui.layer.msg('没有选中图片')
    }
    //2.3.2 拿到用户选择的文件
    var file = e.target.files[0]

    //2.3.3 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)

    //2.3.4 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的(当前的)裁剪区域`：

    $image
     .cropper('destroy')      // 销毁旧的裁剪区域
     .attr('src', newImgURL)  // 重新设置图片路径
     .cropper(options)        // 重新初始化裁剪区域

  })

  //3.0为确定按钮绑定点击事件
  $('.upload-sure').on('click',function () {
    //3.1拿到用户裁剪后的图片
     //将裁剪后的图片，输出为 base64 格式的字符串
     //创建一个 Canvas 画布
    var dataURL = $image
    .cropper('getCroppedCanvas', {
      width: 100,
      height: 100
    })
     //将 Canvas 画布上的内容，转化为 base64 格式的字符串
    .toDataURL('image/png')

    //3.2发起请求，将新图片上传
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        //可以调用父组件中的getUserInfo()重新渲染页面
        //也可以重新刷新并加载主页
        setTimeout(function () {
          parent.location.reload()
        },1000)
      }
    })




  })

})