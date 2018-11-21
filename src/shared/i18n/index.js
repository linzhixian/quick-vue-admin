/*import locale from 'element-ui/lib/locale/lang/en'

function detectLocale() {
 var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();
 if(JsSrc.indexOf('zh')>=0) return 'en'
 return 'en'
}


exports.load = function(Vue,ElementUI) {
	Vue.i18n.add("en",require("./en.json"))
	Vue.i18n.add("zh",require("./zh.json"))
	let lang=detectLocale()
	Vue.i18n.set(lang)
	if(Vue.i18n.locale()=='en') {    
      Vue.use(ElementUI,{ locale });
    } else {
      Vue.use(ElementUI); 
    }
zzzz
    Vue.config.lang = 'zh-cn'
Vue.locale('zh-cn', zhLocale)
Vue.locale('en', enLocale)
}
*/

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

module.exports={
	zh:{...require("./zh.json"),
	     ...zhLocale
       },
	en:{...require("./en.json"),
	    ...enLocale
       }
}