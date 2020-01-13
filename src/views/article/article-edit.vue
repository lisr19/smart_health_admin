<template>
    <Modal v-model="isEdit" title="修改详情" @on-cancel="doCancel" width="960">
        <Form :model="articleEditForm" ref="articleEditForm" :label-width="100" :rules="editRules">
            <FormItem label="标题：" prop="title">
                <Input clearable v-model="articleEditForm.title" placeholder="请输入标题"/>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <Select clearable v-model="articleEditForm.type">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="链接：" prop="url">
                <Input clearable v-model="articleEditForm.url" placeholder="请输入链接"/>
            </FormItem>
            <FormItem label="作者：" prop="author">
                <Input clearable v-model="articleEditForm.author" placeholder="请输入作者"/>
            </FormItem>
            <FormItem label="日期：" prop="date">
                <DatePicker type="date" v-model="articleEditForm.date" placeholder="Select date"></DatePicker>
            </FormItem>
            <FormItem label="图片上传：" >
                <div>
                    <Upload :show-upload-list="false"
                            :format="['jpg','png','jpeg']"
                            :headers="headers"
                            name="imgFile"
                            :on-success="handleLogoUploadSuccess"
                            action="http://120.24.0.130:8080/smart_health/upload/img">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </div>
                <div >
                    <p v-if="uploadImgList.length > 0">成功上传图片路径：</p>
                    <div v-for="(value,index) in uploadImgList">
                        <p>图片{{index+1}}&nbsp;&nbsp;:&nbsp;&nbsp;{{value.url}}</p>
                    </div>
                </div>
            </FormItem>
            <FormItem label="内容：" prop="content">
                <textarea class='tinymce-textarea' id="tinymceEdit"></textarea>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doArticleEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editArticle} from '@/libs/API/article.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'article-edit',
        props: ['typeList'],
        data () {
            return {
                isEdit: false,
                headers:{'phone': Cookies.get('user'), authorization: localStorage.token},
                uploadImgList:[],//上传图片数组
                articleEditForm: {},
                editRules:{
                    title:[{required: true, message: '标题不能为空', trigger: 'blur'}],
                    type:[{type: 'number',required: true, message: '类型不能为空', trigger: 'blur'}],
                    url:[{required: true, message: 'url不能为空', trigger: 'blur'}]
                }
            };
        },
        methods: {
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight;
                    tinymce.init({
                        selector: '#tinymceEdit',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language: 'zh_CN.GB2312',
                        menubar: 'edit insert view format table tools',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullpage',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                        ],
                        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                            });
                            editor.on('keydown', function (e) {
                                // localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                                // console.log(tinymce.get('tinymceEditer').getContent());
                            });
                        }
                    });
                });
            },
            changeText (params) {
                let text = '';
                let img = '';
                // console.log(params)
                if(this.IsJsonString(params)){
                    let content = JSON.parse(params);
                    for (let i = 0; i < content.length; ++i) {
                        let item = content[i];
                        if (item.tag === 'img') {
                            img += item.text;
                            img += '\n';
                        } else if (item.tag === 'p') {
                            text += item.text;
                        }
                    }
                    text = text + img;
                    tinymce.get('tinymceEdit').setContent(text);
                }else{
                    tinymce.get('tinymceEdit').setContent(params);
                }
            },
            //判断字符串是否为JSON格式
            IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false
                }
                return true
            },
            async doArticleEdit() {
                this.$refs.articleEditForm.validate(async (valid) => { //表单校验
                    if (valid) {//校验成功
                        let form = this.articleEditForm;
                        if(form.date){
                            form.date=form.date.format("yyyy-MM-dd hh:mm:ss");
                        }
                        form.content = tinymce.get('tinymceEdit').getContent()
                        // console.log(this.articleEditForm.content)
                        let res = await editArticle(form);
                        if (!res.code) {
                            this.$Message.success('修改成功');
                            this.$emit('refreshArticleList');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }else{
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            doCancel () {
                this.$refs.articleEditForm.resetFields();//重置表单
                this.articleEditForm = {};
                this.isEdit = false
                this.uploadImgList = []
            },
            //图片上传成功回调
            handleLogoUploadSuccess(res){
                if (!res.code) {
                    this.uploadImgList.push({url:res.data.url})
                    // this.nodeData.img_url = res.data.img_url;
                    // this.nodeData.img_key = res.data.img_key;
                } else {
                    this.$Message.error(res.msg);
                }
            }
        },
        mounted () {
            this.init()
        },
        destroyed () {
            tinymce.get('tinymceEdit').destroy();
        }
    };

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
</script>

<style scoped>

</style>
