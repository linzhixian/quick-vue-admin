/**
 功能区扩展按钮组件声明
*/
import department_buttons from './department/index.vue';


/**
  组件列表:组件名:组件对象
  组件名是在通用元配置文件里的extendActionButtons定义
*/
let components = {
  "department_buttons": department_buttons,
};

export default components;