<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";

    .homebg {
        display: block;
        width: 100%;
    }

    .chartShow {
        margin-top: 7px;
        font-size: 18px;
        font-weight: bolder;
    }

    .chartShowItem {
        width: 18.8%;
        display: inline-block;
        text-align: center;
    }

    .chartShowItemTitle {
        color: #9E9E9E;
    }

    .chartShowItemValue {
        color: #2d8cf0;
        margin-top: 5px;
    }

    .charShowSize {
        width: 100%;
        height: 325px;
    }
</style>
<template>
    <!--<div class="home-main">-->
    <!--<Row :gutter="10">-->
    <!--<Col :md="24" :lg="8">-->
    <!--<Row class-name="home-page-row1" :gutter="10">-->
    <!--<Col :md="12" :lg="24" :style="{marginBottom: '10px'}">-->
    <!--<Card>-->
    <!--<Row type="flex" class="user-infor">-->
    <!--<Col span="8">-->
    <!--<Row class-name="made-child-con-middle" type="flex" align="middle">-->
    <!--<img class="avator-img" :src="avatorPath" />-->
    <!--</Row>-->
    <!--</Col>-->
    <!--<Col span="16" style="padding-left:6px;">-->
    <!--<Row class-name="made-child-con-middle" type="flex" align="middle">-->
    <!--<div>-->
    <!--<b class="card-user-infor-name">Admin</b>-->
    <!--<p>super admin</p>-->
    <!--</div>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<div class="line-gray"></div>-->
    <!--<Row class="margin-top-8">-->
    <!--<Col span="8"><p class="notwrap">上次登录时间:</p></Col>-->
    <!--<Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>-->
    <!--</Row>-->
    <!--<Row class="margin-top-8">-->
    <!--<Col span="8"><p class="notwrap">上次登录地点:</p></Col>-->
    <!--<Col span="16" class="padding-left-8">北京</Col>-->
    <!--</Row>-->
    <!--</Card>-->
    <!--</Col>-->
    <!--<Col :md="12" :lg="24" :style="{marginBottom: '10px'}">-->
    <!--<Card>-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="android-checkbox-outline"></Icon>-->
    <!--待办事项-->
    <!--</p>-->
    <!--<a type="text" slot="extra" @click.prevent="addNewToDoItem">-->
    <!--<Icon type="plus-round"></Icon>-->
    <!--</a>-->
    <!--<Modal-->
    <!--v-model="showAddNewTodo"-->
    <!--title="添加新的待办事项"-->
    <!--@on-ok="addNew"-->
    <!--@on-cancel="cancelAdd">-->
    <!--<Row type="flex" justify="center">-->
    <!--<Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px" />-->
    <!--</Row>-->
    <!--<Row slot="footer">-->
    <!--<Button type="text" @click="cancelAdd">取消</Button>-->
    <!--<Button type="primary" @click="addNew">确定</Button>-->
    <!--</Row>-->
    <!--</Modal>-->
    <!--<div class="to-do-list-con">-->
    <!--<div v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item">-->
    <!--<to-do-list-item :content="item.title"></to-do-list-item>-->
    <!--</div>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--<Col :md="24" :lg="16">-->
    <!--<Row :gutter="5">-->
    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
    <!--<infor-card-->
    <!--id-name="user_created_count"-->
    <!--:end-val="count.createUser"-->
    <!--iconType="android-person-add"-->
    <!--color="#2d8cf0"-->
    <!--intro-text="今日新增用户"-->
    <!--&gt;</infor-card>-->
    <!--</Col>-->
    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
    <!--<infor-card-->
    <!--id-name="visit_count"-->
    <!--:end-val="count.visit"-->
    <!--iconType="ios-eye"-->
    <!--color="#64d572"-->
    <!--:iconSize="50"-->
    <!--intro-text="今日浏览量"-->
    <!--&gt;</infor-card>-->
    <!--</Col>-->
    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
    <!--<infor-card-->
    <!--id-name="collection_count"-->
    <!--:end-val="count.collection"-->
    <!--iconType="upload"-->
    <!--color="#ffd572"-->
    <!--intro-text="今日数据采集量"-->
    <!--&gt;</infor-card>-->
    <!--</Col>-->
    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
    <!--<infor-card-->
    <!--id-name="transfer_count"-->
    <!--:end-val="count.transfer"-->
    <!--iconType="shuffle"-->
    <!--color="#f25e43"-->
    <!--intro-text="今日服务调用量"-->
    <!--&gt;</infor-card>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<Row>-->
    <!--<Card :padding="0">-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="map"></Icon>-->
    <!--今日服务调用地理分布-->
    <!--</p>-->
    <!--<div class="map-con">-->
    <!--<Col span="10">-->
    <!--<map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>-->
    <!--</Col>-->
    <!--<Col span="14" class="map-incon">-->
    <!--<Row type="flex" justify="center" align="middle">-->
    <!--<home-map :city-data="cityData"></home-map>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<Row :gutter="10" class="margin-top-10">-->
    <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
    <!--<Card>-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="android-map"></Icon>-->
    <!--上周每日来访量统计-->
    <!--</p>-->
    <!--<div class="data-source-row">-->
    <!--<visite-volume></visite-volume>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Col>-->
    <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
    <!--<Card>-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="ios-pulse-strong"></Icon>-->
    <!--数据来源统计-->
    <!--</p>-->
    <!--<div class="data-source-row">-->
    <!--<data-source-pie></data-source-pie>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Col>-->
    <!--<Col :md="24" :lg="8">-->
    <!--<Card>-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="android-wifi"></Icon>-->
    <!--各类用户服务调用变化统计-->
    <!--</p>-->
    <!--<div class="data-source-row">-->
    <!--<user-flow></user-flow>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<Row class="margin-top-10">-->
    <!--<Card>-->
    <!--<p slot="title" class="card-title">-->
    <!--<Icon type="ios-shuffle-strong"></Icon>-->
    <!--上周每日服务调用量(万)-->
    <!--</p>-->
    <!--<div class="line-chart-con">-->
    <!--<service-requests></service-requests>-->
    <!--</div>-->
    <!--</Card>-->
    <!--</Row>-->
    <!--</div>-->
    <!--<div style ="height: 100%">-->
    <!--<img src="../../images/home.jpg" class="homebg"  alt="">-->
    <!--</div>-->
    <Row>
        <Row>
            <Col span="24">
                <!--用户流量统计-->
                <Card>
                    <div class="chartShow">
                        <div class="chartShowItem">
                            <p class="chartShowItemTitle">总注册量（人）</p>
                            <p class="chartShowItemValue">{{registerCount}}</p>
                        </div>
                        <div class="chartShowItem">
                            <p class="chartShowItemTitle">异常指标用户（人）</p>
                            <p class="chartShowItemValue">{{userExceptionCount}}</p>
                        </div>
                        <div class="chartShowItem">
                            <p class="chartShowItemTitle">服务人次</p>
                            <p class="chartShowItemValue">{{registerCount}}</p>
                        </div>
                        <div class="chartShowItem">
                            <p class="chartShowItemTitle">总体检数据（条）</p>
                            <p class="chartShowItemValue">{{dataCount}}</p>
                        </div>
                        <div class="chartShowItem">
                            <p class="chartShowItemTitle">总异常体检数据（条）</p>
                            <p class="chartShowItemValue">{{dataExceptionCount}}</p>
                        </div>
                    </div>
                </Card>
                <Row>
                    <Col span="8">
                        <!--体检数据来源比例-->
                        <Card>
                            <div id="healthDataSource" ref="eChart1" class="charShowSize"></div>
                        </Card>
                    </Col>
                    <Col span="8">
                        <!--用户周均拥有体检数据-->
                        <Card>
                            <div id="userDataWeek" ref="eChart2" class="charShowSize"></div>
                        </Card>
                    </Col>
                    <Col span="8">
                        <!--用户周均浏览时长-->
                        <Card>
                            <div id="userBrowseWeek" ref="eChart3" class="charShowSize"></div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <!--用户性别比例-->
                <Card>
                    <div id="userSex" ref="eChart4" class="charShowSize"></div>
                </Card>
            </Col>
            <Col span="16">
                <Row>
                    <Col span="12">
                        <!--用户年龄人数分布-->
                        <Card>
                            <div id="userAge" ref="eChart5" class="charShowSize"></div>
                        </Card>
                    </Col>
                    <Col span="12">
                        <!--体检项目偏好及异常数据分布-->
                        <Card>
                            <div id="userDataAbnormal" ref="eChart6" class="charShowSize"></div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Row>
