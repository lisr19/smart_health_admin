<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">动态资源列表</p>
            <Row :gutter="5">
                <Col span="12">
                    <Button type="primary" @click="batchCheck" style="width: 100px">批量审核</Button>
                </Col>
                <Col span="4">
                    <Button type="primary" style="width: 46%;" @click="doStatus">已审核列表</Button>
                    <Button type="primary" style="width: 46%;float:right;margin-right:5%" @click="doStatus2">待审核列表</Button>
                    <!--<Select v-model="status" placeholder="状态筛选" @on-change="doStatus" clearable>-->
                        <!--<Option v-for="item in statuslist" :value="item.value" :key="item.value">-->
                            <!--{{ item.label }}-->
                        <!--</Option>-->
                    <!--</Select>-->
                </Col>
                <Col span="2">
                    <Select v-model="type" placeholder="类型筛选" @on-change="doType" clearable>
                        <Option v-for="item in typelist" :value="item.value" :key="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </Col>
                <Col span="2">
                    <Select v-model="source" placeholder="来源筛选" @on-change="doSource" clearable>
                        <Option v-for="item in sourcelist" :value="item.value" :key="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Input v-model="name" @on-change="doName" icon="search" placeholder="请输入节点名称搜索..." clearable/>
                </Col>
            </Row>
        </Card>

        <!--表格部分-->
        <Row>
            <Col span="24">
                <Card>
                    <div>
                        <Table :columns="columnsList" :data="dynamicData"  @on-selection-change="batchSelect" border></Table>
                    </div>
                    <div style="margin: 10px;overflow: hidden">
                        <div style="float: right;">
                            <Page show-total show-elevator :total="page.count" :current="parseInt(page.currentPage)" :page-size="page.pageSize"
                                  @on-change="changePage"></Page>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
    
</template>

