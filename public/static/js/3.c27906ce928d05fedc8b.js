webpackJsonp([3],{"9bBU":function(e,t,l){l("mClu");var n=l("FeBl").Object;e.exports=function(e,t,l){return n.defineProperty(e,t,l)}},C4MV:function(e,t,l){e.exports={default:l("9bBU"),__esModule:!0}},CymK:function(e,t){},DaAP:function(e,t,l){"use strict";t.c=function(e){return Object(i.a)({url:"/top-order/list",method:"get",params:e})},t.a=function(e){var t;return Object(i.a)((t={url:"/top-order/checkorder",method:"post"},a()(t,"method","get"),a()(t,"params",e),t))},t.b=function(e){return Object(i.a)({url:"/top-order/deleteorder",method:"post",data:e})};var n=l("bOdI"),a=l.n(n),i=l("vLgD")},bOdI:function(e,t,l){"use strict";t.__esModule=!0;var n,a=l("C4MV"),i=(n=a)&&n.__esModule?n:{default:n};t.default=function(e,t,l){return t in e?(0,i.default)(e,t,{value:l,enumerable:!0,configurable:!0,writable:!0}):e[t]=l,e}},mClu:function(e,t,l){var n=l("kM2E");n(n.S+n.F*!l("+E39"),"Object",{defineProperty:l("evD5").f})},xlyE:function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=l("woOf"),a=l.n(n),i=l("DaAP"),o=l("ZlPB"),s=l("oqQY"),r=l.n(s),c={keyword:null,zid:null,zhmark:null,channel:null,queryType:null,dateArray:[r()().format("YYYY-MM-DD 00:00:00"),r()().format("YYYY-MM-DD 23:59:59")],merchant_id:null,pageNum:1,pageSize:20,total:null,uid:null,channelsub:null},u={name:"home",data:function(){return{loading:!1,dayjs:r.a,upfilehost:"",fileListArr:[],channelsuboptions:[],formShow:!1,form:{filenamelist:[]},rules:{name:[{required:!0,message:"请输入类型名称",trigger:"blur"}]},listQuery:a()({},c),total:0,options:[{value:1,label:"成功"},{value:2,label:"支付中"},{value:-1,label:"失败/超时"}],channeloptions:[{value:1,label:"QQ"},{value:2,label:"VX"}],list:[],multipleSelection:[],operateType:null,operates:[{label:"批量删除",value:"alldel"}]}},beforeCreate:function(){},created:function(){this.upfilehost=this.$upfilehost,this.getlist(),this.getclist()},beforeMount:function(){},mounted:function(){},beforeUpdate:function(){},updated:function(){},comments:function(){},methods:{reset:function(){this.listQuery=a()({},{keyword:null,zid:null,zhmark:null,channel:null,queryType:null,dateArray:[],merchant_id:null,pageNum:1,pageSize:20,total:null})},getclist:function(){var e=this;Object(o.b)({pageNum:1,pageSize:999}).then(function(t){e.channelsuboptions=t.data.list})},dateArrayChange:function(e){this.getlist()},copySecret:function(e,t){var l=document.createElement("input");l.value=e,document.body.appendChild(l),l.select();document.execCommand("copy"),this.$message({type:"success",message:["复制 商户订单号 成功","复制 系统订单号 成功","复制 平台订单号 成功","复制 支付链接 成功","复制 账号编码 成功"][t]}),document.body.removeChild(l)},getlist:function(){var e=this;Object(i.c)(this.listQuery).then(function(t){console.log("获取数据",t),e.list=t.data.list,e.total=t.data.total,e.quotatotal=t.data.quotatotal})},isedit:function(){return!1},queryList:function(){console.log(this.listQuery),this.getlist()},del:function(e){var t=this;this.$confirm("是否要进行该操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(i.b)({tid:e.tid,merchant_id:e.merchant_id}).then(function(e){"ok"==e.data?(t.$message({message:"删除成功",type:"success"}),t.getlist()):t.$message({message:e.data.msg,type:"error"})})})},edit:function(e){this.form=e,this.formShow=!0},doublecheck:function(e,t){var l=this;this.loading=!0,2==t?this.$confirm("是否要进行该强制回调操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(i.a)({tid:e.tid,action:t,merchant_id:e.merchant_id}).then(function(e){e.data.code,l.$message({message:"强制回调成功",type:"success",duration:1e3}),l.getlist(),l.loading=!1})}).catch(function(){l.loading=!1}):Object(i.a)({tid:e.tid,action:t,merchant_id:e.merchant_id}).then(function(e){e.data.code,l.$message({message:1==e.data.code?"支付到账":"支付未到账",type:1==e.data.code?"success":"warning",duration:1e3}),l.getlist(),l.loading=!1})},forminit:function(){this.form={filenamelist:[]},this.fileListArr=[]},handleSave:function(e){var t=this,l=this;this.$refs[e].validate(function(e){if(!e)return console.log("错误提交请检查数据!!"),!1;console.log(l.form),topcreatebyfile(l.form).then(function(e){t.forminit(),t.formShow=!1,t.getlist()})})},formBeforClose:function(e){var t=this;this.$confirm("确认关闭？").then(function(l){t.forminit(),e()}).catch(function(e){})},formClose:function(e){this.forminit(),e()},editSwitch:function(e){Number(!Boolean(e.is_show))},handleSelectionChange:function(e){this.multipleSelection=e},handleBatchOperate:function(){var e=this;null!=this.operateType?null==this.multipleSelection||this.multipleSelection.length<1?this.$message({message:"请选择要操作的商品",type:"warning",duration:1e3}):this.$confirm("是否要进行该批量操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){for(var t=[],l=0;l<e.multipleSelection.length;l++)t.push(e.multipleSelection[l].tid);switch(e.operateType){case"alldel":Object(i.b)({list:t}).then(function(t){"ok"==t.data?(e.$message({message:"删除成功",type:"success"}),e.getlist()):e.$message({message:t.data.msg,type:"error"})})}e.getlist()}):this.$message({message:"请选择操作类型",type:"warning",duration:1e3})},handleSizeChange:function(e){this.listQuery.pageNum=1,this.listQuery.pageSize=e,this.getlist()},handleCurrentChange:function(e){this.listQuery.pageNum=e,this.getlist()},beforeUploadFj:function(e){var t=e.name.substring(e.name.lastIndexOf(".")+1),l="txt"===t,n="csv"===t;return l||n||this.$message({message:"上传文件只能是 txt,csv!",type:"warning"}),l||n},handleExceedFj:function(e,t){this.$message.warning("当前限制选择 1 个文件")},handleRemoveFj:function(e,t){this.fileListArr=[]},handleSuccess:function(e,t,l){console.log("上传成功",e,t,l),200==e.statusCode&&(this.form.filenamelist.push({localname:t.name,filename:e.data.filename}),this.$message({message:"上传成功",type:"success"}),console.log("上传成功的表单",this.form))}}},d={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{staticClass:"app-container"},[l("el-card",{staticClass:"filter-container",attrs:{shadow:"never"}},[l("div",[l("i",{staticClass:"el-icon-search"}),e._v(" "),l("span",[e._v("筛选搜索")]),e._v(" "),l("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",size:"small"},on:{click:function(t){e.queryList()}}},[e._v("\n        查询结果\n      ")]),e._v(" "),l("el-button",{staticStyle:{float:"right","margin-right":"15px"},attrs:{size:"small"},on:{click:function(t){e.reset()}}},[e._v("\n        重置\n      ")])],1),e._v(" "),l("div",{staticStyle:{"margin-top":"15px"}},[l("el-form",{attrs:{inline:!0,model:e.listQuery,size:"small","label-width":"140px"}},[l("el-form-item",{attrs:{label:"订单搜索："}},[l("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"商户订单,平台订单,系统订单"},on:{change:e.getlist},model:{value:e.listQuery.keyword,callback:function(t){e.$set(e.listQuery,"keyword",t)},expression:"listQuery.keyword"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"商家号："}},[l("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"商家号"},on:{change:e.getlist},model:{value:e.listQuery.merchant_id,callback:function(t){e.$set(e.listQuery,"merchant_id",t)},expression:"listQuery.merchant_id"}})],1),e._v(" "),"admin"==e.$store.getters.roles?l("el-form-item",{attrs:{label:"代理uid："}},[l("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"代理uid"},on:{change:e.getlist},model:{value:e.listQuery.uid,callback:function(t){e.$set(e.listQuery,"uid",t)},expression:"listQuery.uid"}})],1):e._e(),e._v(" "),l("el-form-item",{attrs:{label:"zh/账号编码："}},[l("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"zh,账号编码"},on:{change:e.getlist},model:{value:e.listQuery.zid,callback:function(t){e.$set(e.listQuery,"zid",t)},expression:"listQuery.zid"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"账号备注："}},[l("el-input",{staticStyle:{width:"203px"},attrs:{placeholder:"账号备注"},on:{change:e.getlist},model:{value:e.listQuery.zhmark,callback:function(t){e.$set(e.listQuery,"zhmark",t)},expression:"listQuery.zhmark"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"支付通道:"}},[l("el-select",{attrs:{placeholder:"支付通道",clearable:""},on:{change:e.getlist},model:{value:e.listQuery.channel,callback:function(t){e.$set(e.listQuery,"channel",t)},expression:"listQuery.channel"}},e._l(e.channeloptions,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"支付通道子项:"}},[l("el-select",{attrs:{placeholder:"支付通道子项",clearable:""},on:{change:e.getlist},model:{value:e.listQuery.channelsub,callback:function(t){e.$set(e.listQuery,"channelsub",t)},expression:"listQuery.channelsub"}},e._l(e.channelsuboptions,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.label}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"支付状态："}},[l("el-select",{attrs:{placeholder:"全部",clearable:""},on:{change:e.getlist},model:{value:e.listQuery.queryType,callback:function(t){e.$set(e.listQuery,"queryType",t)},expression:"listQuery.queryType"}},e._l(e.options,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"日期选择:"}},[l("el-date-picker",{attrs:{type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd HH:mm:ss"},on:{change:e.dateArrayChange},model:{value:e.listQuery.dateArray,callback:function(t){e.$set(e.listQuery,"dateArray",t)},expression:"listQuery.dateArray"}})],1)],1)],1)]),e._v(" "),l("el-card",{staticClass:"operate-container",attrs:{shadow:"never"}},[l("i",{staticClass:"el-icon-tickets"}),e._v(" "),l("span",[e._v("数据列表")]),e._v(" "),l("span",[e._v("金额合计:"+e._s(e.quotatotal/100))])]),e._v(" "),l("div",{staticClass:"batch-operate-container"},[l("el-select",{attrs:{size:"small",placeholder:"批量操作"},model:{value:e.operateType,callback:function(t){e.operateType=t},expression:"operateType"}},e._l(e.operates,function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),e._v(" "),l("el-button",{staticClass:"search-button",staticStyle:{"margin-left":"20px"},attrs:{type:"primary",size:"small"},on:{click:function(t){e.handleBatchOperate()}}},[e._v("\n      确定\n    ")])],1),e._v(" "),l("div",{staticClass:"pagination-container"},[l("el-pagination",{attrs:{background:"",layout:"total, sizes,prev, pager, next,jumper","page-size":e.listQuery.pageSize,"page-sizes":[20,50,100],"current-page":e.listQuery.pageNum,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.$set(e.listQuery,"pageNum",t)}}})],1),e._v(" "),l("div",{staticClass:"table-container"},[l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"list",staticStyle:{width:"100%"},attrs:{data:e.list,border:"",stripe:"","default-sort":{prop:"createdate"}},on:{"selection-change":e.handleSelectionChange}},[l("el-table-column",{attrs:{type:"selection",align:"center",width:"40"}}),e._v(" "),l("el-table-column",{attrs:{type:"index",align:"center",width:"40",label:"#"}}),e._v(" "),l("el-table-column",{attrs:{label:"商户号","min-width":"1"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[e._v(e._s(t.row.merchant_id))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"商户订单号","min-width":"4%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{on:{click:function(l){e.copySecret(t.row.mer_orderId,0)}}},[e._v(e._s(t.row.mer_orderId))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"系统订单号","min-width":"6%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{on:{click:function(l){e.copySecret(t.row.tid,1)}}},[e._v(e._s(t.row.tid))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"平台订单号","min-width":"7%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{on:{click:function(l){e.copySecret(t.row.merchant_id,2)}}},[e._v(e._s(t.row.oid))])]}}])}),e._v(" "),"admin"==e.$store.getters.roles?l("el-table-column",{attrs:{label:"ZH","min-width":"3%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[e._v(e._s(t.row.zh))])]}}])}):e._e(),e._v(" "),l("el-table-column",{attrs:{label:"账号编号","min-width":"4%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{on:{click:function(l){e.copySecret(t.row.zid,4)}}},[e._v(e._s(t.row.zid))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"金额","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[e._v(e._s(Number(t.row.quota)/100))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"创建时间","min-width":"5%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[e._v(e._s(e.dayjs(t.row.create_time).format("YYYY-MM-DD HH:mm:ss")))])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"回调状态","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[l("el-tag",{attrs:{type:t.row.call_back_info?"success":"danger"}},[e._v("\n              "+e._s(t.row.call_back_info?t.row.call_back_info:"未通知")+"\n            ")])],1)]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"支付状态","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-tag",{attrs:{type:t.row.err_info?"支付超时"!=t.row.err_info?"success":"warning":"danger"}},[e._v("\n            "+e._s(t.row.err_info?t.row.err_info:"未支付")+"\n          ")])]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"支付链接","min-width":"3%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",{on:{click:function(l){e.copySecret(t.row.pay_link,3)}}},[l("el-button",{attrs:{type:"primary",size:"mini"}},[e._v("点击复制")])],1)]}}])}),e._v(" "),l("el-table-column",{attrs:{label:"账号备注","min-width":"2%"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("span",[e._v(e._s(t.row.zhmark))])]}}])}),e._v(" "),l("el-table-column",{staticClass:"operation",attrs:{label:"操作",fixed:"right",align:"center",width:"240"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("div",{staticClass:"btnbodyhang"},[l("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(l){e.doublecheck(t.row,1)}}},[e._v("重新查单")]),e._v(" "),l("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(l){e.doublecheck(t.row,2)}}},[e._v("强制回调")])],1),e._v(" "),l("div",{staticClass:"btnbodyhang"},[l("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(l){e.del(t.row)}}},[e._v("删除")])],1)]}}])})],1)],1),e._v(" "),l("el-dialog",{attrs:{title:"添加保存数据",visible:e.formShow,"before-close":e.formBeforClose,close:e.formClose,width:"40%"},on:{"update:visible":function(t){e.formShow=t}}},[l("el-form",{ref:"selfForm",attrs:{model:e.form,rules:e.rules,"label-width":"120px"}},[l("el-form-item",{attrs:{label:"充值文件",prop:"file"}},[l("div",[e._v("格式:一行一个 账号----面额----订单id----支付链接")]),e._v(" "),l("el-upload",{ref:"scfj",attrs:{"file-list":e.fileListArr,action:e.upfilehost,accept:".txt,.csv","before-upload":e.beforeUploadFj,"on-exceed":e.handleExceedFj,"on-remove":e.handleRemoveFj,multiple:"",limit:10,"auto-upload":!0,"on-success":e.handleSuccess}},[l("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[e._v("选取文件")])],1)],1)],1),e._v(" "),l("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:function(t){e.formShow=!1}}},[e._v("取 消")]),e._v(" "),l("el-button",{attrs:{type:"primary"},on:{click:function(t){e.handleSave("selfForm")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var f=l("VU/8")(u,d,!1,function(e){l("CymK")},null,null);t.default=f.exports}});