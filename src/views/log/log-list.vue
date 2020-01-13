<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">日志列表</p>
            <!--表格部分-->
            <Row>
                <Col span="4" offset="16">
                    <Select clearable @on-change="handleSearchByType" placeholder="选择级别">
                        <Option v-for="item in levelList" :value="item.label" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="0">
                    <DatePicker @on-change="handleSearchByDate" type="daterange" placement="bottom-end"
                                placeholder="选择日期"></DatePicker>
                </Col>

            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="logData" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import {findLogList} from '@/libs/API/log.js';
    import util from '@/libs/util.js';

    export default {
        name: "log-list",
        components: {
        },
        data() {
            return {
                //文章表头数组
                columnsList: [
                    {
                        title: '日志事件ID',
                        align: 'center',
                        key: 'eventId',
                    },
                    {
                        title: '请求行',
                        align: 'center',
                        key: 'callerLine',
                    },
                    {
                        title: '请求方法',
                        align: 'center',
                        key: 'callerMethod',
                    },
                    {
                        title: '请求类',
                        align: 'center',
                        key: 'callerClass',
                    },
                    {
                        title: '请求文件名',
                        align: 'center',
                        key: 'callerFilename',
                    },
                    {
                        title: '标志号',
                        align: 'center',
                        key: 'referenceFlag',
                    },
                    {
                        title: '进程名',
                        align: 'center',
                        key: 'threadName',
                    },
                    {
                        title: '级别',
                        align: 'center',
                        key: 'levelString',
                    },
                    {
                        title: '记录器',
                        align: 'center',
                        key: 'loggerName',
                    },
                    {
                        title: '消息',
                        align: 'center',
                        key: 'formattedMessage',
                    },
                    {
                        title: '时间戳',
                        align: 'center',
                        key: 'timestmp',
                        sortable: true,
                    }
                ],
                logData: [],//系统用户列表数据（后台获取）
                search_data: {},//搜索文章
                searchOption: {},//系统用户传到后台的对象
                levelList: [{value:1,label:'INFO'},{value:2,label:'WARN'},{value:3,label:'ERROR'}],
                page: {//系统用户翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //系统用户信息列表获取
            async getLogList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.levelString = params.levelString;
                    data.startDate=params.startDate;
                    data.endDate=params.endDate;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findLogList(data);
                if (!res.code) {
                    this.logData = res.data.data;
                    this.page.total = res.data.total[0];
                }
            },
            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getLogList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    console.log(this.search_data);
                    this.searchOption.name=this.search_data.name;
                    this.searchOption.department=this.search_data.department;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getLogList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getLogList();
                }
            },
            handleSearchByType(params) {
                if (params) {//判断搜索条件是否为空
                    this.searchOption.levelString = params;
                    this.searchOption.page = 1;// 初始化搜索页数
                } else {//重置该搜索内容
                    delete this.searchOption.levelString;
                }
                this.getLogList(this.searchOption);
            },
            handleSearchByDate(params) {
                if(params){
                    this.searchOption.startDate=params[0];
                    this.searchOption.endDate=params[1];
                } else {
                    delete this.searchOption.startDate;
                    delete this.searchOption.endDate;
                }
                this.getLogList(this.searchOption);
            }
        },
        activated(){
            //页面被打开时获取数据
            this.getLogList();
        },
    }
</script>

<style scoped>

</style>
