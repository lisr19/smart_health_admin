<template>
    <Modal v-model="isAdd" title="添加文章" @on-cancel="doCancel" width="960">
        <Form :model="articleAddForm" ref="articleAddForm" :label-width="100" :rules="addRules">
            <FormItem label="标题：" prop="title">
                <Input clearable v-model="articleAddForm.title" placeholder="请输入标题"/>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <i-select clearable v-model="articleAddForm.type">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </i-select>
            </FormItem>
            <FormItem label="状态：" prop="status1">
                <i-switch v-model="articleAddForm.status1"/>
            </FormItem>
            <FormItem label="链接：" prop="url">
                <Input clearable v-model="articleAddForm.url" placeholder="请输入链接"/>
            </FormItem>
            <FormItem label="作者：" prop="author">
                <Input clearable v-model="articleAddForm.author" placeholder="请输入作者"/>
            </FormItem>
            <FormItem label="日期：" prop="date">
                <DatePicker @on-change="handleTime" placeholder="Select date"></DatePicker>
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
                <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doArticleAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addArticle} from '@/libs/API/article.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'article-add',
        props: ['typeList'],
        data () {
            return {
                isAdd: false,
                articleAddForm: {
                    status1:0
                },
                headers:{'phone': Cookies.get('user'), authorization: localStorage.token},
                uploadImgList:[],//上传图片数组
                addRules:{
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
                        selector: '#tinymceEditer',
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
            async doArticleAdd() {
                this.$refs.articleAddForm.validate(async (valid) => { //表单校验
                    if(valid){//校验成功
                        let form = this.articleAddForm
                        if(!form.status1){
                            form.status=2;
                        } else {
                            form.status=1;
                        }
                        form.content=tinymce.get('tinymceEditer').getContent();
                        console.log(form)
                        let res = await addArticle(form);
                        if (!res.code) {
                            this.$Message.success('添加成功');
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
                this.$refs.articleAddForm.resetFields()//重置表单
                this.articleAddForm = {
                    status1:0
                }
                this.isAdd = false
                this.uploadImgList = []
            },
            handleTime(params){
                this.articleAddForm.date=params;
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
            this.init();
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        }
    }


</script>

<style scoped>

</style>
