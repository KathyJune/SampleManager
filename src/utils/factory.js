/**
 * Created by 9I
 * @Date 2018/8/16
 * @description 工具类
 */
export function convertToArray (array) {
  let retVal = []
  try {
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        let _array = []
        for (let key in array[i]) {
          _array.push(array[i][key])
        }
        retVal.push(_array)
      }
    }
  } catch (e) {
    console.log(e)
    retVal = array
  }
  return retVal
}
// object 转为为一维数组
export function _toArray (array, key) {
  let retVal = []
  try {
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        retVal.push(array[i][key])
      }
    }
  } catch (e) {
    retVal = array
  }
  return retVal
}
// 转化成树结构
export function convertToTree (array, key) {
  let retVal = []
  try {
    if (array && array.length > 0) {
      let _lenght = array.length
      for (let i = 0; i < _lenght; i++) {
        if (array[i].level !== 0) continue
        let _memu = {
          id: array[i].id,
          areaName: array[i].areaName,
          level: array[i].level,
          parentName: array[i].parentName,
          children: []
        }
        for (let j = 0; j < _lenght; j++) {
          if (array[j].parentName !== _memu.areaName) continue
          let _sMenu = {
            id: array[j].id,
            areaName: array[j].areaName,
            level: array[j].level,
            parentName: array[j].parentName,
            children: []
          }
          for (let k = 0; k < _lenght; k++) {
            if (array[k].parentName !== _sMenu.areaName) continue
            _sMenu.children.push({
              id: array[k].id,
              areaName: array[k].areaName,
              level: array[k].level,
              parentName: array[k].parentName
            })
          }
          _memu.children.push(_sMenu)
        }
        retVal.push(_memu)
      }
    }
  } catch (e) {
    console.log(e)
    retVal = array
  }
  return retVal
}

export function isLogin () {
  let isLogin = false
  try {
    let _login = localStorage.getItem('login')
    let login = JSON.parse(_login)
    if (login.username) {
      isLogin = true
    }
  } catch (e) {
    // console.log(e)
  }
  return isLogin
}

export const isArray = function (o) {
  return Array.isArray(o)
}

export const inArray = function (elem, arr, i) {
  return arr == null ? -1 : Array.indexOf.call(arr, elem, i)
}
// 把三维转为多维数据
export function convertToArrayByKey (array, year, key, value, keyAarry) {
  let retVal = []
  try {
    let _year = []
    let _key = keyAarry || []
    if (array && array.length > 0) {
      // 提取
      for (let i = 0; i < array.length; i++) {
        _year.indexOf(array[i][year]) === -1 && _year.push(array[i][year])
        _key.indexOf(array[i][key]) === -1 && _key.push(array[i][key])
      }
      let _array = []
      for (let i = 0; i < _year.length; i++) {
        let row = []
        row[0] = _year[i]
        _array[i] = row
      }
      for (let i = 0; i < array.length; i++) {
        let _value = array[i][value]
        let _row = _year.indexOf(array[i][year])
        let _col = _key.indexOf(array[i][key]) + 1
        _array[_row][_col] = _value
      }
      retVal = _array
    }
  } catch (e) {
    retVal = array
  }
  return retVal
}
// 把多维转为三维数据
export function reductionArray (array, key, value) {
  //
  let retVal = []
  if (!key) key = 0
  try {
    if (isArray(array)) {
      retVal.push([array[0][key], '分类', '值'])
      for (let i = 0; i < array.length; i++) {
        let row = array[i]
        if (i === 0) continue
        for (let j = 0; j < row.length; j++) {
          let _row = []
          if (j === key) continue
          _row.push(row[key])
          _row.push(array[0][j])
          _row.push(row[j])
          retVal.push(_row)
        }
      }
    }
  } catch (e) {
    retVal = array
  }
  return retVal
}
// 对象深拷贝
export const deepClone = function (o) {
  let retVal
  if (o && typeof o === 'object') {
    retVal = isArray(o) ? [] : {}
    for (let key in o) {
      let _key = o[key]
      if (typeof _key === 'object') {
        retVal[key] = deepClone(_key)
      } else {
        retVal[key] = _key
      }
    }
  } else {
    retVal = o
  }
  return retVal
}

export const addClass = function (domElement, className) {
  let c, classAttr, classNames
  if (domElement.classList) {
    domElement.classList.add(className)
    return
  }
  classAttr = domElement.getAttribute('class')
  if (classAttr) {
    classNames = (function () {
      let _i, _len, _ref, _results
      _ref = classAttr.split(' ')
      _results = []
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i]
        _results.push(c)
      }
      return _results
    })()
    if (classNames.indexOf(className) === -1) {
      return domElement.setAttribute('class', '' + classAttr + ' ' + className)
    }
  } else {
    return domElement.setAttribute('class', className)
  }
}

