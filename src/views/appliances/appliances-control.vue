<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">智能家电列表</p>

        </Card>
        <!--表格部分-->
        <Card>
            <div>
                <Table :columns="columnsList" :data="hotelData" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="handlePageTurn"></Page>
                </div>
            </div>
        </Card>

        <Modal v-model="isControl" @on-cancel="cancelModal" title="家电控制" width="1000">
            <Card>
                <iframe src="http://wanfanji.3322.org:8123" class="control"></iframe>
            </Card>
            <!--自定义页脚-->
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "appliances-control",
        data() {
            return {
                isControl: false,
                columnsList: [
                    {
                        title: '智能家电名称',
                        align: 'center',
                        key: 'hotelName'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openModal()
                                        }
                                    }
                                }, '控制')
                            ])
                        }
                    }
                ],
                hotelData: [
                    {
                        hotelId: 1,
                        hotelName: '智能空调'
                    },
                    {
                        hotelId: 2,
                        hotelName: '智能灯光'
                    }
                ],
                page: {// 页面翻页对象
                    total: 1, // 数据总数
                    currentPage: 1// 当前页面
                },
            }
        },
        methods: {
            // modal打开
            openModal() {
                this.isControl = true
            },
            // modal关闭
            cancelModal() {
                this.isControl = false
            },
            // 页面翻页
            handlePageTurn(page) {
                this.searchOption.page = page
            },
        }
    }
</script>

<style lang="less" scoped>
    .control {
        width: 100%;
        height: 800px;
    }
</style>
