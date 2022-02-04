$(function () {
  
  // 1. 定义渲染类别数据的方法
  initCate()
  //  1.1 (下拉选择框中)获取文章分类列表
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layui.layer.msg(res.message)
        }
  
        // 1.2获取成功后渲染到下拉选择框
        var htmlStr = template('tpl-cate',res)
        // console.log(htmlStr)
        $('[name="cate_id"]').html(htmlStr)

        // 1.3调用layui.form.render(),动态添加类别-->为了使layui首次渲染下拉选择框之后能够监听到修改动作，并再次渲染下拉选择框
        layui.form.render()
      }
    })
  }

  // 2. 调用 `initEditor()` 方法，初始化富文本编辑器
  initEditor()

  // 3. 实现基本裁剪效果
  //  3.1 初始化图片裁剪器
  var $image = $('#image')
  //  3.2 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  //  3.3 初始化裁剪区域
  $image.cropper(options)

  // 4. 更换裁剪的图片
  //  4.1 我们需要一个input-file的文件选择框，并将其隐藏并在选择封面按钮上绑定模拟点击事件
  $('.btn-cover').on('click',function () {
    // e.preventDefault()
    $('#ipt-cover').click()
  })

  //  4.2 将用户选择的图片设置到裁剪区
  //   4.2.1 监听ipt-cover文件选择框的change事件，在change事件中可以获取用户选择的文件列表
  $('#ipt-cover').on('change',function (e) {
    console.log(e)
    //在事件对象e上有用户选择的文件列表
    var list = e.target.files
    //   4.2.2 判断用户是否选择了文件，未选择就return出去
    if (list.length === 0) {
      return layui.layer.msg('未选择文件')
    }
    //  4.2.3 拿到用户选择的文件
    var file = e.target.files[0]
    //  4.2.4 根据选择的文件，创建一个对应的 URL 地址：
    //    URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
    var newImgURL = URL.createObjectURL(file)
    //  4.2.5 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
  
    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
  })

  // 5. 监听表单的提交事件，发起请求

  // 5.1 因为要提交的接口数据是FormData 格式的所以，提前处理好参数
  // 5.2 请求体中包含5个数据，先处理状态state，需要结合用户点击行为进行判断
  var state = '已发布'
  // 5.3 给存为草稿按钮添加点击事件，点击后将state的状态修改为 ‘草稿’
  $('.btn-draft').on('click',function () {
    state = '草稿'
  })
  // 5.4 监听表单的提交事件，发起请求
  $('#form-pub').on('submit',function (e) {
    e.preventDefault()
    // 5.5 基于form表单，构造函数FormData，快速创建一个FormData对象
      // console.log($(this)) $(this)是一个jquery对象
      // console.log($(this)[0]) $(this)[0]就是当前原生的DOM对象
      // new FormData($(this)[0]) 通过构造函数FormData，快速创建一个FormData对象
    var fd = new FormData($(this)[0])
      // console.log(fd) 打印出的内容不是很清晰
      // FormData 接口的append() 方法 会添加一个新值到 FormData 对象内的一个已存在的键中，如果键不存在则会添加该键
    // 5.6 将state的值追加给fd
    fd.append('state',state)
    
    // 5.7 将裁剪后的图片，输出为文件
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {       // 调用$image的toBlob方法，将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      //console.log(blob)  // blob可以打印，Blob {size: 238263, type: 'image/png'}，但在fd.forEach中无法体现
      fd.append('cover_img',blob)

      //  5.8 发起请求
      publishArticle(fd)
    })
    // fd.forEach(function (v,k) {
    //   console.log(k,v);
    // })
    
  })

  // 定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意 如果向服务器提交的是FormData格式的数据，
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)

        // 重新渲染页面或者跳转至文章列表页 或者 location.href = '/article/article_3.html'
        setTimeout(function () {
          document.location.reload()
          $('.returnTop').click()
        },1500)
        
      }
    })
  }
})