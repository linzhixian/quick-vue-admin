<!--
 部门功能区扩展组件:人数设置
-->
<template>
      <div class="el-form-item">
        <!--工具条-->                                                 
                <el-button   type="success" size="medium" @click="handlerButton('editMaxMin')" >人数限制</el-button>                                                                       
            <!--编辑--> 
        <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false"  v-on:open="onDialogLoaded">           
           <component  :is="currentEditForm" v-model="value" :api="api" ref="editform"  v-on:cancel="showDialog=false" v-on:submit="formSubmit" v-on:created="onDialogLoaded"></component>
        </el-dialog>
     </div>
</template>

<script>

import MaxMinForm from './MaxMinForm.vue';  


export default {
    props: ['value','api'],
    components: {    
      'edit-form': MaxMinForm           
    },
    data() {
        return {                 
            currentEditForm:'edit-form',            
            showDialog:false,              
            dialogTitle:'',            
            actionsMap:{
              editMaxMin:{label:'人数设置',component:'edit-form',handlerButtonName:'editInitSdkRadio'},          
              }
        }
    },    
    methods: {
     checkSelectRow() {
            if(!this.value) {
                 this.$message.error('请先选中一行');
                 return false
            }
            return true
        },
      handlerButton(actionName){
          if(!this.checkSelectRow()) return      
          this.dialogTitle=this.actionsMap[actionName].label;
          this.currentEditForm=this.actionsMap[actionName].component;
          this.showDialog=true;                         
        },
      formSubmit:function(formData) {
              this.$emit('submit',formData,{forEdit:true,reload:true,cb:()=>{
                     this.showDialog=false;                 
              }});
        },
        onDialogLoaded:function(){   
          if(this.$refs.editform) {
            this.$refs.editform.setFormData(this.value); 
          }
        }

    }
}
</script>

