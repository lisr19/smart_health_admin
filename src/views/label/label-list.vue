<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">标签列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openLabelAdd" style="width: 100px;">添加</Button>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="labelData" disabled-hover></Table>
            </div>
        </Card>
        <!--添加/编辑页面组件插入-->
        <labelAdd ref="labelAdd" @refreshLabelList="getLabelList" :labelCas="labelCas"/>
        <labelEdit ref="labelEdit" @refreshLabelList="getLabelList" :labelCas="labelCas"/>
    </div>
</template>

<script>
    import labelAdd from './label-add.vue';
    import labelEdit from './label-edit.vue';
    import {findLabelList, delLabel, editLabel} from '@/libs/API/label.js';
    import util from '@/libs/util.js';

    export default {
        name: "label-list",
        components: {
            labelAdd,
            labelEdit
        },
        data() {
            return {
                //文章表头数组
                columnsList: [
                    {
                        title: '标签名称',
                        key: 'content',
                        render: (h, params) => {
                            if (params.row.children && params.row.children.length > 0) {//若有子类
                                return h('div', [
                                    h('span', {
                                        style: {
                                            marginLeft: (params.row.level - 1) * 40 + 'px',
                                        },
                                        on: {
                                            click: () => {
                                                //将该条功能数据的子类数组赋予临时参数children
                                                let children = params.row.children;
                                                //判断该条功能是否处于展开状态
                                                if (params.row.expanded) {//已展开
                                                    //该条数据赋予参数currentRow
                                                    let currentRow = params.row;
                                                    //记录该条数据的子数据位置
                                                    let childrenIndex = params.index + 1;
                                                    //根据功能数组的长度动态删减显示条目
                                                    for (childrenIndex; childrenIndex < this.labelData.length; childrenIndex++) {
                                                        //若该条数据有子数据则将数据隐藏
                                                        if (currentRow.level < this.labelData[childrenIndex].level) {
                                                            this.labelData.splice(childrenIndex, 1);
                                                            childrenIndex--;
                                                        } else {
                                                            break;
                                                        }
                                                    }
                                                    //将该条数据的展开状态调整为未展开
                                                    this.labelData[params.index].expanded = false;
                                                } else {//若未展开
                                                    //记录该条数据的位置
                                                    let index = params.index;
                                                    //根据该条功能数据的子类长度动态显示显现条目
                                                    for (let i = 0; i < children.length; i++) {
                                                        index = index + 1;
                                                        this.labelData.splice(index, 0, children[i]);
                                                    }
                                                    //将该条数据的展开状态调整为已展开
                                                    this.labelData[params.index].expanded = true;
                                                }
                                                //将列表树最终状态中显示的数据id存储在expanded对象中
                                                this.expanded['e' + params.row.id] = this.labelData[params.index].expanded;
                                            }
                                        }
                                    }, [
                                        h('span', params.row.content + ''),
                                        h('icon', {
                                            props: {
                                                size: 14,
                                                type: params.row.expanded ? 'arrow-down-b' : 'arrow-right-b',//根据展开状态的不同显示图标
                                            },
                                            style: {
                                                marginLeft: '10px'
                                            }
                                        })
                                    ])
                                ])
                            } else {//若无子类
                                return h('div', {
                                    style: {
                                        marginLeft: (params.row.level - 1) * 40 + 'px',
                                    }
                                }, params.row.content)
                            }
                        }
                    },
                    {
                        title: '层级',
                        align: 'center',
                        key: 'level',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
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
                                            let data = Object.assign({}, params.row)
                                            let resArray = []
                                            this.toolsForCas(this.resData,data.id,resArray)
                                            data.labelCas = resArray
                                            this.openLabelEdit(data)
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
                                                    this.doLabelDel(id);
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
                labelData: [],//系统用户列表数据（后台获取）
                resData: [],//原始数据数组
                labelCas: [],//标签级联数组
                expanded: {},//列表树展开状态存储对象
            }
        },
        methods: {
            //系统用户信息列表获取
            async getLabelList() {
                let data = {}
                data.limit = 1000
                let res = await findLabelList(data)
                if (!res.code) {
                    let array = res.data
                    this.resData = array
                    this.labelData = util.array2tree(v => {
                        v.label = v.content
                        v.value = v.id
                    }, array)
                    this.labelCas.push({content: '无', id: '0', pid: '0', label: '无', value: '0'})
                    this.labelData.forEach((v) => {
                        this.labelCas.push(Object.assign({}, v))
                    })
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //用户删除
            async doLabelDel(params) {
                let data = {};
                data.id = params.id;
                let res = await delLabel(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getLabelList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getLabelList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openLabelAdd() {
                this.$refs.labelAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openLabelEdit(params) {
                this.$refs.labelEdit.isEdit = true;
                this.$refs.labelEdit.labelEditForm = params;
            },
            // 修改状态
            async doLabelEdit(params, index) {
                let data = {};
                data.id = params.id;
                data.status = params.status;
                data.type = params.type;
                let res = await editLabel(data);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.adData[index].status = params.status;
                } else {
                    this.$Message.error(res.msg);
                    this.getLabelList();
                }
            },
            //组装级联数组
            toolsForCas(array, id, resArray) {
                array.forEach((v) => {
                    if (v.id === id) {
                        if (v.id === 0) {
                            if (resArray.length === 0) {
                                resArray.unshift(v.pid)
                            }
                        } else {
                            resArray.unshift(v.pid)
                            this.toolsForCas(array, v.pid, resArray)
                        }
                    }
                })
            }
        },

        activated() {
            //页面被打开时获取数据
            this.getLabelList();
        },
    }
</script>

<style scoped>

</style>
