<!--核心组件：封装了增删改查翻页-->
<template>
    <section>

        <!--树-->
        <br>
         <el-button type="primary" @click="handleAddTop">新增</el-button>
         <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

<br><br>
 <div class="tree">
         <el-tree   class="filter-tree" :filter-node-method="filterNode" accordion :default-expanded-keys="expandedKeys" :data="treeData" :props="treeProps" node-key="_id"   ref="tree" >
             <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="success"
                    size="mini"
                     icon="el-icon-circle-plus"
                     circle
                    @click="() => add(node,data)">                    
                  </el-button>
                  <el-button
                    
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    @click="() => edit(node, data)">                    
                  </el-button>                  
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="() => remove(node, data)">                    
                  </el-button>
                </span>
              </span>
         </el-tree>

         

</div>
        
        <!--新增和编辑界面-->
        <el-dialog :title="dialogTitle" :visible.sync="addFormVisible" :close-on-click-modal="false">
           <!-- <edit-form ></edit-form> -->
            <component :is="currentEditForm" :columnsDef="init.columnsDef" :api="api" ref="editform"  v-on:cancel="addFormVisible=false"  v-on:submit="formSubmit"></component>
        </el-dialog>



    </section>
</template>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height:150px;
  }
  .tree {
     border-width: 1px;
    border-style: solid;
    border-color: #BBB;
    width: 800px;   
    background-color: #EEE;
  }
</style>
<script>
import * as PageUtil from './PageUtil';
import * as api from '../api/PageAdminApi';
import AddOrEditForm from './AddOrEditForm2.vue'; 

