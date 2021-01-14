/**
 * Created by Kathy
 * @Date 1/12/21
 * @description
 */
export const isArray = (arr) => {
  return Array.isArray(arr)
}
export const isNull = function (value) {
  return value === undefined || value === null
}
export const isObject = function (o) {
  return Object.prototype.toString.call(o) === '[object Object]'
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
export const generateList = (data, param) => {
  if (!isArray(data)) {
    return null
  }
  let result = []
  const getNode = function (node, parent) {
    if (isNull(node)) return
    if (isNull(node.children) || (isArray(node.children) && node.children.length === 0)) {
      let _node = {}
      _node[param.keyName] = node[param.keyName]
      _node[param.parentName] = node[param.parentName] || parent
      _node[param.label] = node[param.label]
      console.log(_node, node)
      result.push(_node)
    } else {
      let _node = {}
      _node[param.keyName] = node[param.keyName]
      _node[param.parentName] = node[param.parentName] || parent
      _node[param.label] = node[param.label]
      console.log(_node, node)
      result.push(_node)
      let _child = node.children
      for (let o of _child) {
        getNode(o, node[param.keyName])
      }
    }
  }
  try {
    for (let o of data) {
      getNode(o, 0)
    }
  } catch (e) {
    // console.log(e)
  }
  return result
}

export const generateTree = function (data, param) {
  if (!isArray(data)) {
    return null
  }
  let result = []
  let cloneData = data.slice(0)
  try {
    let dataObj = toObject(cloneData, param.keyName)
    for (let i = 0; i < cloneData.length; i++) {
      let d = cloneData[i]
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
  } catch (e) {
    console.log(e)
  }
  return result
}
