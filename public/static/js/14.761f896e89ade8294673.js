webpackJsonp([14],{E1aQ:function(e,t){},JS2p:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("woOf"),i=n.n(a),l=n("ZlPB"),s={pageNum:1,pageSize:20,total:null},o={name:"home",data:function(){return{formShow:!1,form:{},rules:{name:[{required:!0,message:"请输入类型名称",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],cid:[{required:!0,message:"请选择类型名称",trigger:"blur"}]},listQuery:i()({},s),total:0,options:[{value:1,label:"测试1"},{value:2,label:"测试2"}],channellist:[],list:[{id:1,name:"测试1",age:"1",edit:!1}],multipleSelection:[],operateType:null,operates:[{label:"测试功能1",value:"up"},{label:"测试功能2",value:"down"}]}},created:function(){this.getclist(),this.getlist()},methods:{filtercid:function(e){var t="";return this.channellist.forEach(function(n){n.value==e&&(t=n.label)}),t},getclist:function(){var e=this;Object(l.a)(this.listQuery).then(function(t){e.channellist=t.data.list})},getlist:function(){var e=this;Object(l.b)(this.listQuery).then(function(t){e.list=t.data.list,e.total=t.data.total})},isedit:function(){return!1},queryList:function(){console.log(this.listQuery)},del:function(e){var t=this;this.$confirm("是否要进行该操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(l.d)({action:"remove",id:e.id}).then(function(e){t.$message({type:"success",message:"删除成功!"}),t.getlist()})})},edit:function(e){this.form=e,this.formShow=!0},handleSave:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("错误提交请检查数据!!"),!1;t.form.id?t.form.action="edit":t.form.action="add",console.log(t.form),Object(l.d)(t.form).then(function(e){t.$message({message:"操作成功",type:"success"}),t.getlist()}),t.formShow=!1,t.form={}})},formBeforClose:function(e){var t=this;this.$confirm("确认关闭？").then(function(n){t.form={},e()}).catch(function(e){})},formClose:function(e){this.form={},e()},editSwitch:function(e){var t=this;Object(l.d)({action:"enable",id:e.id,value:e.enable}).then(function(e){t.$message({message:"操作成功",type:"success",duration:1e3}),t.getlist()})},handleSelectionChange:function(e){this.multipleSelection=e},handleBatchOperate:function(){var e=this;null!=this.operateType?null==this.multipleSelection||this.multipleSelection.length<1?this.$message({message:"请选择要操作的商品",type:"warning",duration:1e3}):this.$confirm("是否要进行该批量操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){for(var t=[],n=0;n<e.multipleSelection.length;n++)t.push(e.multipleSelection[n].id);switch(e.operateType){case e.operates[0].value:console.log("批量处理",t)}e.getlist()}):this.$message({message:"请选择操作类型",type:"warning",duration:1e3})},handleSizeChange:function(e){this.listQuery.pageNum=1,this.listQuery.pageSize=e,this.getlist()},handleCurrentChange:function(e){this.listQuery.pageNum=e,this.getlist()}}},r={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-card",{staticClass:"operate-container",attrs:{shadow:"never"}},[n("i",{staticClass:"el-icon-tickets"}),e._v(" "),n("span",[e._v("支付通道列表")])]),e._v(" "),n("el-card",{staticClass:"operate-container",attrs:{shadow:"never"}},[n("i",{staticClass:"el-icon-tickets"}),e._v(" "),n("span",[e._v("数据列表")]),e._v(" "),n("el-button",{staticClass:"btn-add",attrs:{type:"primary",size:"mini"},on:{click:function(t){e.formShow=!0}}},[e._v("\n      添加\n    ")])],1),e._v(" "),"admin"==e.$store.getters.roles?n("div",{staticClass:"batch-operate-container"},[n("el-select",{attrs:{size:"small",placeholder:"批量操作"},model:{value:e.operateType,callback:function(t){e.operateType=t},expression:"operateType"}},e._l(e.operates,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),e._v(" "),n("el-button",{staticClass:"search-button",staticStyle:{"margin-left":"20px"},attrs:{type:"primary",size:"small"},on:{click:function(t){e.handleBatchOperate()}}},[e._v("\n      确定\n    ")])],1):e._e(),e._v(" "),n("div",{staticClass:"pagination-container"},[n("el-pagination",{attrs:{background:"",layout:"total, sizes,prev, pager, next,jumper","page-size":e.listQuery.pageSize,"page-sizes":[20,30,50],"current-page":e.listQuery.pageNum,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.$set(e.listQuery,"pageNum",t)}}})],1),e._v(" "),n("div",{staticClass:"table-container"},[n("el-table",{ref:"list",staticStyle:{width:"100%"},attrs:{data:e.list,border:"",stripe:"","default-sort":{prop:"createdate"}},on:{"selection-change":e.handleSelectionChange}},["admin"==e.$store.getters.roles?n("el-table-column",{attrs:{type:"selection",align:"center",width:"40"}}):e._e(),e._v(" "),n("el-table-column",{attrs:{type:"index",align:"center",width:"40",label:"#"}}),e._v(" "),n("el-table-column",{attrs:{label:"子通道名称","min-width":"8%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.name))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"子通道父项","min-width":"8%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e.filtercid(t.row.cid)))])]}}])}),e._v(" "),"admin"==e.$store.getters.roles?n("el-table-column",{staticClass:"operation",attrs:{label:"操作",fixed:"right",align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{staticClass:"btnbodyhang"},[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){e.edit(t.row)}}},[e._v("修改")]),e._v(" "),n("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(n){e.del(t.row)}}},[e._v("删除")])],1)]}}])}):e._e()],1)],1),e._v(" "),n("el-dialog",{attrs:{title:"添加保存数据",visible:e.formShow,"before-close":e.formBeforClose,close:e.formClose,width:"40%"},on:{"update:visible":function(t){e.formShow=t}}},[n("el-form",{ref:"selfForm",attrs:{model:e.form,rules:e.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"支付通道",prop:"cid"}},[n("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:e.form.cid,callback:function(t){e.$set(e.form,"cid",t)},expression:"form.cid"}},e._l(e.channellist,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),n("el-form-item",{attrs:{label:"支付子项名称",prop:"name"}},[n("el-input",{attrs:{"auto-complete":"off"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1),e._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.formShow=!1}}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.handleSave("selfForm")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var c=n("VU/8")(o,r,!1,function(e){n("E1aQ")},null,null);t.default=c.exports}});