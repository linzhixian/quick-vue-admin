</script>
<template>
    <section id="editContainer">
        <!--新增和编辑界面-->        
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" :validate-on-rule-change="false" > 
                <el-form-item v-for="(oneItem,index) in editColumns" :prop="oneItem" :label="editColumnDefs[oneItem].label" :key="oneItem">
                  
                    <el-input v-if="!editColumnDefs[oneItem].input.type || (editColumnDefs[oneItem].input.type==='text' || editColumnDefs[oneItem].input.type==='textarea')" v-model="addForm[oneItem]" :type="editColumnDefs[oneItem].input.type"></el-input>
                    <el-radio-group v-else-if="editColumnDefs[oneItem].input.type === 'radioGroup'" v-model="addForm[oneItem]">
                        <el-radio-button class="radio" v-for="one in editColumnDefs[oneItem].input.options" :label="one.value" :name="oneItem" :key="one.prop">
                            {{one.label}}
                        </el-radio-button>
                    </el-radio-group>
                    <el-checkbox v-else-if="editColumnDefs[oneItem].input.type==='checkbox'" v-model="addForm[oneItem]"></el-checkbox>
                      
                    <el-select v-else-if="editColumnDefs[oneItem].input.type==='select'" v-model="addForm[oneItem]" 
                     :filterable="editColumnDefs[oneItem].input.filterable" 
                     :allow-create="editColumnDefs[oneItem].input.allowCreate"
                     :clearable="editColumnDefs[oneItem].input.clearable"
                     :multiple="editColumnDefs[oneItem].input.multiple"
                      :placeholder="editColumnDefs[oneItem].input.placeholder"
                    >
                        <el-option v-for="one in editColumnDefs[oneItem].input.options" :label="one.label" :key="one.label" :value="one.value">
                        </el-option>
                    </el-select>  
                    <el-checkbox-group v-else-if="editColumnDefs[oneItem].input.type==='checkboxGroup'" v-model="addForm[oneItem]" >
                        <el-checkbox v-for="one in editColumnDefs[oneItem].input.options" :label="one.label" :key="one.value" :name="oneItem" :disabled="editColumnDefs[oneItem].input.disabled?editColumnDefs[oneItem].input.disabled[one.label]:false"
                        
                        >

                        </el-checkbox>
                    </el-checkbox-group>  

                  <el-cascader v-if="editColumnDefs[oneItem].input.type==='cascader'" v-model="addForm[oneItem]"  :options="editColumnDefs[oneItem].input.options" :props="editColumnDefs[oneItem].input.props"  :placeholder="editColumnDefs[oneItem].input.placeholder" clearable filterable :change-on-select="editColumnDefs[oneItem].input.changeOnSelect"/> 

                    <input  :id="oneItem" v-else-if="editColumnDefs[oneItem].input.type==='file'"   @change="getFile($event,oneItem)"  type="file" />
                    <el-tree v-else-if="editColumnDefs[oneItem].input.type==='tree'" v-model="addForm[oneItem]" :data="editColumnDefs[oneItem].input.data" :props="editColumnDefs[oneItem].input.props" :ref="oneItem" node-key="label" show-checkbox>
                    </el-tree>

                    <el-date-picker v-if="editColumnDefs[oneItem].input.type==='date'"
                     v-model="addForm[oneItem]"
                     :type="editColumnDefs[oneItem].input.subType"
                     :placeholder="editColumnDefs[oneItem].input.placeholder"
                     :picker-options="editColumnDefs[oneItem].input.pickerOptions"
                     :range-separator="editColumnDefs[oneItem].input.rangeSeparator"
                     :start-placeholder="editColumnDefs[oneItem].input.startPlaceholder"
                     :end-placeholder="editColumnDefs[oneItem].input.endPlaceholder"

                     :format="editColumnDefs[oneItem].input.format"
                     
                     :unlink-panels="editColumnDefs[oneItem].input.unlinkPanels"
                     :value-format="editColumnDefs[oneItem].input.valueFormat"
                     :default-value="editColumnDefs[oneItem].input.defaultValue"
                    >
                  </el-date-picker>
                 
                 <el-time-picker v-if="editColumnDefs[oneItem].input.type==='time'"
                    :is-range="editColumnDefs[oneItem].input.isRange"
                    v-model="addForm[oneItem]"
                    :placeholder="editColumnDefs[oneItem].input.placeholder"                    
                    :range-separator="editColumnDefs[oneItem].input.rangeSeparator"
                     :start-placeholder="editColumnDefs[oneItem].input.startPlaceholder"
                     :end-placeholder="editColumnDefs[oneItem].input.endPlaceholder"     
                     :picker-options="editColumnDefs[oneItem].input.pickerOptions"               
                    :value-format="editColumnDefs[oneItem].input.valueFormat"
                    :default-value="editColumnDefs[oneItem].input.defaultValue"
                    >
                  </el-time-picker>                                            
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  v-on:click="cancel">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" >提交</el-button>
            </div>        
    </section>
