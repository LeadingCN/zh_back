webpackJsonp([21],{"5b2i":function(t,e){},caeP:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("woOf"),a=n.n(i),o=n("vLgD");function s(t){return Object(o.a)({url:"/zh/zhup",method:"post",data:t})}var l={keyword:null,pageNum:1,pageSize:50,queryType:null,total:null},r={name:"home",data:function(){return{headers:{authorization:this.$store.state.user.token},upfilehost:"",formShow:!1,form:{filenamelist:[]},rules:{name:[{required:!0,message:"请输入类型名称",trigger:"blur"}]},listQuery:a()({},l),total:0,list:[],multipleSelection:[],operateType:null,operates:[{label:"批量删除",value:"del"},{label:"每日额度",value:"quota"}],fileListArr:[]}},beforeCreate:function(){},created:function(){this.upfilehost=this.$upfilehost,this.getlist()},beforeMount:function(){},mounted:function(){},beforeUpdate:function(){},updated:function(){},comments:function(){},methods:{sortByDate:function(t,e){return t.balance-e.balance},getlist:function(){var t,e=this;(t=this.listQuery,Object(o.a)({url:"/zh/list",method:"get",params:t})).then(function(t){console.log("获取数据",t),e.list=t.data.list,e.total=t.data.total})},isedit:function(){return!1},queryList:function(){this.getlist()},editSwitch:function(t){var e=this;s({action:"enable",zid:t.zid,enable:t.enable}).then(function(n){e.$message({message:1==t.enable?"开启成功":"关闭成功",type:"success"})})},upquotaself:function(t){var e=this;s({action:"upquota",zid:t}).then(function(t){e.getlist()})},upbalance:function(){var t=this;s({action:"upquotaall"}).then(function(e){t.getlist()})},upquota:function(t){var e=this;this.$prompt("请输入每日限额","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputPattern:/^[0-9]*$/,inputErrorMessage:"每日限额必须整数"}).then(function(n){var i=n.value;e.$message({type:"success",message:"你的每日限额是: "+i}),s({action:"quota",zid:t,quota:i}).then(function(t){e.getlist()})}).catch(function(){e.$message({type:"info",message:"取消输入"})})},upcookie:function(t){var e=this;this.$prompt("请输入输入cookie","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(n){var i=n.value;e.$message({type:"success",message:"cookie: "+i,duration:3e3}),s({action:"cookie",zid:t,cookie:i}).then(function(t){e.getlist()})}).catch(function(){e.$message({type:"info",message:"取消输入"})})},del:function(t){var e=this;this.$confirm("是否要进行该删除操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){s({action:"del",zid:t.zid}).then(function(t){e.getlist()})})},edit:function(t){this.form=t,this.formShow=!0},forminit:function(){this.form={filenamelist:[]},this.fileListArr=[]},handleSave:function(t){var e=this,n=this;this.$refs[t].validate(function(t){if(!t)return console.log("错误提交请检查数据!!"),!1;var i;(i=n.form,Object(o.a)({url:"/zh/zhcreate",method:"post",data:i})).then(function(t){console.log(t),"ok"!=t.data?e.$message({message:"第"+t.data.join(",")+"行cookie导入失败",type:"warning",duration:3e3}):e.$message({message:"成功",type:"success",duration:1e3}),e.formShow=!1,e.forminit(),e.getlist()})})},formBeforClose:function(t){var e=this;this.$confirm("确认关闭？").then(function(n){e.forminit(),t()}).catch(function(t){})},formClose:function(t){this.forminit(),t()},handleSelectionChange:function(t){this.multipleSelection=t,console.log(t)},handleBatchOperate:function(){var t=this;null!=this.operateType?null==this.multipleSelection||this.multipleSelection.length<1?this.$message({message:"请选择要操作的商品",type:"warning",duration:1e3}):this.$confirm("是否要进行该批量操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){for(var e=[],n=0;n<t.multipleSelection.length;n++)e.push(t.multipleSelection[n].zid);switch(t.operateType){case"del":console.log("批量处理",e),s({action:"del",list:e}).then(function(e){t.getlist()});break;case"quota":t.$prompt("请输入每日限额","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputPattern:/^[0-9]*$/,inputErrorMessage:"每日限额必须整数"}).then(function(n){var i=n.value;t.$message({type:"success",message:"你的每日限额是: "+i}),s({action:"quota",list:e,quota:i}).then(function(e){t.getlist()})}).catch(function(){t.$message({type:"info",message:"取消输入"})})}t.getlist()}):this.$message({message:"请选择操作类型",type:"warning",duration:1e3})},handleSizeChange:function(t){this.listQuery.pageNum=1,this.listQuery.pageSize=t,this.getlist()},handleCurrentChange:function(t){this.listQuery.pageNum=t,this.getlist()},beforeUploadFj:function(t){var e=t.name.substring(t.name.lastIndexOf(".")+1),n="txt"===e,i="csv"===e;return n||i||this.$message({message:"上传文件只能是 txt,csv!",type:"warning"}),n||i},handleExceedFj:function(t,e){this.$message.warning("当前限制选择 1 个文件")},handleRemoveFj:function(t,e){this.fileListArr=[]},handleSuccess:function(t,e,n){console.log("上传成功",t,e,n),200==t.statusCode&&(this.form.filenamelist.push({localname:e.name,filename:t.data.filename}),this.$message({message:"上传成功",type:"success"}),console.log("上传成功的表单",this.form))}}},c={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container"},[n("el-card",{staticClass:"filter-container",attrs:{shadow:"never"}},[n("div",[n("i",{staticClass:"el-icon-search"}),t._v(" "),n("span",[t._v("筛选搜索")]),t._v(" "),n("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",size:"small"},on:{click:function(e){t.queryList()}}},[t._v("\n        查询结果\n      ")]),t._v(" "),n("el-button",{staticStyle:{float:"right","margin-right":"15px"},attrs:{size:"small"},on:{click:function(e){t.reset()}}},[t._v("\n        重置\n      ")])],1),t._v(" "),n("div",{staticStyle:{"margin-top":"15px"}},[n("el-form",{attrs:{inline:!0,model:t.listQuery,size:"small","label-width":"140px"}},[n("el-form-item",{attrs:{label:"输入搜索："}},[n("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"关键字"},model:{value:t.listQuery.keyword,callback:function(e){t.$set(t.listQuery,"keyword",e)},expression:"listQuery.keyword"}})],1)],1)],1)]),t._v(" "),n("el-card",{staticClass:"operate-container",attrs:{shadow:"never"}},[n("i",{staticClass:"el-icon-tickets"}),t._v(" "),n("span",[t._v("数据列表")]),t._v(" "),n("el-button",{staticClass:"btn-add",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",size:"mini"},on:{click:function(e){t.formShow=!0}}},[t._v("\n      添加\n    ")]),t._v(" "),n("el-button",{staticClass:"btn-add",attrs:{type:"primary",size:"mini"},on:{click:t.upbalance}},[t._v("\n      更新全部余额\n    ")])],1),t._v(" "),n("div",{staticClass:"table-container"},[n("el-table",{ref:"list",staticStyle:{width:"100%"},attrs:{data:t.list,border:"",stripe:""},on:{"selection-change":t.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",align:"center",width:"40"}}),t._v(" "),n("el-table-column",{attrs:{type:"index",align:"center",width:"40",label:"#"}}),t._v(" "),n("el-table-column",{attrs:{label:"ZID","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.zid))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"ZH","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.zh))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"当天充值上限(元)","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(Math.floor(e.row.quota/100*100)/100))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"充值中的额度(元)","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(Math.floor(e.row.quota_temp/100*100)/100))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"充值成功总额(元)","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(Math.floor(e.row.quota_total/100*100)/100))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"账号余额(元)","min-width":"5%",sortable:!0,"sort-method":t.sortByDate,prop:"balance"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",{class:Number(e.row.balance)/100==0?"zero":Number(e.row.balance)/100<100?"bai":"jibai"},[t._v(t._s(Number(e.row.balance)/100))])]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"启用状态","min-width":"5%"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-switch",{attrs:{"active-value":1,"inactive-value":0,"active-color":"#13ce66","inactive-color":"#ff4949"},nativeOn:{click:function(n){t.editSwitch(e.row)}},model:{value:e.row.enable,callback:function(n){t.$set(e.row,"enable",n)},expression:"scope.row.enable"}})]}}])}),t._v(" "),n("el-table-column",{staticClass:"operation",attrs:{label:"操作",fixed:"right",align:"center",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("div",{staticClass:"btnbodyhang"},[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){t.upquota(e.row.zid)}}},[t._v("修改额度")]),t._v(" "),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){t.upcookie(e.row.zid)}}},[t._v("CK")])],1),t._v(" "),n("div",{staticClass:"btnbodyhang"},[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(n){t.upquotaself(e.row.zid)}}},[t._v("更新余额")]),t._v(" "),n("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(n){t.del(e.row)}}},[t._v("删除")])],1)]}}])})],1)],1),t._v(" "),n("div",{staticClass:"batch-operate-container"},[n("el-select",{attrs:{size:"small",placeholder:"批量操作"},model:{value:t.operateType,callback:function(e){t.operateType=e},expression:"operateType"}},t._l(t.operates,function(t){return n("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),t._v(" "),n("el-button",{staticClass:"search-button",staticStyle:{"margin-left":"20px"},attrs:{type:"primary",size:"small"},on:{click:function(e){t.handleBatchOperate()}}},[t._v("\n      确定\n    ")])],1),t._v(" "),n("div",{staticClass:"pagination-container"},[n("el-pagination",{attrs:{background:"",layout:"total, sizes,prev, pager, next,jumper","page-size":t.listQuery.pageSize,"page-sizes":[50,100,200],"current-page":t.listQuery.pageNum,total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange,"update:currentPage":function(e){t.$set(t.listQuery,"pageNum",e)}}})],1),t._v(" "),n("el-dialog",{attrs:{title:"添加保存数据",visible:t.formShow,"before-close":t.formBeforClose,close:t.formClose,width:"40%"},on:{"update:visible":function(e){t.formShow=e}}},[n("el-form",{ref:"selfForm",attrs:{model:t.form,rules:t.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"账号文件",prop:"file"}},[n("div",[t._v("格式:一行一个cookie")]),t._v(" "),n("el-upload",{ref:"scfj",attrs:{"file-list":t.fileListArr,action:t.upfilehost,accept:".txt,.csv","before-upload":t.beforeUploadFj,"on-exceed":t.handleExceedFj,"on-remove":t.handleRemoveFj,multiple:"",limit:10,headers:t.headers,"auto-upload":!0,"on-success":t.handleSuccess}},[n("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[t._v("选取文件")])],1)],1)],1),t._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.formShow=!1}}},[t._v("取 消")]),t._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(e){t.handleSave("selfForm")}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var u=n("VU/8")(r,c,!1,function(t){n("5b2i")},null,null);e.default=u.exports}});