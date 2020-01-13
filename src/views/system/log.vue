<template>
    <div>
        <Card>
            <p slot="title">系统日志</p>
            <Row>
                <Col>
                    <DatePicker type="date"  @on-change="handleSearchByTime" :options="dateOption" split-panels placeholder="请选择日期" ></DatePicker>
                </Col>
            </Row>
        </Card>
        <Card>
            <!--表格部分-->
            <div>
                <Table :columns="columnsList" :data="logData"  border disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.count" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import {getLogList} from "../../libs/API/log";

    export default {
        name: 'log',
        data () {
            return {
                dateOption:{//日期组件功能选项
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                //日志列表表头
                columnsList: [
                    {
                        title: '时间',
                        align: 'center',
                        width:300,
                        render:(h,params) => {
                            return h('p',params.row.date);
                        }
                    },
                    {
                        title: '用户',
                        align: 'center',
                        width:300,
                        render:(h,params) => {
                            if(params.row.content){
                                let array = params.row.content.split('-');
                                // console.log('1',array);
                                return h('p',array[0]);
                            }
                        }
                    },
                    {
                        title: '内容',
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.content){
                                let texts = '';//表格列显示文字
                                let array = params.row.content.split('-');
                                let str = array[1]
                                if (str) {
                                    if (str > 80) {//进行截取列显示字数
                                        texts = str.substring(0, 80) + ".....";
                                    } else {
                                        texts = str;
                                    }
                                }
                                return h('p', [
                                    h('Poptip', {
                                        props: {
                                            trigger:"hover",
                                            placement: 'top',
                                        },
                                    }, [//这个中括号表示是Tooltip标签的子标签
                                        texts,//表格列显示文字
                                        h('p', {
                                            slot: 'content',
                                            style: {
                                                maxWidth:'300px',
                                                fontSize:'14px',
                                                whiteSpace: 'normal'
                                            },
                                        }, str)//整个的信息即气泡内文字
                                    ])
                                ])
                            }else{
                                return h('span',[
                                    params.row.content === ''? '无':params.row.content
                                ])
                            }
                        }
                    },
                ],

                logData:[],//日志列表数据（后台获取）
                searchOption:{},//搜索对象
                page: {//翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },

        methods: {
            //获取日志列表数据
            async getLogList(params){
                this.logData = [];
                let res = await getLogList(params);
                if(!res.errno){
                    res.data.data.forEach(v=>{
                        if(v.level === 'WARN'){
                            this.logData.push(v);
                        }else{
                            res.data.count --;
                        }
                    });
                    this.page = res.data;
                }else{
                    console.log(res.errmsg);
                }
            },
            //翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getLogList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //根据日期获取动态信息列表
            handleSearchByTime(params){
                if (params) {//判断搜索条件是否为空
                    this.searchOption.date = params;
                    // this.searchOption.page = 1; // 初始化页数
                    this.getLogList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.date = '';
                    this.getLogList(this.searchOption);//为空则查询所有内容
                }
            },
        },

        created() {
            // 组件创建完后获取数据，
            this.getLogList();
        }
    };
</script>

<style scoped>

</style>