</template>

<script>
    import cityData from './map-data/get-city-value.js';
    import homeMap from './components/map.vue';
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    import serviceRequests from './components/serviceRequests.vue';
    import userFlow from './components/userFlow.vue';
    import countUp from './components/countUp.vue';
    import inforCard from './components/inforCard.vue';
    import mapDataTable from './components/mapDataTable.vue';
    import toDoListItem from './components/toDoListItem.vue';

    import {
        findDataCount,
        findRegisterUserCount,
        findUserAgeDistribution,
        findExceptionDataCount
    } from "@/libs/API/userDataStatistics";

    export default {
        name: 'home',
        components: {
            homeMap,
            dataSourcePie,
            visiteVolume,
            serviceRequests,
            userFlow,
            countUp,
            inforCard,
            mapDataTable,
            toDoListItem
        },
        data() {
            return {
                toDoList: [
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    }
                ],
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                cityData: cityData,
                showAddNewTodo: false,
                newToDoItemValue: '',
                dataCount: 0,//总体检数据
                registerCount: 0,//注册总数
                dataExceptionCount: 0,//数据异常总数
                userExceptionCount: 0,//用户异常总数
                bloodPressureCount: 0,//血压异常总数
                checkCount: 0,//已经载入数据总数
                healthDataSource: [],//数据来源数组
                userRegister: [],//用户注册数量
                userAge: [],//用户年龄分布
                dataException: [0, 0, 0, 0, 0, 0, 0, 0]//异常数据数组
            };
        },
        computed: {
            avatorPath() {
                return localStorage.avatorImgPath;
            }
        },
        methods: {
            //图表自适应
            init() {
                const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
                setTimeout(() => {
                    window.onresize = function() {
                        self.$echarts.init(self.$refs.eChart1).resize();
                        self.$echarts.init(self.$refs.eChart2).resize();
                        self.$echarts.init(self.$refs.eChart3).resize();
                        self.$echarts.init(self.$refs.eChart4).resize();
                        self.$echarts.init(self.$refs.eChart5).resize();
                        self.$echarts.init(self.$refs.eChart6).resize();
                    }
                },20)
            },
            addNewToDoItem() {
                this.showAddNewTodo = true;
            },
            addNew() {
                if (this.newToDoItemValue.length !== 0) {
                    this.toDoList.unshift({
                        title: this.newToDoItemValue
                    })
                    setTimeout(() => {
                        this.newToDoItemValue = ''
                    }, 200);
                    this.showAddNewTodo = false;
                } else {
                    this.$Message.error('请输入待办事项内容');
                }
            },
            cancelAdd() {
                this.showAddNewTodo = false;
                this.newToDoItemValue = '';
            },
            //获取体检数据来源
            async findDataCount(params) {
                let data = {
                    startDate: '2018-11-11 00:00:00',
                    source: params
                }
                let name = ''
                if (params === 1) {
                    name = '社区端'
                } else {
                    name = '家庭端'
                }
                let res = await findDataCount(data)
                if (!res.code) {
                    let obj = {
                        value: res.data,
                        name: name
                    }
                    this.healthDataSource.push(obj)
                    this.chartShowByHealthDataSource()
                    this.dataCount = this.dataCount + res.data
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //获取用户注册数量
            async findRegisterUserCount(params) {
                let data = {
                    startDate: '2018-11-11 00:00:00',
                    sex: params
                }
                let name = ''
                if (params === 1) {
                    name = '男'
                } else if (params === 2) {
                    name = '女'
                }
                let res = await findRegisterUserCount(data)
                if (!res.code) {
                    let obj = {
                        value: res.data,
                        name: name
                    }
                    if (!params) {
                        this.registerCount = res.data
                    } else {
                        this.userRegister.push(obj)
                        this.chartShowByUserSex()
                    }
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //获取用户年龄分布
            async findUserAgeDistribution() {
                let data = {
                    startDate: '2018-11-11 00:00:00',
                }
                let res = await findUserAgeDistribution(data)
                if (!res.code) {
                    this.userAge = res.data
                    this.chartShowByUserAge()
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //获取体检异常数据
            async findExceptionDataCount(params, type) {
                let data = {
                    params: params,
                    deviceTypeId: type
                }
                let res = await findExceptionDataCount(data)
                if (!res.code) {
                    if (params === 'countExceptionData') {//统计异常数据总数
                        if (!type) {//获取总数
                            this.dataExceptionCount = res.data
                        } else {//各项数据异常
                            if (type === 33) {//bmi异常数据总数
                                this.dataException.splice(5, 1, res.data)
                                this.checkCount++
                            } else if (type === 16) {//体脂异常数据总数
                                this.dataException.splice(6, 1, res.data)
                                this.checkCount++
                            } else if (type === 20) {//腰臀比异常数据总数
                                this.dataException.splice(2, 1, res.data)
                                this.checkCount++
                            } else if (type === 21) {//血糖异常数据总数
                                this.dataException.splice(3, 1, res.data)
                                this.checkCount++
                            } else if (type === 22) {//尿酸异常数据总数
                                this.dataException.splice(1, 1, res.data)
                                this.checkCount++
                            } else if (type === 23) {//胆固醇异常数据总数
                                this.dataException.splice(0, 1, res.data)
                                this.checkCount++
                            } else if (type === 24) {//体温异常数据总数
                                this.dataException.splice(7, 1, res.data)
                                this.checkCount++
                            } else if (type === 28 || type === 29 || type === 30) {//获取血压异常数据总数
                                this.bloodPressureCount = this.bloodPressureCount + res.data
                                this.dataException.splice(4, 1, this.bloodPressureCount)
                                this.checkCount++
                            }
                            this.chartShowByUserDataAbnormal()
                        }
                    } else if (params === 'countExceptionUser') {//统计异常用户总数
                        this.userExceptionCount = res.data
                    }
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //体检数据来源比例
            chartShowByHealthDataSource() {
                if (this.healthDataSource.length > 1) {
                    let dom = document.getElementById('healthDataSource')
                    let myChart = this.$echarts.init(dom)
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            text: '体检数据来源比例',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: ['家庭端', '社区端']
                        },
                        series: {
                            type: 'pie',
                            name: '体检数据来源比例',
                            // highlightPolicy: 'ancestor',
                            data: this.healthDataSource,
                            radius: [0, '65%'],
                            center: ['50%', '55%'],
                            // color:['#61a0a8','#F08080'],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    })
                }
            },
            //用户周均拥有体检数据
            chartShowByUserDataWeek() {
                let dom = document.getElementById('userDataWeek')
                let myChart = this.$echarts.init(dom)
                let data = [
                    {value: 20, name: '10条及一下'},
                    {value: 60, name: '10-20条'},
                    {value: 20, name: '20条以上'}
                ]
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '用户周均拥有体检数据',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['10条及一下', '10-20条', '20条以上']
                    },
                    series: {
                        type: 'pie',
                        name: '用户周均拥有体检数据',
                        // highlightPolicy: 'ancestor',
                        data: data,
                        radius: [20, '65%'],
                        center: ['50%', '55%'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                })
            },
            //用户周均浏览时长
            chartShowByUserBrowseWeek() {
                let dom = document.getElementById('userBrowseWeek')
                let myChart = this.$echarts.init(dom)
                let data = [
                    {value: 31, name: '15分钟以内'},
                    {value: 65, name: '15-30分钟'},
                    {value: 35, name: '30-45分钟'},
                    {value: 15, name: '45分钟以上'},
                ]
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '用户周均浏览时长',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['15分钟以内', '15-30分钟', '30-45分钟', '45分钟以上']
                    },
                    series: {
                        type: 'pie',
                        name: '用户周均浏览时长',
                        // highlightPolicy: 'ancestor',
                        data: data,
                        radius: [20, '65%'],
                        center: ['50%', '55%'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                })
            },
            //年龄人数分布
            chartShowByUserAge() {
                if (this.userRegister.length > 1) {
                    let dom = document.getElementById('userAge')
                    let myChart = this.$echarts.init(dom)
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            text: '用户年龄人数分布',
                            x: 'center'
                        },
                        xAxis: {
                            type: 'category',
                            data: ['0-18岁', '18-30岁', '31-40岁', '41-50岁', '51-60岁', '61-70岁', '71-80岁', '80岁以上']
                        },
                        yAxis: {
                            type: 'value',
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}"
                        },
                        series: [{
                            data: this.userAge,
                            name: '用户年龄人数分布',
                            type: 'bar',
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                            // color:['#2d8cf0']
                        }]
                    })
                }
            },
            //用户性别比例
            chartShowByUserSex() {
                let dom = document.getElementById('userSex')
                let myChart = this.$echarts.init(dom)
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '用户性别比例',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['男', '女']
                    },
                    series: {
                        type: 'pie',
                        name: '用户性别比例',
                        // highlightPolicy: 'ancestor',
                        data: this.userRegister,
                        radius: [0, '65%'],
                        center: ['50%', '55%'],
                        color: ['#2d8cf0', '#cc3366'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                })
            },
            //体检项目偏好及异常数据分布
            chartShowByUserDataAbnormal() {
                if (this.checkCount === 10) {
                    let dom = document.getElementById('userDataAbnormal')
                    let myChart = this.$echarts.init(dom)
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            text: '体检项目异常数据分布',
                            x: 'center'
                        },
                        xAxis: {
                            type: 'value',
                        },
                        yAxis: {
                            type: 'category',
                            data: ['胆固醇', '尿酸', '腰臀比', '血糖', '血压', 'BMI', '体脂', '体温']
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}"
                        },
                        series: [{
                            data: this.dataException,
                            name: '体检项目异常数据分布',
                            type: 'bar',
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            color: ['#5599FF']
                        }]
                    })
                }
            }
        },
        created() {

        },
        mounted() {
            this.findDataCount(1)//获取社区来源数据总数
            this.findDataCount(2)//获取家庭来源数据总数
            this.findRegisterUserCount()//获取注册总人数
            this.findUserAgeDistribution()//获取年龄分布
            this.findRegisterUserCount(1)//获取男性注册人数
            this.findRegisterUserCount(2)//获取女性注册人数
            this.findExceptionDataCount('countExceptionData')//获取异常数据总数
            this.findExceptionDataCount('countExceptionUser')//获取异常人数总数
            this.findExceptionDataCount('countExceptionData', 33)//获取BMI异常数据总数
            this.findExceptionDataCount('countExceptionData', 16)//获取体脂异常数据总数
            this.findExceptionDataCount('countExceptionData', 20)//获取腰臀比异常数据总数
            this.findExceptionDataCount('countExceptionData', 21)//获取血糖异常数据总数
            this.findExceptionDataCount('countExceptionData', 22)//获取尿酸异常数据总数
            this.findExceptionDataCount('countExceptionData', 23)//获取胆固醇异常数据总数
            this.findExceptionDataCount('countExceptionData', 24)//获取体温异常数据总数
            this.findExceptionDataCount('countExceptionData', 28)//获取血压异常数据总数
            this.findExceptionDataCount('countExceptionData', 29)//获取血压异常数据总数
            this.findExceptionDataCount('countExceptionData', 30)//获取血压异常数据总数
            this.chartShowByUserDataWeek()
            this.chartShowByUserBrowseWeek()
            this.init()
        }
    };
</script>
