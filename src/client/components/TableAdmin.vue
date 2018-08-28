<!--核心组件：封装了表格增删改查翻页-->
<template>
    <section>
        <br>
        <el-row >
          <!--查询组件-->
          <component v-if="showFilter" :is="currentQueryForm" :metaData="init"  :filterInit="filterInit" :api="api"  ref="queryform"   v-on:action="handlerAction"></component>
        </el-row>
         <el-row>
         <!--动作按钮组件-->
          <component  :is="currentActionButtons" :current-row="currentRow" v-model="init" :api="api" ref="actionbuttons"  v-on:action="handlerAction"></component>
          </el-row>
        <!--列表-->
        <el-table  :data="records" stripe border  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @row-dblclick="handleEdit" :show-summary="showSummary" @current-change="currentRowChange" :cell-style="tableCellStyle" :row-style="tableRowStyle">
            <el-table-column v-if="init.showRemove" type="selection" width="55"></el-table-column>
            <el-table-column v-if="init.showIndexCol" type="index" width="60"></el-table-column>
            <el-table-column show-overflow-tooltip sortable v-for="item in columnDefs" :prop="item.prop" :label="item.label" :width="item.width" :key="item.prop" :formatter="item.formatter">                
                
                  <template  slot-scope="scope" >
                    <template v-if="item.download && scope.row[item.prop] ">
                      <a :href="item.downloadUrl+'&_id='+scope.row._id">          

                       <span v-if="scope.row[item.prop].srcName">
                          {{scope.row[item.prop].srcName}}
                        </span>
                        <span v-else>
                          {{scope.row[item.prop]}}
                        </span>
                    </a>
                    </template>
                    <template v-else>
                        <template v-if="item.formatter">
                          {{item.formatter(scope.row,scope.column,scope.row[scope.column.property],scope.$index)}}
                        </template>
                        <template v-else>
                        {{scope.row[item.prop]}}
                        </template>
                    </template>
                  </template>
                
                 
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button v-if="init.showRemove && checkPermission('remove')" type="danger" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
            <el-pagination v-if="init.showPagination" layout="total, sizes,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
             @size-change="handlePageSizeChange"
             :page-sizes="[10,20,50,70,100, 200, 300, 400]"
            :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <div v-if="init.remarks">
            <ul>
              <li v-for="one in init.remarks">{{one}}</li>
            </ul>
        </div>
    </section>
</template>
<style>
.el-table .disable-row {
    background: #B9B9B9;
}
.el-row {
    margin-bottom: 0px;
     padding: 0px 0;
  }
</style>
<script>
import * as PageUtil from './PageUtil';
import * as CommonUtils from '../../shared/utils/CommonUtils';
import * as api from '../api/PageAdminApi';


import QueryForm from './QueryForm.vue';
import ActionButtons from './ActionButtons.vue';