</template>

<script>
import * as PageUtil from './PageUtil';
import * as  pathUtil  from 'path';

import Vue from "vue";

 export default {
    props: ['columnsDef','api'],
     
    data() {
      return {
         editColumns:[],    
         editColumnDefs:{},
         addFormRules: {},
         addForm: {},
         hasFileInput:false,
         PageUtil:PageUtil
      };
    },
     mounted() {
       console.log("----mounted")
       this.$emit('created');
     },
     created() {

     },
    methods: {
      onSelectChange(change) {
        console.log("onSelectChange-");
        console.log(change);
      },
      loadEditColumn(isEdit){
          let p=this;
           this.convertFormRule(this.columnsDef,isEdit).then(function(){})
      },
      forAdd() {
         console.log("----forAdd")
         this.addForm={}
        this.loadEditColumn(false);        
        this.clearFormData();
      },
      forEdit(){
         console.log("----forEdit")
       this.loadEditColumn(true);
      },
      findColumnDef(prop) {
        for(let one of this.columnsDef) {
           if(one.prop==prop) return one
        }
        return null
      },
      getFile(event,propName) { 
            let name=event.target.files[0].name
            //console.log(event.target.files[0])
            ///console.log("name",name)
            let extname=pathUtil.extname(name)
            //console.log("extname",extname)
            let colDef=this.findColumnDef(propName)
            if(colDef && colDef.input&& colDef.input.ext && "."+colDef.input.ext!=extname) {
              this.$message.error('文件非法，只能是:'+colDef.input.ext+'文件');

              return;
            }
            this.addForm[propName] = event.target.files[0];   
            this.hasFileInput=true;         
      },
      createPromise(input){
        let { path, params, label, value,projects } = input.ajax;
        let theapi=this.api;
        return new Promise(function(resolve, reject) {  
                      theapi.callList({ filter: params,projects }, path).then(function(res) {
                            input.options = PageUtil.toSelectOptions(res.data.data, label, value);
                               resolve(true);
                       });
                         
                });
      },

      convertFormRule: function(columnDefs,isEdit) {
            //console.log("-------------convertFormRule:"+isEdit);
            this.editColumns = [];
            let promises=[];
           // let theAddForm={};//Vue.set(_this.addForm,data[i]._id,{})
            let rules = {};
            for (let elem of columnDefs.values()) {        
                if (elem &&　elem.input) {
                  if(isEdit &&  elem.edit==false) continue;
                  if(!isEdit &&  elem.add==false) continue;
                  if(elem.input.rule) {
                    rules[elem.prop]=[];
                    if(elem.input.rule=='required') {
                      rules[elem.prop].push({ required: true, message: '请输入' + elem.label, trigger: 'blur' });
                    } else {// 
                     // console.log("push rule",elem.input.rule)
                      let valid=(rule,value,cb)=> {
                        elem.input.rule(rule,value,cb,this)
                      }
                      rules[elem.prop].push({ validator: valid, trigger: 'blur' });   
                    }                   
                  }
                  Vue.set(this.editColumnDefs,elem.prop,elem)
                  this.editColumns.push(elem.prop);
                      //console.log("-------------convertFormRule:1:"+JSON.stringify(elem));
                    if (elem.input ) {
                       
                        let defautValue=this.getDefaultValue(elem.input)
                       // console.log("VueSet",elem.prop,defautValue)
                        Vue.set(this.addForm,elem.prop,defautValue)
                         Vue.set(this.editColumnDefs[elem.prop],'input',elem.input)
                         if(typeof this.editColumnDefs[elem.prop].input=='object') {
                          let options=this.editColumnDefs[elem.prop].input.options
                          if(!options) options=[]
                          Vue.set(this.editColumnDefs[elem.prop].input,'options',options) 
                         }  
                        if( elem.input.ajax ) {                                                                                                 
                          promises.push(this.createPromise(elem.input));
                       } else if(typeof elem.input=='string') {
                          elem.input={type:elem.input};
                       } else if(elem.input.inputs) {
                         for(let oi of elem.input.inputs) {
                            if(oi &&　(!oi.options || oi.options.length==0) && oi.ajax) promises.push(this.createPromise(oi));
                         }
                       } 
                        if(elem.input.onChange) {
                          //console.log("set Wath","addFrom."+elem.prop,elem.input.watch)
                         this.$watch("addForm."+elem.prop,(newV,oldV)=>{elem.input.onChange(this,newV,oldV)})
                       }
                    } 
                }

            }
         // this.addForm=theAddForm;
          //console.log("----addForm:"+JSON.stringify(this.addForm));

          this.addFormRules=rules;
           //console.log("----addFormRules:",this.addFormRules,rules);
          if(isEdit) this.addForm._id='';
          return new Promise(function(resolve, reject) {  
            if(promises.length>0) {
              Promise.all(promises).then(function (posts) {
                  resolve(1);
              });
            } else 
              resolve(1);
          });
        },        
        setFormData:function(row) {
             //this.addForm = Object.assign({}, row);          
             //console.log(row);
             for(let one of Object.keys(this.addForm)) {              
                if(typeof(row[one] )!="undefined") {
                  this.addForm[one]=row[one];                  
                }
             }
             this.hasFileInput=false;
             this.clearOtherInput()
             this.setTreeInput(row)
             console.log("setFormData",this.addForm)
        },
        clearFormData() {
            console.log("---clearFormData:");
            this.$refs.addForm.resetFields();
            //this.addForm._id='';
            this.hasFileInput=false;
            this.clearOtherInput()
            this.setTreeInput(null)
            console.log("--clearFormData",this.addForm)
        },
        clearOtherInput(){
            for(let one of this.columnsDef) {
              if(one.input && one.input.type=='file') {
                  var obj = document.getElementById(one.prop) ; 
                 if(obj) {
                    console.log("setFile",one.prop)
                    obj.value = ''                    
                  }
              }
            }
        },
        setTreeInput(row) {
            for(let one of this.columnsDef) {
              if(one.input && one.input.type=='tree') {
                 
                  if(this.$refs[one.prop]) {                    
                    var obj =this.$refs[one.prop][0]
                     if(row && row[one.prop]) {
                       obj.setCheckedKeys(row[one.prop])   
                     } else {
                       obj.setCheckedKeys([])
                     }
                  } else {
                    console.log("notexist",one.prop,this.$refs)
                  }
                  
      

              }
            }
        },
        formatInput(){//数据提交前的格式化
          for(let oneProp of this.editColumns) {
            let one=this.editColumnDefs[oneProp]
            if(one.input.formatter) {
               this.addForm[one.prop]=one.input.formatter(this.addForm[one.prop],this);
            } else if(one.input.type=='tree') {
              this.addForm[one.prop]=this.$refs[one.prop][0].getCheckedKeys(false)
            }
          }
        },
        cancel:function() {
            this.$emit('cancel');
        },
        setForce:function() {
          this.addForm.forceSave=true
          //新增 或 编辑
        },
        addSubmit: function() {
            let _this = this;
            this.formatInput();
            this.$refs.addForm.validate((valid) => {
              console.log("---验证结果",valid)
                if (valid) {
                    
                        //this.addLoading = true;
                       
                         let formData =null;
                        if(!this.hasFileInput) {
                          formData = Object.assign({}, this.addForm);   
                          console.log("sumit:"+JSON.stringify(formData));                      
                        }  else{
                           console.log("sumitFile:");  
                         formData = new FormData();
                         let otherData={}
                         let hasOtherData=false
                         for(let k of Object.keys(this.addForm)) {
                            console.log("append:",k,"=",this.addForm[k]);
                            //FormData不支持对象的值，必须丢弃
                            if(this.addForm[k] instanceof File) {
                               formData.append(k,this.addForm[k]);
                            } else{
                              hasOtherData=true
                              otherData[k]=this.addForm[k]
                            }
                         }
                         if(hasOtherData) {
                           formData.append("_data",JSON.stringify(otherData)) 
                         }

                         console.log("--formData:"+JSON.stringify(formData));
                        }
                         this.$emit('submit',formData,{reload:true});  
        
                    
                }
            });
        },
        getDefaultValue(input) {
          if(input.default) return input.default
          if(!input.type) return ""
          if((input.type=='select' && input.multiple)|| input.type=='radioGroup' || input.type=='checkboxGroup' || input.type=='tree') {
            return []           
          } 
          return ''
        }
    }
  }
</script>