<template>
    <Modal v-model="isAdd" title="添加广告" @on-cancel="doCancel">
        <Form :model="adAddForm" ref="adAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="adAddForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="发布状态：" prop="status">
                <i-switch v-model="adAddForm.status"/>
            </FormItem>
            <FormItem label="视频：" prop="url">
                <Upload
                        ref="upload"
                        action="//120.24.0.130:8080/smart_health/upload/video"
                        :format="['mp4', 'avi', 'mkv', 'rmvb', 'flv', 'wmv']"
                        :on-format-error="handleFormatError"
                        :headers="myHeader"
                        name="videoFile"
                        :on-success="handleSuccess"
                        :before-upload="handleBeforeVideoUpload"
                >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传视频</Button>
                </Upload>
            </FormItem>
            <FormItem label="图片：" prop="imgUrl">
                <Upload
                        ref="imgUpload1"
                        action="//120.24.0.130:8080/smart_health/upload/img"
                        :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                        :on-format-error="handleFormatError"
                        :headers="myHeader"
                        name="imgFile"
                        :on-success="img1HandleSuccess"
                        :before-upload="handleBeforeImgUpload1"
                >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
            </FormItem>
            <FormItem label="开始时间：" prop="startTime">
                <DatePicker type="datetime" @on-change="handleTime" placeholder="请选择开始时间"
                            style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间：" prop="endTime">
                <DatePicker type="datetime" @on-change="handleTime1" placeholder="请选择结束时间"
                            style="width: 200px"></DatePicker>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doAdAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addAd} from '@/libs/API/ad.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'ad-add',
        data () {
            return {
                isAdd: false,
                adAddForm: {},
                uploadList: [],
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                /*time1 : new Date().format("yyyy-MM-dd hh:mm:ss"),
                time2 : new Date().format("yyyy-MM-dd hh:mm:ss"),*/
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    status:[
                        {required: true, message: '状态不能为空', trigger: 'blur'},
                    ],
                    url:[
                        {required: true, message: '请上传视频', trigger: 'blur'},
                    ],
                    imgUrl:[
                        {required: true, message: '请上传图片', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doAdAdd() {
                let form = Object.assign({},this.adAddForm);
                if(form.status){
                    form.status=1;
                } else {
                    form.status=0;
                }
                let res = await addAd(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshAdList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.adAddForm.resetFields();//重置表单
                this.adAddForm = {};
                this.isAdd = false;
            },
            handleTime(params){
                this.adAddForm.startTime=params;
            },
            handleTime1(params){
                this.adAddForm.endTime=params;
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择视频文件。'
                });
            },
            handleSuccess(res, file) {
                if (!res.code) {
                    this.adAddForm.url = res.data.url;
                    this.adAddForm.urlKey = res.data.fileName;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: res.msg
                    });
                }
            },
            img1HandleSuccess(res, file) {
                if (!res.code) {
                    this.adAddForm.imgUrl = res.data.url;
                    this.adAddForm.imgUrlKey = res.data.fileName;
                    file.name = res.data.fileName;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: res.msg
                    });
                }
            },
            handleBeforeVideoUpload() {
                const check = this.$refs.upload.fileList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传一个视频。'
                    });
                }
                return check;
            },
            handleBeforeImgUpload1() {
                const check = this.$refs.imgUpload1.fileList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传一张图片。'
                    });
                }
                return check;
            }
        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
        }
    };

</script>

<style scoped>

</style>
