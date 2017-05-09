export function getTypeList (data) {
  let result = []
  for (let i = 0; i < data.length; i++) {
    let submenu = []
    if (!data[i].father) {
      for (let j = 0; j < data[i].son.length; j++) {
        let temp = data.find(function(ele){
          return ele.father === data[i].name && ele.name === data[i].son[j]
        })
        if (temp) {
          submenu.push({
            key: temp._id,
            name: temp.name
          })
        }
      }
      result.push({
        key: data[i]._id,
        name: data[i].name,
        submenu: submenu
      })
    }
  }
  return result
}

export function loadJSONP(url) {
  const timeout = 5000
  let timer
  return new Promise((resolve, reject) => {
    window.jsonpfn = function (res) {
      clearTimeout(timer)
      resolve(res)
      removeScript()
    }

    let script = document.createElement("script")
    script.id = 'jsonp'
    script.src = url + "?callback=jsonpfn"
    document.head.appendChild(script)

    timer = setTimeout(() => {
      reject('timeout')
      document.head.removeChild(script)
    }, timeout)
  });
}

function removeScript () {
  let script = document.getElementById('jsonp')
  document.head.removeChild(script)
}
