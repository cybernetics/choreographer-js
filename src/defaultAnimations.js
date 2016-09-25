const getInjectedTransformString = require('./getInjectedTransformString')

/** @method scale
  * [built-in animation function]
  * Based on the data provided, your node will receive an updated, scaled style value.
  *
  * @param {Object} data : {
  *          {Node} node       | the node you want to modify
  *          {String} style    | the style property you want to modify
  *          {Number} from     | minimum value
  *          {Number} to       | maximum value
  *          {Number} progress | a value between 0 and 1; the proportion of value we should use
  *          {String} unit     | optional - unit value, e.g. 'px' or '%'
  *        }
 **/
const scale = (data) => {
  if (data.progress > 0 && data.progress < 1) {
    data.node.setAttribute('animated', data.node.getAttribute('animated') + ',' + data.style)
  }

  // Get the relative value (proportional to the min-max range you gave.)
  const scaledValue = ((data.to - data.from) * data.progress) + data.from
  // Stick on the unit, if there is one.
  const scaledValueString = data.unit ? scaledValue + data.unit : scaledValue

  // If it's a regular old style property, just replace the value. No fuss.
  if (data.style.split(':').length === 1) {
    data.node.style[data.style] = scaledValueString
    return
  }

  /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
  const transformProp = data.style.split(':')[1]
  data.node.style.transform = getInjectedTransformString(data.node, transformProp, scaledValueString)
}

/** @method change
  * [built-in animation function]
  * Based on the data provided, your node will have the style value assigned or remok
  * @param {Object} data : {
  *          {Node} node       | the node you want to modify
  *          {String} style    | the style property you want to modify
  *          {Number} to       | the style value
  *          {Number} progress | a value between 0 and 1; the proportion of value we should use
  *        }
 **/
const change = (data) => {
  if (data.progress >= 0) data.node.setAttribute('animated', data.node.getAttribute('animated') + ',' + data.style)
  const newValue = data.progress < 0 ? null : data.to
  const newValueString = newValue && data.unit ? newValue + data.unit : newValue

  // If the progress is less than 0, we just need to nullify this style value.
  if (data.progress < 0 && data.style === 'transition') {
    data.node.addEventListener('transitionend', (e) => {
      if (e.target === data.node) data.node.style[data.style] = null
    })
    return
  }

  // If it's a regular old style property, just replace the value. No fuss.
  if (data.style.split(':').length === 1) {
    data.node.style[data.style] = newValueString
    return
  }

  /*~~ If the style is a CSS transform, we gotta do some funky shit. ~~*/
  const transformProp = data.style.split(':')[1]
  data.node.style.transform = getInjectedTransformString(data.node, transformProp, newValueString)
}

module.exports = { scale, change }
