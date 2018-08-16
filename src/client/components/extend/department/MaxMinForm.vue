<!--部门功能区扩展组件:人数设置 的 表单组件-->
<template>
   <section>
        <el-form  :model="addForm"  ref="maxminform" label-width="150px" :validate-on-rule-change="false" >

            <section >
              <el-form-item required prop="config.min" label="最少人数" key="min">         
                   <el-input v-model="addForm.config.min" ></el-input>              
               </el-form-item>
               <el-form-item required prop="config.max" label="最大人数" key="max">                        
                  <el-input v-model="addForm.config.max" ></el-input>            
               </el-form-item>                        
            </section>
        </el-form>

            <div slot="footer" class="dialog-footer">
                 <el-button  v-on:click="cancel">取消</el-button>
                  <el-button type="primary" @click.native="submit" >提交</el-button>
            </div>     
    </section>         
</template>

<script>    
    import Vue from "vue";        

    export default {
        props: ['init', 'api','value']  ,      
        data() {
            return {                                                      
                addForm:{                        
                        config:{min:'',max:''}
                    }               
            }
        },
        created: async function () {                     
            this.$emit('created');            
        },
        methods: {                      
            cancel:function() {
               this.$refs.maxminform.resetFields()
                this.$emit('cancel');
            },
            submit:function(){
              this.$refs.maxminform.validate((valid) => {
                if (valid) {                                                              
                  this.$emit('submit',this.addForm);
                } else {                  
                  return false;
                }
              });
                
            },             
            setFormData:function(row){               
               this.$refs.maxminform.resetFields()
               this.addForm._id=row._id
               if(row.config) {                       
                this.addForm.config.min=row.config.min       
                this.addForm.config.max=row.config.max               
               }                                                                  
            }
        },
        mounted() {            
            this.$emit('created')
        }
    }
</script>
