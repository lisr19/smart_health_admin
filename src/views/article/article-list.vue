<style>

</style>
<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">文章列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openArticleAdd" style="width: 100px;">添加</Button>
                </Col>
                <Col span="4" offset="7">
                    <Select clearable @on-change="handleSearchByType" filterable placeholder="选择文章类型">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="1">
                    <Input v-model="search_data.title" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入标题搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="articleData" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <modal v-model="isLabel" title="编辑文章标签" @on-cancel="doCancelByArticleLabelEdit" width="600">
            <Card>
                <p slot="title">添加文章标签</p>
                <Row>
                    <Col span="12">
                        <Cascader ref="articleLabelForm" :data="labelData" v-model="articleLabelForm.labelCas"></Cascader>
                    </Col>
                    <Col span="4" offset="1">
                        <Button type="primary" @click="doLabelAdd">添加</Button>
                    </Col>
                </Row>

            </Card>
            <Card>
                <p slot="title">已有文章标签</p>
                <Tag type="border" closable color="blue" v-for="(item,index) in articleLabelForm.labelArray" :key="item.id" :name="item.content" @on-close="doLabelDel(item.id,index)">{{item.content}}</Tag>
            </Card>
            <div slot="footer">
                <Button type="text" @click="doCancelByArticleLabelEdit">取消</Button>
            </div>
        </modal>
        <!--文章添加/编辑页面组件插入-->
        <articleAdd ref="articleAdd" @refreshArticleList="getArticleList" :typeList="typeList" />
        <articleEdit ref="articleEdit" @refreshArticleList="getArticleList" :typeList="typeList" />
        <textEditor ref="textEditor"/>
        <article-push ref="articlePush"/>
    </div>
</template>