export const removeClass = function (domElement, className) {
  let c, classAttr, classNameIndex, classNames
  if (domElement.classList) {
    domElement.classList.remove(className)
    if (domElement.classList.length === 0) {
      domElement.removeAttribute('class')
    }
    return
  }
  classAttr = domElement.getAttribute('class')
  if (classAttr) {
    classNames = (function () {
      var _i, _len, _ref, _results
      _ref = classAttr.split(' ')
      _results = []
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i]
        _results.push(c)
      }
      return _results
    })()
    classNameIndex = classNames.indexOf(className)
    if (classNameIndex > -1) {
      classNames.splice(classNameIndex, 1)
      if (classNames.length) {
        return domElement.setAttribute('class', classNames.join(' '))
      } else {
        return domElement.removeAttribute('class')
      }
    }
  }
}
export const hasClass = function (domElement, className) {
  let c, classAttr, classNameIndex, classNames
  if (domElement.classList) {
    return false
  }
  classAttr = domElement.getAttribute('class')
  if (classAttr) {
    classNames = (function () {
      var _i, _len, _ref, _results
      _ref = classAttr.split(' ')
      _results = []
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i]
        _results.push(c)
      }
      return _results
    })()
    classNameIndex = classNames.indexOf(className)
    if (classNameIndex > -1) {
      return true
    } else {
      return false
    }
  }
}

export const isNull = function (value) {
  return value === undefined || value === null
}

export const isFunction = function (fun) {
  return typeof fun === 'function'
}
export const isObject = function (o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}
export const isPlainObject = function (obj) {
  if (obj && Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object && !hasOwnProperty.call(obj, 'constructor')) {
    let key
    for (key in obj) {}
    return key === undefined || hasOwnProperty.call(obj, key)
  }
  return false
}

export const copy = function (data) {
  let copyOne = null
  if (isObject(data)) {
    copyOne = {}
    for (const key in data) {
      copyOne[key] = copy(data[key])
    }
  } else if (isArray(data)) {
    copyOne = []
    for (const index of data) {
      copyOne.push(copy(index))
    }
  } else {
    copyOne = data
  }
  return copyOne
}

export const merge = function () {
  let options, name, src, copy, copyIsArray, clone
  let target = arguments[0] || {}
  let i = 1
  let length = arguments.length
  let deep = false
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {}
    i = 2
  }
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }
  if (length === i) {
    target = this
    --i
  }
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name]
        copy = options[name]
        if (src === copy) {
          continue
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[name] = merge(deep, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}

export const toObject = function (list, idName = 'id', hasNum = false) {
  const listO = {}
  for (var i = 0; i < list.length; i++) {
    const n = list[i]
    if (isObject(n)) {
      if (idName === 'count') {
        listO[i] = n
      } else {
        listO[n[idName]] = n
        if (hasNum) {
          listO[n[idName]].count = i
        }
      }
    } else {
      listO[n] = n
    }
  }
  return listO
}

export const numList = function (start, end, step) {
  let data = []
  for (let i = start; i < end; i = i + step) {
    data.push(i)
  }
  return data
}

export const isString = function (v) {
  return v instanceof String || Object.prototype.toString.call(v) === '[object String]'
}
export const padLeft = function (str, size) {
  var s = '00000' + str
  return s.substr(s.length - size)
}

export const parseJson = function (content) {
  let retVal = []
  try {
    retVal = JSON.parse(content)
  } catch (e) {
    console.log(e)
  }
  return retVal
}

export const thousandFomart = function (num) {
  num += ''
  if (!num.includes('.')) num += '.'
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ','
  }).replace(/\.$/, '')
}

export const generateTree = function (data, param) {
  if (!isArray(data)) {
    return null
  }
  let result = []
  let dataObj = toObject(data, param.keyName)
  for (let d of data) {
    let parentCode = d[param.parentName]
    let hasParent = false
    if (!isNull(parentCode)) {
      let parentCodes = [parentCode]
      if (isArray(parentCode)) {
        parentCodes = parentCode
      }
      for (let code of parentCodes) {
        if (!isNull(dataObj[code])) {
          hasParent = true
          let parent = dataObj[code]
          if (!isArray(parent[param.childrenName])) {
            parent[param.childrenName] = []
          }
          parent[param.childrenName].push(d)
        }
      }
    }
    if (isNull(parentCode) || !hasParent) {
      result.push(d)
    }
  }
  return result
}

export const formatPoint = function (json) {
  return json.replace('(', '').replace(')', '').split(',')
}
