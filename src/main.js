import './osseus/CSS/_config.css'
import './osseus/CSS/_custom.css'
import './osseus/CSS/color.css'
import './osseus/CSS/reset.css'
import './osseus/CSS/structure.css'
import './osseus/CSS/typography.css'
import './osseus/CSS/utility.css'

import { globalEventHandler } from './osseus/JS/handlers'
import { singleStateToggle } from './osseus/JS/state'
import { Product, Cart } from './shop'

const morningCleanse = new Product('Morning_Cleanse', 600, 0)
const eveningCleanse = new Product('Evening_Cleanse', 900, 0)
const cart = new Cart(morningCleanse, eveningCleanse)
cart.updateDOM()

globalEventHandler('click', '._faq_origin', singleStateToggle)
globalEventHandler('click', '._cart_origin', singleStateToggle)
globalEventHandler('click', '._cart_origin_add', cart.addAmount)
globalEventHandler('click', '._cart_origin_remove', cart.removeAmount)