<script>
    import articleAdd from './article-add.vue';
    import articleEdit from './article-edit.vue';
    import textEditor from '../my-components/text-editor/text-editor';
    import {findArticleList, delArticle, editArticle,addLabel,delLabel} from '@/libs/API/article.js';
    import {findLabelList} from "@/libs/API/label";
    import {articleType} from "@/libs/articleType";
    import util from '@/libs/util.js';
    import ArticlePush from "./article-push";

    export default {
        name: "article-list",
        components: {
            ArticlePush,
            articleAdd,
            articleEdit,
            textEditor
        },
        data() {
            return {
                isAdd:false,
                isLabel:false,
                //文章表头数组
                columnsList: [
                    {
                        title: '标题',
                        align: 'center',
                        key: 'title',
                    },
                    {
                        title: '发布状态',
                        align: 'center',
                        key: 'status',
                        render: (h,params) => {
                            return h('i-switch', {
                                props:{
                                    value: params.row.status === 1,
                                },
                                on:{
                                    'on-change':(v) => {//触发on-change事件
                                        // console.log(params.row);
                                        if(v){
                                            params.row.status = 1;
                                        }
                                        else{
                                            params.row.status = 2;
                                        }
                                        let data = Object.assign({},params.row);
                                        this.doArticleEdit(data);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type',
                        render:(h,params)=>{
                            let label = ''
                            this.typeList.forEach((v)=>{
                                if(params.row.type === v.value){
                                    label = v.label
                                }
                            })
                            return h('span', label)
                        }
                    },
                    {
                        title: '标签',
                        align: 'center',
                        key: 'label',
                        render:(h,params)=>{
                            let labels = ''
                            let array = params.row.labels
                            if(Array.isArray(array) && array.length>0){
                                array.forEach((v)=>{
                                    if(labels){
                                        labels = labels + ',' +v.content
                                    }else{
                                        labels = v.content
                                    }
                                })
                            }else{
                                labels = '无'
                            }
                            return h('span', labels)
                        }
                    },
                    {
                        title: '作者',
                        align: 'center',
                        key: 'author',
                    },
                    {
                        title: '日期',
                        align: 'center',
                        key: 'date',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 350,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = Object.assign({},params.row);
                                            this.openArticlePush(data);
                                            //window.open(params.row.url);
                                            //window.location.href=params.row.url;
                                        }
                                    }
                                }, '推送'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = Object.assign({},params.row);
                                            this.openTextEditor(data);
                                            //window.open(params.row.url);
                                            //window.location.href=params.row.url;
                                        }
                                    }
                                }, '富文本'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = {
                                                articleId:params.row.id,
                                                labelArray: params.row.labels
                                            }
                                            this.openArticleLabelEdit(data);
                                        }
                                    }
                                }, '标签'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = Object.assign({},params.row);
                                            this.openArticleEdit(data);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({  // 打开确认对话框
                                                content: '<p>确定删除吗？</p>',
                                                // 确认删除
                                                onOk: () => {
                                                    let id = {id: params.row.id.toString()};
                                                    this.doArticleDel(id);
                                                },
                                                // 取消删除
                                                onCancel: () => {
                                                    this.$Message.info('取消删除！');
                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                articleData: [],//系统用户列表数据（后台获取）
                articleAddForm:{},
                typeList:[],
                articleLabelForm:{
                    labelId: 0,//标签
                    labelArray:[],//已经添加的标签数组
                    labelCas:[]//标签级联数组
                },
                labelData:[],//标签数组（后台获取）
                search_data: {},//搜索文章
                searchOption: {},//系统用户传到后台的对象
                page: {//系统用户翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //系统用户信息列表获取
            async getArticleList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.title = params.title;
                    data.type = params.type;
                    data.page=params.page;
                }
                let res = await findArticleList(data);
                // console.log(res);
                if (!res.code) {
                    this.articleData = res.data.data;
                    this.page.total = res.data.total;
                } else {
                    this.$Message.error(res.msg);
                }
            },
            //获取标签列表
            async getLabelList(){
                let res = await findLabelList({limit:1000})
                // console.log(res)
                if(!res.code){
                    this.labelData = util.array2tree(v => {
                        v.label = v.content
                        v.value = v.id
                    }, res.data)
                }else{
                    this.$Message.error(res.msg)
                }
            },
            //用户删除
            async doArticleDel(params) {
                let data = {};
                data.id = params.id;
                let res = await delArticle(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getArticleList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },
            //文章标签添加
            async doLabelAdd(){
                let array = this.articleLabelForm.labelCas
                let ref = this.$refs.articleLabelForm.selected[array.length-1].content
                let form = {
                    labelId:array[array.length-1],
                    articleId : this.articleLabelForm.articleId
                }
                let res = await addLabel(form)
                if(!res.code){
                    this.$Message.success('添加成功')
                    this.articleLabelForm.labelArray.push({id:array[array.length-1],content:ref})
                    this.articleLabelForm.labelCas = []
                }else{
                    this.$Message.error(res.msg)
                }
            },
            //文章标签删除
            async doLabelDel(labelId,index){
                // console.log('标签',labelId,'位置',index)
                let data = {
                    labelId : labelId,
                    articleId : this.articleLabelForm.articleId
                }
                let res = await delLabel(data)
                if(!res.code){
                    this.$Message.success('删除成功')
                    this.articleLabelForm.labelArray.splice(index,1)
                }else{
                    this.$Message.error(res.msg)
                }
            },
            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getArticleList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openArticleAdd() {
                this.$refs.articleAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openArticleEdit(params) {
                this.$refs.articleEdit.isEdit = true
                this.$refs.articleEdit.articleEditForm = params
                this.$refs.articleEdit.changeText(params.content)
            },
            openTextEditor(params) {
                this.$refs.textEditor.isShow = true;
                this.$refs.textEditor.articleData=params;
                this.$refs.textEditor.changeText(params.content);
            },
            openArticlePush(params) {
                this.$refs.articlePush.isPush = true;
                this.$refs.articlePush.articleId=params.id;
            },
            openArticleLabelEdit(params){
                this.articleLabelForm = params
                this.isLabel = true
            },
            doCancelByArticleLabelEdit(){

                this.isLabel = false
            },
            //系统用户表搜索（根据姓名或者手机）
            handleSearch(params) {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.title= this.search_data.title;
                    this.searchOption.page = 1;// 初始化搜索页数
                } else {//重置该搜索内容
                    this.searchOption.title='';
                }
                this.getArticleList(this.searchOption);
            },
            //系统用户表筛选（根据用户类型）
            handleSearchByType(params) {
                if (params) {//判断搜索条件是否为空
                    this.searchOption.type = params;
                    this.searchOption.page = 1;// 初始化搜索页数
                } else {//重置该搜索内容
                    this.searchOption.type = '';
                }
                this.getArticleList(this.searchOption);
            },
            // 修改状态
            async doArticleEdit(params){
                let form={};
                form.id=params.id;
                form.status=params.status;
                form.type=params.type;
                form.url=params.url;
                let res=await editArticle(form);
                if(!res.code){
                    this.$Message.success('修改成功');
                    // this.adData[params.index].status=params.status==1?1:2;
                }else{
                    this.$Message.error(res.msg);
                    this.getArticleList();
                }
            },

        },

        created(){
            //页面被打开时获取数据
            this.getArticleList()
            this.getLabelList()
            this.typeList = articleType
        },
    }
</script>

<style scoped>

</style>
