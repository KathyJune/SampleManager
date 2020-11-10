import Pop from 'src/plugins/pop'
import * as utils from 'src/utils/factory'

const Default = {
  trigger: 'click',
  closeOnClickBody: true,
  html: true,
  placement: 'bottom-start',
  template: `<div role="select" class="dropdown"><div class="dropdown-inner"></div></div>`,
  innerSelector: '.dropdown-inner',
  preventOverflow: true,
  type: 'dropdown',
  delay: 300
}

class Dropdown extends Pop {
  constructor (el, param) {
    param = utils.merge({}, Default, {
    }, param)
    let container = document.body
    if (!param.container) {
      container = el || document.body
      while (container && container.tagName !== 'BODY' && !utils.hasClass(container, 'dropdown-common-container')) {
        container = container.parentNode
      }
      param.container = container
    }
    super(el, param)
  }
}

export default Dropdown
