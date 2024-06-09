import './OSS-temp/CSS/_config.css'
import './OSS-temp/CSS/_custom.css'
import './OSS-temp/CSS/color.css'
import './OSS-temp/CSS/reset.css'
import './OSS-temp/CSS/structure.css'
import './OSS-temp/CSS/typography.css'
import './OSS-temp/CSS/utility.css'

import { globalEventHandler } from './osseus/JS/handlers'
import { singleStateToggle } from './osseus/JS/state'

globalEventHandler('click', '._faq_origin', singleStateToggle)
