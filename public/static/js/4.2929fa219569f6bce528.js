webpackJsonp([4],{"/X/K":function(e,t){},"9bBU":function(e,t,n){n("mClu");var a=n("FeBl").Object;e.exports=function(e,t,n){return a.defineProperty(e,t,n)}},C4MV:function(e,t,n){e.exports={default:n("9bBU"),__esModule:!0}},DaAP:function(e,t,n){"use strict";t.c=function(e){return Object(i.a)({url:"/top-order/list",method:"get",params:e})},t.a=function(e){var t;return Object(i.a)((t={url:"/top-order/checkorder",method:"post"},l()(t,"method","get"),l()(t,"params",e),t))},t.b=function(e){return Object(i.a)({url:"/top-order/deleteorder",method:"post",data:e})};var a=n("bOdI"),l=n.n(a),i=n("vLgD")},JYNy:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("woOf"),l=n.n(a),i=n("DaAP"),s=n("vLgD");function o(e){return Object(s.a)({url:"/pay-link/deletelink",method:"post",data:e})}var r=n("oqQY"),u=n.n(r),c={keyword:null,queryType:0,pageNum:1,pageSize:20,total:null},d={name:"home",data:function(){return{headers:{authorization:this.$store.state.user.token},loading:!1,dayjs:u.a,upfilehost:"",fileListArr:[],formShow:!1,form:{filenamelist:[]},rules:{name:[{required:!0,message:"请输入类型名称",trigger:"blur"}]},listQuery:l()({},c),total:0,options:[{value:0,label:"等待支付"},{value:1,label:"支付完成"},{value:2,label:"执行支付"},{value:-1,label:"支付未到账"}],list:[{id:1,name:"测试1",age:"1",edit:!1}],multipleSelection:[],operateType:null,operates:[{label:"批量删除",value:"alldel"}]}},beforeCreate:function(){},created:function(){this.upfilehost=this.$upfilehost,this.getlist()},beforeMount:function(){},mounted:function(){},beforeUpdate:function(){},updated:function(){},comments:function(){},methods:{copySecret:function(e,t){var n=document.createElement("input");n.value=e,document.body.appendChild(n),n.select();document.execCommand("copy"),this.$message({type:"success",message:["复制 商户订单号 成功","复制 系统订单号 成功","复制 平台订单号 成功","复制 支付链接 成功","复制 账号编码 成功"][t]}),document.body.removeChild(n)},getlist:function(){var e,t=this;(e=this.listQuery,Object(s.a)({url:"/pay-link/list",method:"get",params:e})).then(function(e){console.log("获取数据",e),t.list=e.data.list,t.total=e.data.total})},isedit:function(){return!1},queryList:function(){console.log(this.listQuery),this.getlist()},del:function(e){var t=this;this.$confirm("是否要进行该批量操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){o({oid:e.oid}).then(function(e){"ok"==e.data?t.$message({message:"删除成功",type:"success",duration:1e3}):t.$message({message:"删除失败",type:"error",duration:1e3})}),t.getlist()})},edit:function(e){this.form=e,this.formShow=!0},doublecheck:function(e){var t=this;this.loading=!0,Object(i.a)({tid:e.tid}).then(function(e){e.data.code,t.$message({message:1==e.data.code?"支付到账":"支付未到账",type:1==e.data.code?"success":"warning",duration:1e3}),t.getlist(),t.loading=!1})},forminit:function(){this.form={filenamelist:[]},this.fileListArr=[]},handleSave:function(e){var t=this,n=this;this.$refs[e].validate(function(e){if(!e)return console.log("错误提交请检查数据!!"),!1;var a;console.log(n.form),(a=n.form,Object(s.a)({url:"/pay-link/createbyfile",method:"post",data:a})).then(function(e){e.data.errls.length>0&&t.$message({message:"第 "+e.data.errls.join(",")+" 行 链接插入出错",type:"warning",duration:3e3}),t.forminit(),t.formShow=!1,t.getlist()})})},formBeforClose:function(e){var t=this;this.$confirm("确认关闭？").then(function(n){t.forminit(),e()}).catch(function(e){})},formClose:function(e){this.forminit(),e()},editSwitch:function(e){Number(!Boolean(e.is_show))},handleSelectionChange:function(e){this.multipleSelection=e},handleBatchOperate:function(){var e=this;null!=this.operateType?null==this.multipleSelection||this.multipleSelection.length<1?this.$message({message:"请选择要操作的链接",type:"warning",duration:1e3}):this.$confirm("是否要进行该批量操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){for(var t=[],n=0;n<e.multipleSelection.length;n++)t.push(e.multipleSelection[n].oid);switch(e.operateType){case"alldel":o({list:t.join(",")}).then(function(t){"ok"==t.data?e.$message({message:"删除成功",type:"success",duration:1e3}):e.$message({message:"删除失败",type:"error",duration:1e3})})}e.getlist()}):this.$message({message:"请选择操作类型",type:"warning",duration:1e3})},handleSizeChange:function(e){this.listQuery.pageNum=1,this.listQuery.pageSize=e,this.getlist()},handleCurrentChange:function(e){this.listQuery.pageNum=e,this.getlist()},beforeUploadFj:function(e){var t=e.name.substring(e.name.lastIndexOf(".")+1),n="txt"===t,a="csv"===t;return n||a||this.$message({message:"上传文件只能是 txt,csv!",type:"warning"}),n||a},handleExceedFj:function(e,t){this.$message.warning("当前限制选择 1 个文件")},handleRemoveFj:function(e,t){this.fileListArr=[]},handleSuccess:function(e,t,n){console.log("上传成功",e,t,n),200==e.statusCode&&(this.form.filenamelist.push({localname:t.name,filename:e.data.filename}),this.$message({message:"上传成功",type:"success"}),console.log("上传成功的表单",this.form))}}},f={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-card",{staticClass:"filter-container",attrs:{shadow:"never"}},[n("div",[n("i",{staticClass:"el-icon-search"}),e._v(" "),n("span",[e._v("筛选搜索")]),e._v(" "),n("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",size:"small"},on:{click:function(t){e.queryList()}}},[e._v("\n          查询结果\n        ")]),e._v(" "),n("el-button",{staticStyle:{float:"right","margin-right":"15px"},attrs:{size:"small"},on:{click:function(t){e.reset()}}},[e._v("\n          重置\n        ")])],1),e._v(" "),n("div",{staticStyle:{"margin-top":"15px"}},[n("el-form",{attrs:{inline:!0,model:e.listQuery,size:"small","label-width":"140px"}},[n("el-form-item",{attrs:{label:"订单搜索："}},[n("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"平台订单,系统订单"},on:{change:e.getlist},model:{value:e.listQuery.keyword,callback:function(t){e.$set(e.listQuery,"keyword",t)},expression:"listQuery.keyword"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"账号编码："}},[n("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"账号编码"},on:{change:e.getlist},model:{value:e.listQuery.zid,callback:function(t){e.$set(e.listQuery,"zid",t)},expression:"listQuery.zid"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"支付状态："}},[n("el-select",{attrs:{placeholder:"全部",clearable:""},on:{change:e.getlist},model:{value:e.listQuery.queryType,callback:function(t){e.$set(e.listQuery,"queryType",t)},expression:"listQuery.queryType"}},e._l(e.options,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1)],1)],1)]),e._v(" "),n("el-card",{staticClass:"operate-container",attrs:{shadow:"never"}},[n("i",{staticClass:"el-icon-tickets"}),e._v(" "),n("span",[e._v("数据列表")]),e._v(" "),n("el-button",{staticClass:"btn-add",attrs:{type:"primary",size:"mini"},on:{click:function(t){e.formShow=!0}}},[e._v("\n        添加\n      ")])],1),e._v(" "),n("div",{staticClass:"batch-operate-container"},[n("el-select",{attrs:{size:"small",placeholder:"批量操作"},model:{value:e.operateType,callback:function(t){e.operateType=t},expression:"operateType"}},e._l(e.operates,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),e._v(" "),n("el-button",{staticClass:"search-button",staticStyle:{"margin-left":"20px"},attrs:{type:"primary",size:"small"},on:{click:function(t){e.handleBatchOperate()}}},[e._v("\n        确定\n      ")])],1),e._v(" "),n("div",{staticClass:"pagination-container"},[n("el-pagination",{attrs:{background:"",layout:"total, sizes,prev, pager, next,jumper","page-size":e.listQuery.pageSize,"page-sizes":[20,50,100],"current-page":e.listQuery.pageNum,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.$set(e.listQuery,"pageNum",t)}}})],1),e._v(" "),n("div",{staticClass:"table-container"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"list",staticStyle:{width:"100%"},attrs:{data:e.list,border:"",stripe:"","default-sort":{prop:"createdate"}},on:{"selection-change":e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",align:"center",width:"40"}}),e._v(" "),n("el-table-column",{attrs:{type:"index",align:"center",width:"40",label:"#"}}),e._v(" "),n("el-table-column",{attrs:{label:"平台订单号","min-width":"7%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{on:{click:function(n){e.copySecret(t.row.tid,2)}}},[e._v(e._s(t.row.oid))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"系统订单号","min-width":"6%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{on:{click:function(n){e.copySecret(t.row.tid,1)}}},[e._v(e._s(t.row.tid))])]}}])}),e._v(" "),"admin"==e.$store.getters.roles?n("el-table-column",{attrs:{label:"ZH","min-width":"3%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row.zh))])]}}])}):e._e(),e._v(" "),n("el-table-column",{attrs:{label:"账号编号","min-width":"4%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{on:{click:function(n){e.copySecret(t.row.zid,4)}}},[e._v(e._s(t.row.zid))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"金额","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(Number(t.row.quota)/100))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"创建时间","min-width":"5%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e.dayjs(t.row.create_time).format("YYYY-MM-DD HH:mm:ss")))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"创建状态","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-tag",{attrs:{type:1==t.row.create_status?"success":2==t.row.create_status?"warning":0==t.row.create_status?"info":"danger"}},[e._v("\n              "+e._s(1==t.row.create_status?" 可使用":2==t.row.create_status?"创建中":0==t.row.create_status?"待执行":"不可用")+"\n            ")])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"支付状态","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-tag",{attrs:{type:1==t.row.result?"success":2==t.row.result?"warning":0==t.row.result?"info":"danger"}},[e._v("\n              "+e._s(1==t.row.result?" 支付完成":2==t.row.result?"执行支付":0==t.row.result?"等待支付":"支付但未到账")+" ")])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"支付链接","min-width":"3%"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{on:{click:function(n){e.copySecret(t.row.pay_link,3)}}},[n("el-button",{attrs:{type:"primary",size:"mini"}},[e._v("点击复制")])],1)]}}])}),e._v(" "),n("el-table-column",{staticClass:"operation",attrs:{label:"操作",fixed:"right",align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{staticClass:"btnbodyhang"},[n("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(n){e.del(t.row)}}},[e._v("删除")])],1)]}}])})],1)],1),e._v(" "),n("el-dialog",{attrs:{title:"添加保存数据",visible:e.formShow,"before-close":e.formBeforClose,close:e.formClose,width:"40%"},on:{"update:visible":function(t){e.formShow=t}}},[n("el-form",{ref:"selfForm",attrs:{model:e.form,rules:e.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"充值文件",prop:"file"}},[n("div",[e._v("格式:一行一个 账号----面额----订单id----支付链接")]),e._v(" "),n("el-upload",{ref:"scfj",attrs:{"file-list":e.fileListArr,action:e.upfilehost,accept:".txt,.csv","before-upload":e.beforeUploadFj,"on-exceed":e.handleExceedFj,"on-remove":e.handleRemoveFj,multiple:"",limit:10,"auto-upload":!0,"on-success":e.handleSuccess,headers:e.headers}},[n("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[e._v("选取文件")])],1)],1)],1),e._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.formShow=!1}}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(t){e.handleSave("selfForm")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var m=n("VU/8")(d,f,!1,function(e){n("/X/K")},null,null);t.default=m.exports},bOdI:function(e,t,n){"use strict";t.__esModule=!0;var a,l=n("C4MV"),i=(a=l)&&a.__esModule?a:{default:a};t.default=function(e,t,n){return t in e?(0,i.default)(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},mClu:function(e,t,n){var a=n("kM2E");a(a.S+a.F*!n("+E39"),"Object",{defineProperty:n("evD5").f})}});