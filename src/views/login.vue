<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="phone">
                            <i-input v-model="form.phone" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem prop="password">
                            <i-input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import md5 from 'js-md5';
  import {login} from '../libs/API/login'
  import {appRouter} from '@/router/router';//新增加的

  export default {
    data() {
      return {
        form: {
          phone: '',
          password: ''
        },
        rules: {
          phone: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        accessList: [],//运营管理员权限列表数组（后台获取）
      };
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate(async (valid) => { // 格式校验
          if (valid) { // 验证通过
            // 缓存未加密的密码
            let pwd = this.form.password;
            // md5加密
            //this.form.password = md5(this.form.password);
            // 调用登录接口
            const res = await login(this.form).catch(err => {
              this.$Message.error('网络错误^_^');
              // 密码框的数据恢复为未加密状态
              this.form.password = pwd;
            });
            if (res && !res.code) { // 登陆成功
              localStorage.setItem('token', res.data.token);
              // 往cookie中注入账号
              Cookies.set('user', this.form.phone);
              Cookies.set('id',res.data.adminInfo.id);
              var accessList=[
                  {
                      "name": null,
                      "user_id": 1,
                      "role_id": 2
                  }
              ];
              // 存入权限列表
              localStorage.setItem('accessList',JSON.stringify(accessList));
              // 若开放用户头像,则可使用以下头像配置
              // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
              // 刷新路由
              // this.$store.commit('updateMenulist');
              // 跳转首页
              this.$router.push({
                name: 'home_index'
              });
            } else { // 登陆失败
              // 提示登陆失败
              if (res)
                  this.$Message.error(res.msg);
              // 密码框的数据恢复为未加密状态
              this.form.password = pwd;
            }
          }
        });
      }
    }
  };
</script>

<style>

</style>
