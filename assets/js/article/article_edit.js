
  
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


  