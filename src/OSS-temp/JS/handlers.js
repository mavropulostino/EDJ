function globalEventHandler(type, origin, callback = null) {
  if (!document.querySelector(origin)) {
    console.warn(origin + ' not found')
    return
  }
  if (typeof callback !== 'function' && callback !== null) {
    console.warn(callback + ' not function')
    return
  }

  document.addEventListener(type, (e) => {
    if (!e.target.closest(origin)) return

    const originElement = e.target.closest(origin)
    const targetSelector = originElement.dataset.target || origin
    const targetElement = document.querySelector(targetSelector)

    const dataObj = {}

    dataObj.origin = originElement.dataset
    dataObj.target = targetElement?.dataset // if target has no attributes

    dataObj.origin.selector = origin
    dataObj.target.selector = targetSelector

    callback(dataObj)
  })
}
export { globalEventHandler }
