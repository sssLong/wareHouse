<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Editorbar',
  data () {
    return {
      editor: null,
      uploadHeader: { 'token': localStorage.token, contentType: 'multipart/form-data; charset=UTF-8' },
      height: ''
    }
  },
  props: ['content','disabledEdit'],
  watch: {
    content (newOne, oldOne) {
      this.editor.txt.html(newOne) //富文本赋值
    },
    // 编辑器禁用启用
    disabledEdit(val){
      if(val){
        this.editor.$toolbarElem.attr('style', 'display:none')
        this.editor.$textElem.attr('contenteditable', false)
      }
    }
  },
  mounted () {
      this.seteditor()
      let self = this;
      self.getHeight()
      // 窗口改变事件
      window.onresize = () => {
        return (() => {
              self.getHeight()
        })()
    }
  },
  methods: {
    seteditor () {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
      this.editor.customConfig.uploadImgServer = process.env.API_ROOT+'/user/sys/upload'// 上传地址
      this.editor.customConfig.uploadImgHeaders = this.uploadHeader
      this.editor.customConfig.uploadFileName = 'upfile' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 3 // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      // 配置菜单
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        // 'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
          this.$message.error("图片上传错误！请重新上传")
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          var url = result.url
          insertImg(url)
        }
      }
      this.editor.customConfig.onchange = (html) => {
        this.$emit('on-change',html) // 将内容同步到父组件中
      }

      // 创建富文本编辑器
      this.editor.create()
    },
   // 找出相邻元素
      _siblings(element) {
        let arr = [];
        // 找出父节点 然后找到父节点的所有子节点 遍历
        let p = element.parentNode.children;
        for(let i =0; i< p.length; i++) {
          if(p[i] !== element) arr.push(p[i]);
        }
        return arr;
      },
      // 取元素的属性 宽/高/margin/padding
      _getStyle(obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr];
        } else {
          return document.defaultView.getComputedStyle(obj, null)[attr];
        }
    },
    // 获取元素的margin-top
    _getMarginTop(ele, attr) {
        let domMargin = this._getStyle(ele, attr)
        return Number(domMargin.substr(0,(domMargin.length-2)))
    },
    // 求和 元素之间的高度
    _getSum(arr) {
      let sum = 0
      arr.forEach(item => {
          item.marginTop = this._getMarginTop(item,'marginTop')
          item.marginBottom = this._getMarginTop(item,'marginBottom')
          sum += item.offsetHeight+item.marginTop+item.marginBottom
      })
      return sum;
    },
     // 获取编辑区域高度
      getHeight() {
        this.$nextTick(() => {
          let mainDom = document.getElementsByClassName('main')[0]
          let editorDom= this.$el
          let formitemDom = editorDom.parentNode.parentNode; // 编辑器父级
          let formDom = editorDom.parentNode.parentNode.parentNode; // 表单form
          let formDomMarginTop = this._getMarginTop(formDom,'marginTop') + this._getMarginTop(formDom,'marginBottom') + this._getMarginTop(formDom,'paddingTop') + this._getMarginTop(formDom,'paddingBottom')
          let arr = this._siblings(formDom)
          let elArr = this._siblings(formitemDom)
          let outSum = this._getSum(arr)
          let innerSum = this._getSum(elArr)
          this.height = mainDom.offsetHeight - outSum - innerSum - formDomMarginTop
          this.$refs.editor.style.height = this.height + 'px'
          console.log(mainDom.offsetHeight,outSum,innerSum,formDomMarginTop,this.height)
        });
      }
  }
}
</script>

<style scoped>
.editor {
  width: 800px;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  /* height: 500px; */
}
.text>>>ul li{
  list-style-type: disc;
}
.text>>>ol li{
  list-style-type: decimal;
}
</style>