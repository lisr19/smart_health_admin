<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <!--<scroll-bar ref="scrollBar">-->
            <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" src="../images/logo.png" key="max-logo"/>
                    <img v-show="shrink" src="../images/logo-min.png" key="min-logo"/>
                </div>
            </shrinkable-menu>
            <!--</scroll-bar>-->
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                            @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">

                    <!--<lock-screen></lock-screen>-->
                    <!--<message-tip v-model="mesCount"></message-tip>-->
                    <!--<theme-switch></theme-switch>-->
                    <div style="position: absolute;left: -60px;">
                        <Button style="display: inline-block;margin: 15px;text-align: center;">
                            <a href="//www.halohealth.cn/static/health/health_platform/index.html" target="_blank">
                                智慧健康技术研究平台</a></Button>
                    </div>
                    <div class="user-dropdown-menu-con" style="right:44px">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)" style="color:#2d8cf0">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                    <!--<DropdownItem name="password-edit" divided>修改密码</DropdownItem>-->
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar style="background-color: #2d8cf0;margin-left: 10px;" icon="person "></Avatar>
                            <!--若开放用户头像可使用以下方式-->
                            <!--<Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>-->
                        </Row>
                    </div>
                    <div style="position: absolute;right:15px">
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="passwordForm" :model="passwordForm" :label-width="100" label-position="right" :rules="editRules">
                <FormItem label="新密码：" prop="password">
                    <Input v-model="passwordForm.password" placeholder="不修改时，请留空" type="password"></Input>
                </FormItem>
                <FormItem label="确认新密码：" prop="re_password">
                    <Input v-model="passwordForm.re_password" placeholder="不修改时，请留空" type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="error" @click="cancelEditPass">取消</Button>
                <Button type="success" @click="editPersonInfo">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    // import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    // import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars';
    import {editPersonInfo} from '@/libs/API/person.js';
    import md5 from 'js-md5';

    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            // lockScreen,
            messageTip,
            // themeSwitch,
            scrollBar
        },
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value !== this.passwordForm.password) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                editPasswordModal: false,
                passwordForm: {}, // 用户数据表单对象
                editRules: {
                    password: [
                        {required: false, message: '密码不能为空', trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                    re_password: [
                        {required: false, validator: validatePassCheck, trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                }
            };
        },
        computed: {
            menuList() {
                return this.$store.state.app.menuList;
            },
            pageTagsList() {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath() {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath() {
                return localStorage.avatorImgPath;
            },
            cachePage() {
                return this.$store.state.app.cachePage;
            },
            lang() {
                return this.$store.state.app.lang;
            },
            menuTheme() {
                return this.$store.state.app.menuTheme;
            },
            mesCount() {
                return this.$store.state.app.messageCount;
            }
        },
        methods: {
            init() {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick() {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown(name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index',
                        query: {username: this.userName}
                    });
                } else if (name === 'password-edit') {
                    this.showEditPassword();
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('removeTag', 'ownspace_index');
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            checkTag(name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange(val) {
                // console.log(val)
            },
            beforePush(name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange(isFullScreen) {
                // console.log(isFullScreen);
            },
            // scrollBarResize () {
            //     this.$refs.scrollBar.resize();
            // },
            showEditPassword() {
                this.editPasswordModal = true;
            },
            cancelEditPass() {
                this.editPasswordModal = false;
                this.$refs['passwordForm'].resetFields();
            },
            async editPersonInfo() {
                this.$refs.passwordForm.validate(async (valid) => {//表单验证
                    if (valid) {//表单验证成功
                        let pwd = this.passwordForm.password; // 密码缓存
                        let re_pwd = this.passwordForm.re_password;// 确认密码缓存
                        this.passwordForm.password = md5(this.passwordForm.password); // md5加密
                        this.passwordForm.re_password = md5(this.passwordForm.re_password); // md5加密
                        let data = {};
                        let form = this.passwordForm;
                        data.username = this.userName;
                        data.password = form.password;
                        let res = await editPersonInfo(data);
                        if (!res.errno) {
                            this.$Message.success('密码修改成功');
                            this.cancelEditPass();
                        } else {
                            this.passwordForm.password = pwd; // 复原密码
                            this.passwordForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.errmsg);
                        }
                    } else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
        },
        watch: {
            '$route'(to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang() {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            openedSubmenuArr() {
                // setTimeout(() => {
                //     // this.scrollBarResize();
                // }, 300);
            }
        },
        mounted() {
            this.init();
            window.addEventListener('resize', this.scrollBarResize);
        },
        created() {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        },
        dispatch() {
            window.removeEventListener('resize', this.scrollBarResize);
        }
    };
</script>
