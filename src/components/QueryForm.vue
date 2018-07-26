<!--核心组件：封装了增删改查翻页-->
<template>
    <section>
        <!--工具条-->
        
            <el-form :inline="true" :model="filters">
                <el-form-item v-for="item in filterProps" :key="item.prop">
                    <el-input style="width:100px" v-if="item.filter==true || typeof item.filter.type=='undefined' || item.filter.type==='text'" v-model="filters[item.prop]" :placeholder="item.label"></el-input>
                    <template v-if="(item.filter.type==='dateScope')">
                        <el-date-picker v-model="filters[item.prop].from" type="date" :placeholder="getYYYYMMDD(item.filter.filterDefaultFrom)" :default-value="item.filter.filterDefaultFrom" format="yyyyMMdd">
                        </el-date-picker>-
                        <el-date-picker v-model="filters[item.prop].to" type="date" :placeholder="getYYYYMMDD(item.filter.filterDefaultTo)" :default-value="item.filter.filterDefaultTo" format="yyyyMMdd">
                        </el-date-picker>
                    </template>
                    <el-select style="width:100px" v-if="(item.filter.type==='select')" v-model="filters[item.prop]" :placeholder="item.label" clearable>
                        <el-option v-for="one in item.filter.options" :key="one.value" :label="one.label" :value="one.value">
                        </el-option>
                    </el-select>
                    <el-radio-group v-if="item.filter.type === 'radio'" v-model="filters[item.prop]">
                        <el-radio-button class="radio" v-for="(item,index) in item.filter.options" :label="item.value" :key="item.label">
                            {{item.label}}
                        </el-radio-button>
                    </el-radio-group>
                    
                   <el-cascader v-if="item.filter.type==='cascader'" v-model="filters[item.prop]"  :options="item.filter.options" :props="item.filter.props"  :placeholder="item.filter.placeholder" clearable filterable :change-on-select="item.filter.changeOnSelect"/> 

                </el-form-item>
  <!--               <el-form-item>
                    <el-button  type="primary" v-on:click="getRecords">查询</el-button>
                </el-form-item> -->

            </el-form>
        
    </section>
</template>

<script>
import * as PageUtil from './PageUtil';
const ComonUtils = require('../../utils/CommonUtils');

export default {
      props: ['metaData','api','filterInit'],    
    data() {
        return {
            filterProps: this.toFilterProps(this.metaData.columnsDef),
            filters: this.toFilters(this.metaData.columnsDef)
        }
    },
    created: function() {
        for(let key of Object.keys(this.filters)) {                
           this.$watch('filters.'+key, function (newVal, oldVal) {
                console.log("emit:"+key);
                this.$emit('action','query');
            })
        }
        if(this.filterInit) {
            for(let key of Object.keys(this.filterInit)) {
                this.filters[key]=this.filterInit[key]
            }
        }
    },
    
    methods: {
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
        getFilter(){

            return this.filters;
        },
        toFilters: function(columnDefs) {
            let filters = {};
            for (let elem of columnDefs.values()) {
                if (elem && elem.filter && elem.filter.type && elem.filter.type == "dateScope") {
                    filters[elem.prop] = {};

                    filters[elem.prop].from = this.getYYYYMMDD(elem.filterDefaultFrom);
                    filters[elem.prop].to = this.getYYYYMMDD(elem.filterDefaultTo);
                } else if (elem && elem.filter) {
                    filters[elem.prop] = elem.filter.default?elem.filter.default:"";

                }
            }
            console.log("---filters:"+JSON.stringify(filters));
            return filters;
        },
        callAjax(oi){
            let { entityName, params, label, value,projects } = oi.ajax;
            this.api.callList({ filter: params,projects }, entityName).then(function(res) {
                if(oi.type=='select') {
                   oi.options = PageUtil.toSelectOptions(res.data.data, label, value);
                   console.log("setOptions",oi)
                } else {
                    oi.options = res.data.data;
                    console.log(oi);
                }
            });
        },
        toFilterProps: function(columnDefs) {
            let filterProps = [];
            for (let elem of columnDefs.values()) {
                if (elem && elem.filter) {
                   //let oneElem=ComonUtils.clone(elem)
                    let oneElem=elem
                    filterProps.push(oneElem);
                    if(oneElem.filter.ajax) {
                     this.callAjax(oneElem.filter);       
                    } else if(oneElem.filter.inputs) {
                         for(let oi of oneElem.filter.inputs) {
                            if(oi &&　(!oi.options || oi.options.length==0) && oi.ajax) {
                                this.callAjax(oi);
                            }
                         }
                   }
                   } 
                }            
            return filterProps;
        },
    },
    mounted() {
        
    }
}
</script>
