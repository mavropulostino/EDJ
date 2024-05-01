import './osseus/CSS/_config.css'
import './osseus/CSS/_custom.css'
import './osseus/CSS/color.css'
import './osseus/CSS/reset.css'
import './osseus/CSS/structure.css'
import './osseus/CSS/typography.css'
import './osseus/CSS/utility.css'

import { globalEventHandler } from './osseus/JS/handlers'
import { singleStateToggle } from './osseus/JS/state'

globalEventHandler('click', '._faq_origin', singleStateToggle)
