<template>
    <Modal v-model="isAdd" title="添加视频系列" @on-cancel="doCancel">
        <Form :model="videoSeriesAddForm" ref="videoSeriesAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="videoSeriesAddForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="描述：" prop="desc">
                <Input clearable v-model="videoSeriesAddForm.desc" placeholder="请输入描述"/>
            </FormItem>
            <FormItem label="图片：" prop="imageUrl">
                <Upload
                        ref="imgUpload"
                        action="//120.24.0.130:8080/smart_health/upload/img"
                        :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                        :on-format-error="handleFormatError"
                        :headers="myHeader"
                        name="imgFile"
                        :on-success="imgHandleSuccess"
                        :before-upload="handleBeforeImgUpload"
                >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoSeriesAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addVideoSeries} from '@/libs/API/videoSeries.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'videoSeries-add',
        data () {
            return {
                isAdd: false,
                videoSeriesAddForm: {},
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    imageUrl:[
                        {required: true, message: '链接不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doVideoSeriesAdd() {
                let form = this.videoSeriesAddForm;
                let res = await addVideoSeries(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshVideoSeriesList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.videoSeriesAddForm.resetFields();//重置表单
                this.videoSeriesAddForm = {};
                this.isAdd = false;
            },
            imgHandleSuccess(res, file) {
                if (!res.code) {
                    this.videoSeriesAddForm.imageUrl = res.data.url;
                    this.videoSeriesAddForm.imageKey = res.data.fileName;
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
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择视频文件。'
                });
            },
            handleBeforeImgUpload() {
                const check = this.$refs.imgUpload.fileList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传一张图片。'
                    });
                }
                return check;
            },
        }
    };
</script>

<style scoped>

</style>
