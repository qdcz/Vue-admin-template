// 生成token
const create_token = function(leng) {
  leng = leng == undefined ? 32 : leng	// 如果没设置token长度自动为32位
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
  let token = ''
  for (let i = 0; i < leng; ++i) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token	// /返回之前使用md5加密一下
}
// 生成时间
const create_time = function(obj, type) {
  const D = {}
  var type = type || 'YYYYMMMDD'
  var sign = sign || '-'
  Object.defineProperties(D, {
    'year': {
      value: null,
      writable: true
    },
    'month': {
      value: null,
      writable: true
    },
    'date': {
      value: null,
      writable: true
    },
    'hour': {
      value: null,
      writable: true
    },
    'minute': {
      value: null,
      writable: true
    },
    'second': {
      value: null,
      writable: true
    }
  })
  D['year'] = obj.getFullYear()
  D['month'] = (obj.getMonth() + 1) >= 10 ? (obj.getMonth() + 1) : '0' + (obj.getMonth() + 1)
  D['date'] = obj.getDate() >= 10 ? obj.getDate() : '0' + obj.getDate()
  D['hour'] = obj.getHours() >= 10 ? obj.getHours() : '0' + obj.getHours()
  D['minute'] = obj.getMinutes() >= 10 ? obj.getMinutes() : '0' + obj.getMinutes()
  D['second'] = obj.getSeconds() >= 10 ? obj.getSeconds() : '0' + obj.getSeconds()
  if (type == 'YYYYMMMDD') {
    return '' + D.year + sign + D.month + sign + D.date
  }
  if (type == 'HHMMSS') {
    return '' + D.hour + ':' + D.minute + ':' + D.second
  }
  if (type == 'YYYYMMMDDHHMMSS') {
    return '' + D.year + sign + D.month + sign + D.date + ' ' + D.hour + ':' + D.minute + ':' + D.second
  }
}

const formatDate = function(obj, type) {
  const D = {}
  var type = type || 'YYYYMMMDDHHMMSS'
  var sign = sign || '-'
  Object.defineProperties(D, {
    'year': {
      value: null,
      writable: true
    },
    'month': {
      value: null,
      writable: true
    },
    'date': {
      value: null,
      writable: true
    },
    'hour': {
      value: null,
      writable: true
    },
    'minute': {
      value: null,
      writable: true
    },
    'second': {
      value: null,
      writable: true
    }
  })
  D['year'] = obj.getFullYear()
  D['month'] = (obj.getMonth() + 1) >= 10 ? (obj.getMonth() + 1) : '0' + (obj.getMonth() + 1)
  D['date'] = obj.getDate() >= 10 ? obj.getDate() : '0' + obj.getDate()
  D['hour'] = obj.getHours() >= 10 ? obj.getHours() : '0' + obj.getHours()
  D['minute'] = obj.getMinutes() >= 10 ? obj.getMinutes() : '0' + obj.getMinutes()
  D['second'] = obj.getSeconds() >= 10 ? obj.getSeconds() : '0' + obj.getSeconds()
  if (type == 'YYYYMMMDD') {
    return '' + D.year + sign + D.month + sign + D.date
  }
  if (type == 'HHMMSS') {
    return '' + D.hour + ':' + D.minute + ':' + D.second
  }
  if (type == 'YYYYMMMDDHHMMSS') {
    return '' + D.year + sign + D.month + sign + D.date + ' ' + D.hour + ':' + D.minute + ':' + D.second
  }
}
// ȡ�ļ���׺��
const getFileType = (str) => str.match(/[^\.]\w*$/)[0]

// 计算是包含某字符
const HasIncludeChar = (str, charS) => str.indexOf(charS)

// 计算文件大小
const comFileSize = (value) => {
  if (value == null || value == '') {
    return '0 Bytes'
  }
  var unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  //  保留的小数位数
  size = size.toFixed(2)
  return size + unitArr[index]
}

export default {
  create_token,
  create_time,
  formatDate,
  getFileType,
  HasIncludeChar,
  comFileSize
}
