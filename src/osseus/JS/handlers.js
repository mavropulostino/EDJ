function globalEventHandler(type, origin, callback = null) {
  const bodyElement = document.body
  const originElementAll = document.querySelectorAll(origin)

  if (!originElementAll.length) {
    console.warn(origin + ' not found')
    return
  }
  if (typeof callback !== 'function' && callback !== null) {
    console.warn(callback + ' not function')
    return
  }

  bodyElement.addEventListener(type, (e) => {
    const originElement = e.target
    if (!originElement.matches(origin)) return

    originElement.dataset.target ||= origin
    const targetElement = originElement.closest(originElement.dataset.target)

    let dataObj = {}
    dataObj.origin = originElement.dataset
    dataObj.target = targetElement.dataset

    callback(dataObj)
  })
}
export { globalEventHandler }
