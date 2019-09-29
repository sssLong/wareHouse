import commonUtils from './commonUtils';
import element from './element';
import module from './module';

String.prototype.toHump = function () { // 下划线转驼峰
  return this.replace(/_(\w)/g, function () {
    return arguments[1].toUpperCase()
  })
}

String.prototype.toLine = function () { // 驼峰转下划线
  return this.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export default {
  commonUtils,
  element,
  module
}