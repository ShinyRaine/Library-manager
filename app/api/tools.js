export function getSideList (data) {
  return getList({
    key: 'key',
    name: 'name',
    sublist: 'submenu'
  }, data)
}
export function getFormList (data) {
  return getList({
    key: 'label',
    name: 'value',
    sublist: 'children'
  }, data)
}
function getList (names, data) {
  let result = []
  for (let i = 0; i < data.length; i++) {
    let submenu = []
    if (!data[i].father) {
      for (let j = 0; j < data[i].son.length; j++) {
        let temp = data.find(function(ele){
          return ele.father === data[i].name && ele.name === data[i].son[j]
        })
        console.log(temp);
        if (temp) {
          submenu.push({
            [names.key]: temp.name,
            [names.name]: temp.name
          })
        }
      }
      result.push({
        [names.key]: data[i].name,
        [names.name]: data[i].name,
        [names.sublist]: submenu
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
