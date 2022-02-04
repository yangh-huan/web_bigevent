$(function () {
  var laypage = layui.laypage;
  var layer = layui.layer
  var form = layui.form
  var fdData = null
  
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }

  // 1. 初始化富文本编辑器
  initEditor()

  // 2. 初始化裁剪区域

  // 2.1 初始化图片裁剪器
  var $image = $('#image')
    
  // 2.2 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 2.3 初始化裁剪区域
  $image.cropper(options)

  //定义美化时间的过滤器 导入template后，通过defaults属性上的imports可以定义过滤器，起个名字dateFormat,形参接收date参数
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    //通过dt可以获取到年月日时分秒
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return  y + '-' + m + '-' + d + ' '+ hh + ':' + mm +':' + ss
  }

  //定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  
  initTable()
  initCate()
  //获取并渲染文章列表数据，表格的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success:function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // layer.msg(res.message)
        //template('tpl-table',res)返回渲染好的结构 接受并填充到tbody
        var htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
        //res中含有total属性，值是文章总数，传给分页函数,用来动态的计算页面
        renderPage(res.total)
      }
    })
  }

  //获取并渲染分类列表，下拉选择框的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // layer.msg(res.message)
        //需要使用模板引擎渲染分类项，而不是把数据填充到form表单
        // form.val('form-cate',res.data)
        var htmlString = template('tpl-cate',res)
        // console.log(htmlString);
        $('.cate').html(htmlString)

        //此时没有渲染出来是因为layui机制，该事件没有被layui.js监听到，所以需要调用layui本身的form.render()事件，通知layui重新渲染表单区域的ui结构
        form.render()
      }
    })
  }

  // 监听筛选表单的提交事件
  $('.form-search').on('submit',function (e) {
    e.preventDefault();
    
    //发起请求获取当前分类的列表数据并渲染到表格
    q = {
      pagenum: 1,
      pagesize: 2,
      cate_id: $('[name="cate_id"]').val(),
      state: $('[name="state"]').val()
    }

    initTable()
  })

  //定义渲染分页的方法
  function renderPage(total) {
    // console.log(q);
    //分页为表格服务，点击不同的页码值，表格数据进行切换，每当新的表哥数据渲染完成以后再调用渲染出新的分页
    laypage.render({
      elem: 'pageBox', //分页容器的ID 不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      limits: [2,3,5,10],
      layout: ['count','limit','prev', 'page', 'next','skip'], // 属性在数组中的顺序决定了页面上的位置顺序，功能不会发生错乱，仅是位置发生变化
      //分页发生切换的回调函数
      jump: function (obj,first) {//只要调用renderPage就会触发-->发生死循环的原因
        
        //如果有办法判断出是哪种方式触发的jump回调就可以解决死循环
        //第二个参数是布尔值，如果是用第二种方式调用first是ture，第一种则是undefined
        //console.log(first)

        // console.log(obj)
        //console.log(obj.curr) // 拿到新的页码值，首次加载时也会触发
        //console.log(obj.limit) //得到每页显示的条数


        // 拿到新的页码值，赋值给q,再次发起获取文章数据的请求
        q.pagenum = obj.curr
        //obj.limit 将得到每页显示的条数赋值给q,$.ajax中的data就拿到了最新的q
        q.pagesize = obj.limit
        
        //如果直接调用 initTable() 会发生死循环,因为initTable再次调用了renderPage
        //而触发jump回调的方式有两种，1是点击页码触发，2是只要调用renderPage就会触发-->发生死循环的原因，所以再次吊用了initTable
      
        //可以通过first的值来判断调用方式，如果是非true，则调用initTable,如果是true则不调用
        if (!first) {
          initTable()
        }
      }
    })
  }

  //实现删除功能
  $('tbody').on('click','.btn-delete',function () {
    //弹出询问框
    layer.confirm('确认删除文章?', {icon: 3, title:'提示'}, function(index){
      //根据id删除该文章
      var id = $('.btn-delete').attr('data-Id')

      //获取删除按钮的个数
      var len = $('.btn-delete').length
      console.log(len);
      // var id = $(this).attr('data-Id')
      
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          // console.log(res)
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg(res.message)

          //当数据删除完成后，需要判断当前这一页是否还有剩余数据
          //没有则页码值-1再调用initTable，，，防止当前页数据删除完毕后渲染空数据
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1 
            //删除完成后，服务器数据删除，在重新调用initTAble前该页面元素还存在
            //调用渲染完毕后，页面上无数据，此时就要将页码值减一后在调用
          }
          initTable()
          
          //layer.close(index) //在这里在下面都可以

        }
      })
      layer.close(index)
    })
  })
  
  //实现编辑功能
  $('tbody').on('click','.btn-edit',function () {
    var id = $(this).attr('data-Id')
    // location.href = '/article/article_edit.html'

    $('.card-list').hide()
    $('.card-edit').show()
    getEditData(id)
  })

  // 3. 获取文章详情并渲染，接收文章ID
  function getEditData(id) {
   
    $.ajax({
      method: "GET",
      url: '/my/article/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        console.log(res.data)
        fdData = res.data

        //调用渲染方法
        initArticleDetails(res.data)
      }
    })
  }

  // 填充到页面结构中
  function initArticleDetails(data) {
    // 1. 渲染标题
    $('[name="title"]').val(data.title)

    //2. 渲染出所有分类，并选中当前文章分类

    // function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // layer.msg(res.message)
        //需要使用模板引擎渲染分类项，而不是把数据填充到form表单
        // form.val('form-cate',res.data)
        var htmlStrings = template('tpl-edit',res)
        // console.log(htmlString);
        $('[name="cate_id"]').html(htmlStrings)

        //此时没有渲染出来是因为layui机制，该事件没有被layui.js监听到，所以需要调用layui本身的form.render()事件，通知layui重新渲染表单区域的ui结构
        form.render()
        // console.log($('.henfan option').attr('value'))
        //正常来说，需要把该文章的当前分类默认选中,给设置selected，但是目前并不知道该如何进行动态的判定，所以为了节省时间就pass了
        //if ($('.henfan option').attr('value') === res.data) {
        //  $(this).attr('selected')
        // 如果能获取到重新渲染后的所有option,并将他们的value和data中的id进行匹配，匹配成功后加入selected，即可被选中
        //}
      }
    })

    // 3. 渲染内容区域
    // $('[name="content"]').html(data.content)
    tinyMCE.activeEditor.setContent(data.content)

    // 4. 封面部分
    // 4.1 拿到当前封面
    //var file = null
    // var myBlob = null
    ////$.ajax({
    //  method: "GET",
    //  url: data.cover_img,
      // responseType: 'blob',
    //  success:function (res) {
    //    console.log(res)
    //    file = res
        // myBlob = new window.Blob([res], {type: 'image/jpeg'})
    //  }
    //})
    // console.log(file)
    // 4.2 根据选择的文件，创建一个对应的 URL 地址
   //var newImgURL = URL.createObjectURL(file)
   //console.log(newImgURL);
    // 4.3 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域
  // $image
  //  .cropper('destroy')      // 销毁旧的裁剪区域
  //  .attr('src', newImgURL)  // 重新设置图片路径
  //  .cropper(options)        // 重新初始化裁剪区域
//
    // 5. 点击按钮发起请求
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
      fd.append('Id',fdData.Id)
      
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
        url: '/my/article/edit',
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
          
          setTimeout(() => {
            document.location.reload()
          }, 1000);
        }
      })
    }
  }



  
})