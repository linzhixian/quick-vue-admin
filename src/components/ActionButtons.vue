<!--核心组件：封装了增删改查翻页-->
<template>
     <section>
        <!--工具条-->   
        <el-row>    
         <el-col :span="3"> 
             <el-form :inline="true" >
                <el-form-item v-if="showAdd">
                    <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
                </el-form-item>                                
            </el-form>
            </el-col>
            <el-col :span="21">
              <component v-if="extendActionButtons" :is="extendActionButtons" v-model="currentRow" :api="api" ref="extendform"  v-on:submit="formSubmit" v-on:extendAction="handerExtendAction"/>  
              </el-col>
        </el-row>
            <!--新增和编辑界面-->
        <el-dialog :title="dialogTitle"  :visible.sync="addFormVisible" :close-on-click-modal="false" :before-close="handleClose" v-on:open="onDialogLoaded">
           <!-- <edit-form ></edit-form> -->
            <component :is="currentEditForm" :columnsDef="value.columnsDef" :api="api" ref="editform"  v-on:cancel="addFormVisible=false"  v-on:submit="formSubmit" v-on:created="onDialogLoaded"></component>
        </el-dialog>


   </section>
</template>

<script>
import AddOrEditForm from './AddOrEditForm.vue'; 
import customComponents from './customedit'; //导入定制编辑组件列表
import { Loading } from 'element-ui';
import { Notification } from 'element-ui';


export default {
      props: ['value','api','currentRow'],
      components: {    
      'edit-form': AddOrEditForm,      
      ...customComponents
    },
    data() {
        return {
            currentEditForm:'edit-form',
            dialogTitle:'',
            addFormVisible:false,
            dialogSubmitCall: '',
            ajaxAdd: this.api.callAdd,
            ajaxEdit: this.api.callEdit,
            showAdd:this.getShowValue(this.value.showAdd),
            extendActionButtons:this.value.extendActionButtons,
            dialogType:''          
            
        }
    },
    created: function() {
        console.log('ab oncreated:'+this.extendActionButtons);
    },
    
    methods: {
       add: function() {
             this.$emit('action','add');  
        },
        getShowValue(v){
            if(typeof(v) == "undefined") {
                return true;
            } else return v;
        },
       handleClose(done) {
            done();
      },
      fromParent(actionName,data){
        if(actionName=='edit') {
            this.handleEdit(data);
        }
      },
      handerExtendAction(actonName,data) {
        this.$emit('action',actonName,data); 
      },
      onDialogLoaded() {
        if(this.dialogType==='add') {
          console.log("----mounted.add")
          this.onAddOpen()
        } else if(this.dialogType==='edit'){
           console.log("----mounted.edit")
          this.onEditOpen()
        }
      },
      onAddOpen() {
        if(this.$refs.editform&& this.$refs.editform.forAdd) {
          this.$refs.editform.forAdd(); 
        }
        if (this.value.methods && this.value.methods.onShowAdd) {                
            this.value.methods.onShowAdd(this.addForm, this);
        }
      },
      onEditOpen() {  
          if(this.$refs.editform)  {    
           this.$refs.editform.forEdit();  
          }
          this.$refs.editform.setFormData(this.currentRow);                     
          if (this.value.methods && this.value.methods.onShowEdit) {                                        
            this.value.methods.onShowEdit(this.addForm, this);
                    
          }
      },
     callEdit(params) { return this.ajaxEdit(params, this.value.path); },
     callAdd(params) { return this.ajaxAdd(params, this.value.path); },
       //显示新增界面
      handleAdd: function() {
            console.log("---handleAdd-----------");
            this.dialogTitle = '新增';
            this.dialogSubmitCall = this.callAdd;
            this.addFormVisible = true;
            this.dialogType='add'  
        },
        //显示编辑界面
        handleEdit: function(row) {
            if (this.value.showEdit) {
                this.currentRow=row                 
                this.dialogTitle = '编辑';
                this.addFormVisible = true;
                 this.dialogType='edit'                        
                this.dialogSubmitCall = this.callEdit;  
            }
        },

        formSubmit:function(formData,{forEdit=false,reload=false,cb}) {
             if (this.value.methods && this.value.methods.submitCheck) {
                      formData = this.value.methods.submitCheck(formData, this);
             }
            let loadingInstance = Loading.service({lock: false,text: '提交...',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.7)'});
             console.log("forSubmit:------------------");
            console.log("forSubmit:"+reload);
             //设置提交动作默认值，默认是修改
            if(!this.dialogSubmitCall) this.dialogSubmitCall=this.callEdit;
            if(forEdit) {
              this.dialogSubmitCall=this.callEdit;
            }
            this.dialogSubmitCall(formData).then((res) => {
                            this.addLoading = false;
                            loadingInstance.close();         
                            if (res.data.status.code == "0") {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                if(this.$refs.editform) {
                                 this.$refs.editform.clearFormData();                                    
                                }
                                this.addFormVisible = false;
                                console.log("forSubmit:"+reload);
                                if(typeof reload =='undefined' || reload!=false) {
                                 this.$emit('action','reload');   
                                }
                                if(cb) cb();
                            } else {                             
                              //Notification
                                if(res.data.status.msg.length<50) {
                                 this.$message({
                                    message: '提交失败：' + res.data.status.msg,
                                    type: 'error',
                                    showClose: true,
                                    duration:0
                                 });
                              } else {                                         
                                this.$notify({type:'error',duration:30000, dangerouslyUseHTMLString:true,showClose:true,message:res.data.status.msg})
                              }
                            }

                        });
        }       
    },
    mounted() {
        
    }
}
</script>