<script>
    import {getDynamicList, checkDynamic, UpdateStatus, UpdateManyStatus} from "../../libs/API/resource";

    export default {
        name: "resource-dynamic",
        data(){
            return{
                selIndex:[],//批量选择的index
                show_img:0,
                selTypes:'',//批量选择的source_type
                selIds:'',// 批量选择的id
                statuslist:[//状态筛选数组
                    {
                        value:0,
                        label:'待审核'
                    },
                    {
                        value:1,
                        label:'已审核'
                    }
                ],

                typelist:[//类型筛选数组
                    {
                      value:3,
                      label:'文件'
                    },
                    {
                        value:1,
                        label:'图片',
                    },
                    {
                        value:2,
                        label:'视频',
                    }
                ],

                sourcelist:[//来源筛选数组
                    {
                        value:1,
                        label:'物流'
                    },
                    {
                        value:2,
                        label:'公共'
                    },
                    {
                        value:3,
                        label:'柜码'
                    },
                    {
                        value:4,
                        label:'链路'
                    }
                ],

                status:'', //状态筛选绑定值
                type:'',//类型筛选绑定值
                name:'',//节点名称搜索绑定值
                source:'',//来源筛选绑定值
                dynamicData:[],//表格数据数组
                page: {//翻页对象
                    currentPage: 1,
                },
                searchOption: {},//传参到后台的对象
                columnsList:[//表头数组
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },

                    {
                        title:'类型',
                        align:"center",
                        key:"type_id"
                    },

                    {
                        title:'内容',
                        align:"center",
                        key:"content",
                        render: (h, params) => {
                            if(params.row.content){
                                let texts = '';//表格列显示文字
                                if (params.row.content) {
                                    if (params.row.content.length > 13) {//进行截取列显示字数
                                        texts = params.row.content.substring(0, 13) + ".....";
                                    } else {
                                        texts = params.row.content;
                                    }
                                }
                                return h('p', [
                                    h('Poptip', {
                                        props: {
                                            trigger:"hover",
                                            placement: 'top',
                                        },
                                    }, [//这个中括号表示是Poptip标签的子标签
                                        texts,//表格列显示文字
                                        h('p', {
                                            slot: 'content',
                                            style: {
                                                maxWidth:'300px',
                                                fontSize:'14px',
                                                whiteSpace: 'normal'
                                            },
                                        }, params.row.content)//整个的信息即气泡内文字
                                    ])
                                ])
                            }else{
                                return h('span',[
                                    params.row.content ? params.row.content: '无'
                                ])
                            }
                        }

                    },
                    {
                        title:'资源',
                        align:"center",
                        key:"url",
                        render:(h,params) => {
                            if(params.row.type_id=='图片'){
                                return h('img',{
                                    style:{
                                        margin: '5px',
                                        display: 'inline-block',
                                        height: '40px',
                                        width: '40px',
                                        cursor:'pointer'
                                    },

                                    attrs:{
                                        src:params.row.url,
                                    },

                                    on:{
                                        click:() =>{

                                            this.$Modal.info({
                                                width:600,
                                                title:'查看资源',
                                                // closable:true,
                                                render:(h) =>{
                                                    // console.log(h);
                                                    return h('img',{
                                                        style:{
                                                            marginTop:'10px',
                                                            maxWidth:'90%',
                                                        },

                                                        attrs:{
                                                            src:params.row.url,
                                                        },

                                                    })

                                                }
                                            })

                                        }
                                    }
                                })
                            }

                            else if(params.row.type_id=='视频'){
                                return h('img',{
                                    style:{
                                        margin: '5px',
                                        display: 'inline-block',
                                        height: '40px',
                                        // width: '40px',
                                        cursor:'pointer'
                                    },

                                    attrs:{
                                        src:params.row.url+'?vframe/jpg/offset/0',
                                    },

                                    on:{
                                        click:() =>{
                                            this.$Modal.info({
                                                width:600,
                                                title:'查看资源',
                                                // closable:true,
                                                render:(h) =>{
                                                    return h('video',{
                                                        style:{
                                                            marginTop:'10px',
                                                            maxWidth:'90%',
                                                        },

                                                        attrs:{
                                                            src:params.row.url,
                                                            controls:true,
                                                            autoplay:true,
                                                        },
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            else{
                                return h('a',{
                                    attrs:{
                                        href:params.row.url
                                    }
                                },'资质文件')
                            }

                        }
                    },

                    {
                        title:'所属节点',
                        align:"center",
                        key:'node_name',
                    },

                    {
                      title:'来源',
                      align:'center',
                      key:'source_typestr',
                    },

                    {
                        title:'添加时间',
                        align:"center",
                        key:'add_time',
                    },

                    {
                        title:'状态',
                        align:'center',
                        key:'status',
                        render:(h,params) =>{
                            return h('div',[
                                h('span',{
                                    style:{
                                        marginRight: '5px'
                                    },
                                },`${params.row.status===1?'已':'待'}审核`),

                                h('i-switch',{
                                    props:{
                                        value: params.row.status ===1?true:false,
                                    },
                                    on:{
                                        'on-change':(v)=>{
                                            let id = {id:params.row.id,status:v?1:0,source_type:params.row.source_type};
                                            this.UpdateStatus(id,params.index);
                                            // console.log('index',params.index);
                                            // console.log('row',params.row);
                                        }
                                    }
                                })
                            ])
                        }
                    }]
            }
        },

        methods:{

            //获取动态资源列表
            async getDynamicList(params){
              let res = await getDynamicList(params).catch(err => {
                  return false
              });
              // console.log(res);
                if(res){
                    if(!res.errno){
                        if(res.data.data){
                            this.dynamicData=res.data.data;
                            this.dynamicData.forEach((v,index) =>{
                                v.index=index;//添加index字段，用于批量审核
                                if(v.type_id==3){
                                    v.type_id='文件';
                                }
                                else if(v.type_id==1){
                                    v.type_id='图片';
                                }
                                else if(v.type_id==2){
                                    v.type_id='视频'
                                }

                                if(v.source_type==1){
                                    v.source_typestr='物流';
                                }
                                else if(v.source_type==2){
                                    v.source_typestr='公共';
                                }
                                else if(v.source_type==3){
                                    v.source_typestr='柜码';
                                }
                                else if(v.source_type==4){
                                    v.source_typestr='链路';
                                }
                            })
                            // console.log(this.dynamicData);
                            this.page = res.data;
                        }else {
                            console.log('获取动态资源信息失败！');
                        }
                    }else{
                        this.$Message.error('获取动态资源信息失败！')

                    }
                }else{
                    this.$Notice.error({
                        title:'网络错误^_^'
                    });
                }


            },

            //修改资源状态
            async UpdateStatus(params,index){
                let res=await UpdateStatus(params).catch(err=>{
                    return false;
                });
                if(res){
                    if(!res.errno){
                        this.$Message.success('修改成功');
                        this.dynamicData[index].status=params.status;

                    }else{
                        this.$Message.error('修改失败');
                        this.dynamicData[index].status=!params.status;
                        // this.getDynamicList();
                    }
                    // let order={order_by_status:''}
                }else{
                    this.$Notice.error({
                        title:'网络错误^_^'
                    });
                }
            },
            doStatus(){//状态筛选（获取已审核列表）
               // console.log('+++++++++++++++++++++++++++');
               // console.log(v);
               //判断其他三个搜索条件是否为空
               // if(this.type>=0){
               //     this.searchOption.type_id=this.type;
               // }
               //  if(this.source>=0){
               //      this.searchOption.source_type=this.source;
               //  }
               // if(this.name){
               //     this.searchOption.name=this.name;
               // }
               // if(v>=0){
               this.searchOption.status= 1;
               // this.searchOption.page = 1;// 初始化搜索页数
               // console.log(this.searchOption);
               this.getDynamicList(this.searchOption);
               // }else{
               //     delete this.searchOption.status;//若点击清空记得要清除该属性再去请求
               //     // console.log('点击清空时的',this.searchOption);
               //     this.getDynamicList(this.searchOption);
               // }
            },
            doStatus2(){//获取未审核列表
                // if(this.type>=0){
                //     this.searchOption.type_id=this.type;
                // }
                // if(this.source>=0){
                //     this.searchOption.source_type=this.source;
                // }
                // if(this.name){
                //     this.searchOption.name=this.name;
                // }
                // if(v>=0){
                this.searchOption.status= 0;
                // this.searchOption.page = 1;// 初始化搜索页数
                // console.log(this.searchOption);
                this.getDynamicList(this.searchOption);
            },
            doType(v){//类型筛选
                //判断其他三个搜索条件是否为空
                // if(this.status>=0){
                //     this.searchOption.status=this.status;
                // }
                // if(this.source>=0){
                //     this.searchOption.source_type=this.source;
                // }
                // if(this.name){
                //     this.searchOption.name=this.name;
                // }
                if(v>=0){
                    this.searchOption.type_id=v;
                    this.searchOption.page = 1;// 初始化搜索页数
                    // console.log(this.searchOption);
                    this.getDynamicList(this.searchOption);
                }else{
                    delete this.searchOption.type_id;//若点击清空记得要清除该属性再去请求
                    // console.log('点击清空时的',this.searchOption);
                    this.getDynamicList(this.searchOption);
                }
            },
            doSource(v){//来源筛选
                // console.log(v);
                // if(this.name){
                //     this.searchOption.name=this.name;
                // }
                // if(this.status>=0){
                //     this.searchOption.status=this.status;
                // }
                // if(this.type>=0){
                //     this.searchOption.type_id=this.type;
                // }
                if(v>=0){
                    this.searchOption.source_type=v;
                    this.searchOption.page = 1;// 初始化搜索页数
                    // console.log(this.searchOption);
                    this.getDynamicList(this.searchOption);
                }else{
                    delete this.searchOption.source_type;//若点击清空记得要清除该属性再去请求
                    // console.log('点击清空时的',this.searchOption);
                    this.getDynamicList(this.searchOption);
                }
            },
            doName(){//节点名字筛选
                //判断其他三个搜索条件是否为空
                // if(this.status>=0){
                //     this.searchOption.status=this.status;
                // }
                // if(this.type>=0){
                //     this.searchOption.type_id=this.type;
                // }
                // if(this.source>=0){
                //     this.searchOption.source_type=this.source;
                // }
                if(this.name){
                    this.searchOption.name=this.name;
                    this.searchOption.page = 1;// 初始化搜索页数
                    // console.log(this.searchOption);
                    this.getDynamicList(this.searchOption);
                }else{
                    delete this.searchOption.name;//若点击清空记得要清除该属性再去请求
                    // console.log('点击清空时的',this.searchOption);
                    this.getDynamicList(this.searchOption);
                }
            },


            //翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getDynamicList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },

            // 批量选择
            batchSelect(selection){
                this.selIndex=[];
                this.selTypes='';
                this.selIds='';
                // console.log(selection);
                selection.forEach(row =>{
                    this.selIndex.push(row.index);
                    if(this.selIds===''){
                        this.selIds = row.id.toString();
                    }else {
                        this.selIds = this.selIds+','+row.id;
                    }
                    if(this.selTypes===''){
                        this.selTypes = row.source_type.toString();
                    }else{
                        this.selTypes = this.selTypes+','+row.source_type;
                    }
                })
                // console.log('selIds',this.selIds);
                // console.log('selTypes',this.selTypes);
                // console.log('selIndex',this.selIndex);
            },

            batchCheck(){//批量审核
                if(this.selIds){
                    this.$Modal.confirm({
                        content:'<p>确定审核吗？</p>',
                        onOk: async ()=>{
                            let ids={ids:this.selIds,types:this.selTypes};
                            let res=await UpdateManyStatus(ids).catch(err =>{
                                return false;
                            });
                            // console.log(res);
                            if(res){
                                if(!res.errno){
                                    this.$Message.success('审核成功');
                                    this.selIndex.forEach(v=>{
                                        this.dynamicData[v].status=1;
                                    })
                                    // this.getDynamicList();
                                }else{
                                    this.$Message.error(res.errmsg);
                                    // this.getDynamicList();
                                }
                                this.selIds='';
                                this.selTypes='';
                            }else{
                                this.$Notice.error({
                                    title:'网络错误^_^'
                                });
                            }

                        },
                        // 取消
                        onCancel: () => {
                            this.$Message.info('取消删除！');
                            return
                        }
                    })
                }else{
                    this.$Message.info('请选择需要审核的资源！');
                }
            },
        },

        created(){
            //初始化获取数据
            this.getDynamicList();
        },
    }

</script>

<style scoped>

</style>