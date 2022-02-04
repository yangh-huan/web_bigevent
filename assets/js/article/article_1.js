$(function () {

  var layer = layui.layer
  var form = layui.form
  
  //发起请求获取文章分类的列表
  initArtCateList()
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success:function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg(res.message)
        }

        //渲染数据
        // var htmlStr = template('tpl-table',res.data) 这个不可用，应该是template会自动解析响应数据
        var htmlStr = template('tpl-table',res)
        // console.log(htmlStr);
        $('tbody').html(htmlStr)
      }
    })
  }

  //添加类别按钮的功能
  var indexadd = null
  $('.btn-add').on('click',function () {
    //弹出
    indexadd =layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      // content: '<h1>不好操作</h1>' 所以利用类似于模板结构的方法
      //在页面中新增一个script以html形式解析,然后通过获取并操作dom赋值
      content: $('#dialog-add').html() //拿到了#dialog-add的dom结构并复制给了content
    })
  })
  
  //发起请求添加文章分类
  //当前的form并不是在页面中写死的而是通过js动态拼接的，只有点击添加按钮的时候才会向页面中追加这个表单
  //单纯想通过获取并监听这个表单不会生效，因为在绑定的时候页面中并不存在该元素
  //通过代理的形式为add表单绑定submit事件
  // $('#form-add').on('submit',function () {}) 不生效
  $('body').on('submit','#form-add',function (e) {
    e.preventDefault();
    // console.log(e)
    $.ajax({
      method: "POST",
      url: '/my/article/addcates',
      //快速获取表单中的数据
      data: $(this).serialize(),
      success:function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
 
        initArtCateList()
        layer.msg(res.message)
        //完成添加后根据index关闭对应的弹出层
        layer.close(indexadd)
      }
    })
  })

  //为编辑按钮绑定点击事件，弹出层
  //不能直接获取到该动态元素，需要使用代理，可以使用body也可以使用夫盒子div，最好是tbody
  var indexedit = null
  $('.layui-table tbody').on('click','.btn-edit',function () {
    indexedit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });
    // attr()返回属性值
    var id = $(this).attr('data-id')
    // console.log(id);
    //根据id发起请求获取当前的数据并渲染到表单
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/'+ id,
      // data: { id: id},
      success:function (result) {
        // console.log(result);
        if (result.status !== 0) {
          return layer.msg(result.message)
        }
        //渲染  快速填充表单数据，添加lay-filter属性,注意不要加#
        form.val('form-edit',result.data)
      }

    })

  })

  //监听表单提交，用id发请求修改数据
  $('body').on('submit','#form-edit',function (e) {
    e.preventDefault();
    // console.log(e)
    $.ajax({
      method: "POST",
      url: '/my/article/updatecate',
      //快速获取表单中的数据
      data: $(this).serialize(),
      success:function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
 
        initArtCateList()
        layer.msg(res.message)
        //完成添加后根据index关闭对应的弹出层
        layer.close(indexedit)
      }
    })
  })
  
  //删除功能
  $('tbody').on('click','.btn-delete',function (e) {
    console.log(e)
    var id = $(this).attr('data-Id')

    //弹出询问框
    layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
      //发起请求删除数据
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/'+ id,
        success:function (res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
   
          initArtCateList()
          layer.msg(res.message)

          layer.close(index);
        }
  
      })
      
    })


  })




})