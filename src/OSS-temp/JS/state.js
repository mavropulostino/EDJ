function multiStateToggle(dataObj) {
  const states = new Set((dataObj.origin.states || '').split(' '))

  states.has(dataObj.target.state)
    ? states.delete(dataObj.target.state)
    : states.add(dataObj.target.state)

  const targetAll = document.querySelectorAll(dataObj.origin.target)
  targetAll.forEach((target) => {
    target.dataset.states = [...states].join(' ')
  })
}
export { multiStateToggle }

function singleStateToggle(dataObj) {
  const stateElement = document.querySelectorAll(dataObj.origin.sst)
  const targetAll = document.querySelectorAll(dataObj.target.selector)

  targetAll.forEach((target) => {
    target.dataset.state ||= 'inactive'
  })

  stateElement.forEach((element) => {
    if (element.dataset.state === 'inactive') element.dataset.state = 'active'
    else element.dataset.state = 'inactive'
  })
}

export { singleStateToggle }