export default {
         components: {    
      'edit-form': AddOrEditForm      
    },
    props: ['init'],
    data() {
        return {            
            currentEditForm:'edit-form',
            api:api,
            ajaxRemove: api.callTreeRemove,
            ajaxAdd: api.addTree,        
            ajaxUpdate: api.updateTree,        
            ajaxList: api.callList,
            entityName: this.init.entityName,
            modulePath:this.init.path,                    
            treeData: [],
            treeProps:this.init.treeProps,            
            listLoading: false,            
            dialogTitle: '',
            dialogSubmitCall: '',
            editLoading: false,
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            listLoading: false,
            currentEditPath:'',
            currentNode:'',
            expandedKeys:[],
            filterText: ''



        }
    },
    created: function() {


    },
     watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
        filterNode(value, data) {
         if (!value) return true;
          return data.label.indexOf(value) !== -1;
         },
        add(node,data){
             this.currentNode=node;
             let path=this.getNodePath(node); 
          this.handleAdd(path);
        },        
        remove(node,data){
            this.$confirm('确认删除['+data.name+']吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;        
                let $path=this.getNodePath(node);                 
                let para = { $path};
                this.callRemove(para).then((res) => {
                    this.listLoading = false;
                    if (res.data.status.code == "0") {
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                         this.expandedKeys=[node.parent.data._id];
                         this.getRecords();
                    } else {
                        this.$message({
                            message: '删除失败:' + res.data.status.msg,
                            type: 'error'
                        });
                    }
                   
                });
            }).catch(() => {

            });
        },
        getYYYYMMDD: function(date) {
            if (date instanceof Date) {
                var month = date.getMonth() + 1;
                if (month < 10)
                    month = "0" + month;
                var day = date.getDate();
                if (day < 10)
                    day = "0" + day;
                return date.getFullYear() + "" + month + "" + day;
            } else return date;
        },
        getNodePath(node){
            //当前操作节点路径:格式{top:'最高节点_id',path:'最高节点下的路径:sub.a'}
            let nodepath={top:null,path:"",children:this.treeProps.children};
            if(!node) return nodepath;
            if(node.level==1)  {
                nodepath.top=node.data._id;
                return nodepath;
            }

            nodepath.path=node.data._id;
            let p=node;
            while(true) {                
                if(p.level==1) {
                    nodepath.top=p.data._id;
                     nodepath.path=this.treeProps.children+"."+nodepath.path;
                    return nodepath;
                } else if(p.parent && p.parent.data &&　p.parent.level!=1) {
                    nodepath.path=p.parent.data._id+"."+this.treeProps.children+"."+nodepath.path;
                    p=p.parent;
                } else if(p.parent){
                    p=p.parent;
                }
            }            
            return nodepath;
        },
        handleAddTop(){
            this.add(null);
        },
                //显示编辑界面
        edit: function(node,data) {  
                this.currentNode=node;
                this.currentEditPath=this.getNodePath(node);           
                this.dialogTitle = '编辑';
                this.addFormVisible = true;  
                this.dialogSubmitCall=this.callEdit;                                            
                setTimeout(() => {
                     this.$refs.editform.forEdit();  
                         this.$refs.editform.setFormData(data); 
                    }, 20);
                if (this.init.methods && this.init.methods.onShowEdit) {
                    //延时触发该事件，因为必须等ddialog初始化完毕
                    setTimeout(() => {
                        this.init.methods.onShowEdit(this.addForm, this);
                    }, 20);
                }
            
        },
            //显示新增界面        
        handleAdd: function(path) {
            console.log("---handleAdd-----------"+path);
            this.dialogTitle = '新增';            
            this.addFormVisible = true;
            this.dialogSubmitCall=this.callAdd;
            this.currentEditPath=path;
            
            //if(this.$refs.editform.clearFormData)
            //this.$refs.editform.clearFormData();
            console.log("---handleAdd-----------111111111");
            setTimeout(() => {    
                        console.log(this.$refs) 
                        console.log(this.$refs.editform) 
                        this.$refs.editform.forAdd();
                        if(this.$refs.editform.clearFormData)                  
                        this.$refs.editform.clearFormData();    
            }, 20);
            if (this.init.methods && this.init.methods.onShowAdd) {
                //延时触发该事件，因为必须等ddialog初始化完毕
                setTimeout(() => {
                    this.init.methods.onShowAdd(this.addForm, this);
                }, 20);
            }
        },
        formSubmit:function(formData) {
             if (this.init.methods && this.init.methods.submitCheck) {
                      formData = this.init.methods.submitCheck(formData, this);
             }
             console.log("currentEditPath");
             console.log(this.currentEditPath);
             formData.$path=this.currentEditPath;             
            this.dialogSubmitCall(formData).then((res) => {
                            this.addLoading = false;                                
                            if (res.data.status.code == "0") {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs.editform.clearFormData();                                    
                                this.addFormVisible = false;  
                                if(this.currentNode && this.currentNode.data)  {                        
                                 this.expandedKeys=[this.currentNode.data._id];
                                }
                                this.getRecords();                                
                            } else {
                                this.$message({
                                    message: '提交失败：' + res.data.status.msg,
                                    type: 'error'
                                });
                            }

                        });
        }, 
        callList() { return this.ajaxList(null,this.modulePath); },
        callRemove(params) { return this.ajaxRemove(params, this.modulePath); },
        callAdd(params) { return this.ajaxAdd(params, this.modulePath); },
        callEdit(params) { return this.ajaxUpdate(params, this.modulePath); },
        

        //获取列表
        getRecords() {

            this.listLoading = true;

            //NProgress.start();
            this.callList().then((res) => {
                console.log(res);     
                this.treeData = this.convertDocs(res.data.data)
                this.listLoading = false;
                if(this.filterText) {
                    setTimeout(() => {
                         this.$refs.tree.filter(this.filterText);
                    }, 20);
                
                }
                //NProgress.done();
            });
        },
    convertDocs(docs) {        
        let treeData = [];
        for (let one of docs) {
            if (one.sub) {
                one.sub = this.subToArray(one.sub);
            }           
        }
        return docs;
    },
    subToArray(doc) {
            let a = [];
            for (let key of Object.keys(doc)) {
                let v = doc[key];
                let name = null;
                let one = { _id: key };
                if (typeof v == 'string') {
                    one.name = v;
                } else {
                    for (let vv of Object.keys(v)) {
                        if (vv == 'sub') {
                            one[vv] = this.subToArray (v[vv]);
                        } else
                            one[vv] = v[vv];


                    }
                }        
                a.push(one);
            }
            console.log(a);
            return a;
    }
    },
    mounted() {
        this.getRecords();
    },
    computed: {

    }
}
</script>
<style scoped>
</style>