//import NProgress from 'nprogress'
export default {
     components: {
      'query-form':QueryForm,
      'action-buttons':ActionButtons
    },
    props: ['init'],
    data() {
        return {
            currentQueryForm:'query-form',
            currentActionButtons:'action-buttons',
            api:api,
            ajaxBatchRemove: api.callBatchRemove,

            ajaxListPage: api.callListPage,
            entityName: this.init.entityName,
            modulePath:this.init.path,
            columnDefs: this.convertTableDefs(this.init.columnsDef),

            records: [],
            total: 0,
            pageSize: this.init.pageSize ? this.init.pageSize : 10,
            page: 1,
            listLoading: false,
            sels: [], //列表选中列
            dialogSubmitCall: '',
            editLoading: false,
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            showFilter:this.getShowValue(this.init.showFilter),           
            showSummary: false,
            currentRow:null,
            filterInit:{}

        }
    },
    created: function() {        
        this.setValuedefault(this.init, "pageSize", 10);
        this.setValuedefault(this.init, "showAdd", true);
        this.setValuedefault(this.init, 'editable', true);
        this.setValuedefault(this.init, 'showRemove', true);
        this.setValuedefault(this.init, 'showPagination', true);
        this.setValuedefault(this.init, 'showIndexCol', true);
        this.setValuedefault(this.init, 'showSelectCol', true);
        this.setValuedefault(this.init, 'showFilter', true);
        this.setValuedefault(this.init, 'showSummary', false);
        if (this.init.showSummary) {
            this.showSummary = true;
        }
        if(this.$route.query) {            
            this.filterInit=this.$route.query
        }

        let _this = this;
        if (this.init.loadDatas) {
            for (let oneLoad of this.init.loadDatas) {
                let { path, params,projects } = oneLoad.ajax;
                api.callList({ filter: params,projects }, path).then(function(res) {
                    console.log("loadData",oneLoad.name,res.data.data)
                    _this.init.data[oneLoad.name] = res.data.data;
                });
            }
        }
    },
    methods: {
      checkPermission:function(action){
        return PageUtil.checkPermission(this.init.id,action)
       },
        callFormatter(item,value) {
            console.log("callFormatter:"+value,item)
            if(item.formatter) {
                return item.formatter(value)
            } else {
            return value
            }
        },
        handlePageSizeChange(val){
            this.pageSize=val;
            this.getRecords();
        },
        getShowValue(v){
            if(typeof(v) == "undefined") {
                return true;
            } else return v;
        },
        tableCellStyle({row}) {            
            if (row.enable == false || row.disable==true) {                
                return 'background: #C3C3C3';
            } else return null;

        },
        tableRowStyle(){
            return "cursor:pointer"
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
        setValuedefault: function(obj, vn, d) {
            if (obj[vn] == false) return;
            if (!obj[vn] || obj[vn] == '') {
                obj[vn] = d;
            }
        },


        convertTableDefs: function(columnDefs) {
            let defs = [];
            for (let elem of columnDefs.values()) {
                if (elem && !elem.hidden && elem.input && elem.input.type!='file') {
                    
                    if ((typeof(elem.autoRef) == "undefined" || elem.autoRef)  && elem.input && elem.input.ajax) {         
                        let newElem=CommonUtils.cloneObject(elem)
                        newElem.prop="@"+elem.prop
                        defs.push(newElem);
                    } else {
                       defs.push(elem);
                    }
                    if(elem.download){
                        elem.downloadUrl="/file/download"+this.init.path+"?prop="+elem.prop
                　　}
                } 

            }
            console.log("----defs",defs)
            return defs;
        },
        callListPage(params) { return this.ajaxListPage(params, this.modulePath); },
        callBatchRemove(params) { return this.ajaxBatchRemove(params, this.modulePath); },

        handleCurrentChange(val) {
            this.page = val;
            this.getRecords();
        },
        //获取列表
        getRecords() {

            let para = {
                page: this.page,
                pageSize: this.pageSize,
                filter: {}
            };

            if(this.init.filterConditions) {
                let conditions = this.init.filterConditions;
                for (let key of Object.keys(conditions)) {
                if (conditions[key] && conditions[key] != '') {
                    if (typeof conditions[key] == 'object')
                        para.filter[key] = Object.assign({}, conditions[key]);
                    else {
                        para.filter[key] = conditions[key];
                    }
                }
            }
            }
            if(this.showFilter) {
               let filters=this.$refs.queryform.getFilter();
                for (let key of Object.keys(filters)) {
                    if (filters[key] != '') {
                        if (typeof filters[key] == 'object')
                            para.filter[key] = Object.assign({}, filters[key]);
                        else {
                            para.filter[key] = filters[key];
                        }
                    }
                }
            }
            if (this.init.hook && this.init.hook.queryCheck) {
                console.log("call QueryCheck:" + JSON.stringify(para));
                para = this.init.hook.queryCheck(para,this);
            }

            this.listLoading = true;

            //NProgress.start();
            this.callListPage(para).then((res) => {
                //console.log(res);

                this.total = res.data.data.total;
                this.records = res.data.data.records;
                this.listLoading = false;
                //NProgress.done();
            });
        },
        //显示编辑界面
        handleEdit: function(row) {
            console.log("handleEdit",this.init.editable)
            if (this.init.editable && PageUtil.checkPermission(this.init.id,'edit')) {
                 this.$refs.actionbuttons.fromParent('edit',row);
            }
        },

        selsChange: function(sels) {
            this.sels = sels;
        },
        currentRowChange:function(row) {
            this.currentRow=row;
        },
        //批量删除
        batchRemove: function() {
            var ids = this.sels.map(item => item._id);
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;                
                let para = { ids: ids };
                this.callBatchRemove(para).then((res) => {
                    this.listLoading = false;
                    if (res.data.status.code == "0") {
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '删除失败:' + res.data.status.msg,
                            type: 'error'
                        });
                    }
                    this.getRecords();
                });
            }).catch(() => {

            });
        },
        handlerAction(actionName,data) {
            if(actionName=='reload'){
                this.getRecords();
            }else if(actionName=='query') {
                this.getRecords();
            }
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