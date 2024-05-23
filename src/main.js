import './osseus/CSS/_config.css'
import './osseus/CSS/_custom.css'
import './osseus/CSS/color.css'
import './osseus/CSS/reset.css'
import './osseus/CSS/structure.css'
import './osseus/CSS/typography.css'
import './osseus/CSS/utility.css'

import { globalEventHandler } from './osseus/JS/handlers'
import { singleStateToggle } from './osseus/JS/state'
import { Cart, Product } from './shop'

let two_day_signature = new Product('Two_Day_Signature', 2000)
let three_day_signature = new Product('Three_Day_Signature', 2850)
let four_day_signature = new Product('Four_Day_Signature', 3600)
///
let two_day_immuno = new Product('Two_Day_Immuno', 1900)
let three_day_immuno = new Product('Three_Day_Immuno', 2700)
let four_day_immuno = new Product('Four_Day_Immuno', 3400)

let cart = new Cart(
  two_day_signature,
  three_day_signature,
  four_day_signature,
  //
  two_day_immuno,
  three_day_immuno,
  four_day_immuno
)

globalEventHandler('click', '._faq_origin', singleStateToggle)
globalEventHandler('click', '._cart_origin', singleStateToggle)
globalEventHandler('click', '._add_amount', cart.addAmount)
globalEventHandler('click', '._remove_amount', cart.removeAmount)
globalEventHandler('click', '#submit', cart.processPayment)

console.log(cart.products)

let data = {
  deliveryInfo: {
    nameForValue: 'value',
    nameForValue: 'value',
    nameForValue: 'value',
  },
  products: {
    Product: {
      name: 'value',
      price: 'value',
      amount: 'value',
    },
    Product: {
      name: 'value',
      price: 'value',
      amount: 'value',
    },
  },
}

