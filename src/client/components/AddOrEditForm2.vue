</script>
<template>
    <section id="editContainer">
        <!--新增和编辑界面-->        
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item v-for="(item,index) in editColumnDefs" :prop="item.prop" :label="item.label" :key="item.name">
                    <el-input v-if="!item.input.type || (item.input.type==='text' || item.input.type==='textarea')" v-model="addForm[item.prop]" :type="item.input.type"></el-input>
                    <el-radio-group v-else-if="item.input.type === 'radio'" v-model="addForm[item.prop]">
                        <el-radio-button class="radio" v-for="(item,index) in item.input.options" :label="item.value" :key="item.label">
                            {{item.label}}
                        </el-radio-button>
                    </el-radio-group>
                    <el-checkbox v-else-if="item.input.type==='checkbox'" v-model="addForm[item.prop]"></el-checkbox>
                    <template v-else-if="item.input.type==='twoText'">
                        <el-col :span="5">
                            <el-input v-model="addForm[item.props[0]]"></el-input>
                        </el-col>
                        <el-col class="line" :span="1">-></el-col>
                        <el-col :span="5">
                            <el-input v-model="addForm[item.props[1]]"></el-input>
                        </el-col>
                    </template>
                    <el-select v-else-if="item.input.type==='selectMulti'" v-model="addForm[item.prop]" clearable multiple>
                        <el-option v-for="one in item.input.options" :label="one.label" :key="one.label" :value="one.value">
                        </el-option>
                    </el-select>
                    <el-select v-else-if="item.input.type==='select'" v-model="addForm[item.prop]" clearable>
                        <el-option v-for="one in item.input.options" :label="one.label" :key="one.label" :value="one.value">
                        </el-option>
                    </el-select>                  
                  <el-cascader v-if="item.input.type==='cascader'" v-model="addForm[item.prop]"  :options="item.input.options" :props="item.input.props"  :placeholder="item.input.placeholder" clearable filterable :change-on-select="item.input.changeOnSelect"/> 

                    <input  id="fileupload" v-else-if="item.input.type==='file'"   @change="getFile($event,item.prop)"  type="file" />
                    <el-tree v-else-if="item.input.type==='tree'" :data="item.input.data" :props="item.input.props" :render-content="item.input.renderContent" @check-change="item.input.heckChange" :node-key="editColumnDefs[oneItem].input.nodeKey" ref="tree" show-checkbox>
                    </el-tree>
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




 export default {
    props: ['columnsDef','api'],
     
    data() {
      return {          
         editColumnDefs:[],
         addFormRules: {},
         addForm: {},
         hasFileInput:false
      };
    },
     mounted() {

     },
    methods: {
      onSelectChange(change) {
        console.log("onSelectChange-");
        console.log(change);
      },
      loadEditColumn(isEdit){
          let p=this;
           this.convertFormRule(this.columnsDef,isEdit).then(function(results){
             p.editColumnDefs=results;
             
           });
      },
      forAdd() {
        this.loadEditColumn(false);        
        this.clearFormData();
      },
      forEdit(){
       this.loadEditColumn(true);
      },
      getFile(event,propName) { 
            this.addForm.file = event.target.files[0];   
            this.hasFileInput=true;         
      },
      createPromise(input){
        let { entityName, params, label, value,projects } = input.ajax;
        let theapi=this.api;
        return new Promise(function(resolve, reject) {  
                      theapi.callList({ filter: params,projects }, entityName).then(function(res) {
                            input.options = PageUtil.toSelectOptions(res.data.data, label, value);
                               resolve(true);
                       });
                         
                });
      },

      convertFormRule: function(columnDefs,isEdit) {
            console.log("-------------convertFormRule:"+isEdit);
            let defs = [];
            let promises=[];
            let theAddForm={};
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
                      rules[elem.prop].push({ validator: elem.input.rule, trigger: 'blur' });   
                    }                   
                  }
                    defs.push(elem);
                      console.log("-------------convertFormRule:1:"+JSON.stringify(elem));
                    if (elem.input ) {
                        theAddForm[elem.prop]=elem.input.default ? elem.input.default : "";
                        if( elem.input.ajax) {                                                  
                          promises.push(this.createPromise(elem.input));
                       } else if(typeof elem.input=='string') {
                          elem.input={type:elem.input};
                       } else if(elem.input.inputs) {
                         for(let oi of elem.input.inputs) {
                            if(oi &&　(!oi.options || oi.options.length==0) && oi.ajax) promises.push(this.createPromise(oi));
                         }
                       }
                    } 
                }

            }
          this.addForm=theAddForm;
          console.log("----addForm:"+JSON.stringify(this.addForm));
          this.addFormRules=rules;
          if(isEdit) this.addForm._id='';
          return new Promise(function(resolve, reject) {  
            if(promises.length>0) {
              Promise.all(promises).then(function (posts) {
                  resolve(defs);
              });
            } else 
              resolve(defs);
          });
        },        
        setFormData:function(row) {
             //this.addForm = Object.assign({}, row);          
             console.log(row);
             for(let one of Object.keys(this.addForm)) {
              console.log(one);
                if(typeof(row[one] )!="undefined") {

                  this.addForm[one]=row[one];
                  console.log('set:'+one+":"+row[one]);
                }
             }
             this.hasFileInput=false;
              var obj = document.getElementById('fileupload') ; 
             if(obj) {
              obj.value = ''
              //obj.outerHTML=obj.outerHTML; 
            }
        },
        clearFormData:function() {
            console.log("---clearFormData:");
            this.$refs.addForm.resetFields();
            this.addForm._id='';
            this.hasFileInput=false;
/*            for(let k of Object.keys(this.addForm)) {

                this.addForm[k]='';
            }*/
           //console.log("---clearFormData:"+this.$refs.addForm._id);
           var obj = document.getElementById('fileupload') ; 
           if(obj) {
              obj.value = ''
              //obj.outerHTML=obj.outerHTML; 
            }

        },
        formatInput:function(){//数据提交前的格式化
          for(let one of this.editColumnDefs) {
            if(one.input.formatter) {
               this.addForm[one.prop]=one.input.formatter(this.addForm[one.prop]);
            }
          }
        },
        cancel:function() {
            this.$emit('cancel');
        },
          //新增 或 编辑
        addSubmit: function() {
            let _this = this;
            this.formatInput();
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        //this.addLoading = true;
                       
                         let formData =null;
                        if(!this.hasFileInput) {
                          formData = Object.assign({}, this.addForm);   
                          console.log("sumit:"+JSON.stringify(formData));                      
                        }  else{
                           console.log("sumitFile:");  
                         formData = new FormData();
                         for(let k of Object.keys(this.addForm)) {
                            console.log("append:",k,"=",this.addForm[k]);
                            formData.append(k,this.addForm[k]);
                         }
                                                  
                         console.log("--formData:"+JSON.stringify(formData));
                        }
                         this.$emit('submit',formData);  
        
                    });
                }
            });
        },

    }
  }
</script>