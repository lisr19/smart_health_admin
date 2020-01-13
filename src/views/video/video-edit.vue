<template>
    <Modal v-model="isEdit" title="编辑视频" @on-cancel="doCancel">
        <Form :model="videoEditForm" ref="videoEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="title">
                <Input clearable v-model="videoEditForm.title" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="副标题：" prop="subTitle">
                <Input clearable v-model="videoEditForm.subTitle" placeholder="请输入副标题"/>
            </FormItem>
            <FormItem label="系列：" prop="series">
                <label>
                    <Select v-model="videoEditForm.series" style="width:200px">
                        <Option v-for="item in seriesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </label>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <label>
                    <Select v-model="videoEditForm.type" style="width:200px">
                        <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </label>
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
            <FormItem label="图片url1：" prop="img_url1">
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
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传水平图片</Button>
                </Upload>
            </FormItem>
            <FormItem label="图片url2：" prop="img_url2">
                <Upload
                        ref="imgUpload2"
                        action="//120.24.0.130:8080/smart_health/upload/img"
                        :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                        :on-format-error="handleFormatError"
                        :headers="myHeader"
                        name="imgFile"
                        :on-success="img2HandleSuccess"
                        :before-upload="handleBeforeImgUpload2"
                >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传垂直图片</Button>
                </Upload>
            </FormItem>
            <FormItem label="描述：" prop="desc">
                <Input type="textarea" :rows="4" clearable v-model="videoEditForm.desc" placeholder="请输入名称"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editVideo} from '@/libs/API/video.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'video-edit',
        props: ['typeList','seriesList'],
        data () {
            return {
                isEdit: false,
                videoEditForm: {},
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                uploadList: [],
                editRules:{
                    title: [
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    type: [
                        {required: true, message: '类型不能为空', trigger: 'blur'},
                    ],
                    series: [
                        {required: true, message: '系列不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doVideoEdit() {
                let form = this.videoEditForm;
                delete form.createTime;
                delete form.updateTime;
                delete form._index;
                delete form._rowKey;
                let res = await editVideo(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshVideoList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.videoEditForm.resetFields();//重置表单
                this.videoEditForm = {};
                this.isEdit = false;
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择视频文件。'
                });
            },
            handleSuccess(res, file) {
                if (!res.code) {
                    this.videoEditForm.url = res.data.url;
                    this.videoEditForm.urlKey = res.data.fileName;
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
                    this.videoEditForm.imgUrl1 = res.data.url;
                    this.videoEditForm.imgUrl1Key = res.data.fileName;
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
            img2HandleSuccess(res, file) {
                if (!res.code) {
                    this.videoEditForm.imgUrl2 = res.data.url;
                    this.videoEditForm.imgUrl2Key = res.data.fileName;
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
            },
            handleBeforeImgUpload2() {
                const check = this.$refs.imgUpload2.fileList.length < 1;
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
