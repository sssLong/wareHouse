## 命名规范

1. 命名中尽量避免使用中文拼音命名，应该采用更简明有语义的英文单词进行组合
2. 养成良好的多写注释，如每个方法应注释一下，加强项目的可维护性
3. 不允许通过1、2、3等序号进行命名
4. .Vue文件应该首字母大写代表组件，如Login.vue
5. .js文件命名应使用小驼峰命名，如commonUtils.js

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8088
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## TABLE组件介绍，封装element-ui的Table组件，默认表格高度固定，右侧操作列固定，操作列的按钮平铺3个，超过收缩

#### 一、属性配置(兼容element-ui的table所有配置)

```
dataSource: {
  data: [], // 表格数据
  cols: cols, // 表格的列数据
  loading: true, // 显示加载loading
  isSelection: true, // 勾选框
  autoHeight: true, // 默认表格会根据兄弟节点高度进行固定高度，设置了这个值会自然高度
  isOperation: true, // 表格有操作列时设置
  operation: { // 表格有操作列时设置
      label: '操作', // 列名
      width: '60', // 根据实际情况给宽度
      data: [
          {
              label: '打印', // 操作名称
              emitType: 'print', // 触发父组件
              permission: '打印', // 后期这个操作的权限，用来控制权限
              invisibleKey: 'aaa', // 隐藏操作列按钮的 key 属性，在数据里设置 aaa 的值为 true 可隐藏
              disableKey: 'bbb' // 禁用操作列按钮的 key 属性，在数据里设置 bbb 的值为 true 可禁用
          }
      ]
  }
}
```

#### 二、cols列的配置(兼容element-ui的table-column所有配置)

```
{
  label: '单据状态',
  prop: 'packageStatus',
  isTemplate: true, // 是否使用template模板
  isImagePopover: true, // 图片的hover显示大图
  isCodeTableFormatter: true, // 是否是码表，默认会找package_statusList/packageStatusList的dataName
  codeTableCode: 'collect_package_status' // 如果不使用默认的packageStatus，则找设置的这个key值
}
```

#### 三、Table事件(暂不兼容element-ui的table事件，因业务暂不需要)

- 1. selection-change 加入了勾选框，切换选中事件
- 2. sort-change 排序事件
