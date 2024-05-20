import './osseus/CSS/_config.css'
import './osseus/CSS/_custom.css'
import './osseus/CSS/color.css'
import './osseus/CSS/reset.css'
import './osseus/CSS/structure.css'
import './osseus/CSS/typography.css'
import './osseus/CSS/utility.css'

import { globalEventHandler } from './osseus/JS/handlers'
import { singleStateToggle } from './osseus/JS/state'
import { Cleanse, Cart } from './shop'

let signature = new Cleanse('signature', { 2: 200, 3: 300, 4: 400, 5: 500 })
let cart = new Cart(signature)
console.log(cart)

globalEventHandler('click', '._faq_origin', singleStateToggle)
globalEventHandler('click', '._cart_origin', singleStateToggle)
globalEventHandler('click', '._days_add', cart.productDaysIncrement)
