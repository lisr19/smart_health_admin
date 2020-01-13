<template>
    <Modal v-model="isEdit" title="编辑广告" @on-cancel="doCancel">
        <Form :model="adEditForm" ref="adEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="adEditForm.name" placeholder="请输入名称"/>
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
                <DatePicker type="datetime" v-model="adEditForm.startTime" placeholder="请选择开始时间"
                            style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间：" prop="endTime">
                <DatePicker type="datetime" v-model="adEditForm.endTime" placeholder="请选择结束时间"
                            style="width: 200px"></DatePicker>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doAdEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editAd} from '@/libs/API/ad.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'ad-edit',
        data () {
            return {
                isEdit: false,
                adEditForm: {},
                uploadList: [],
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                editRules:{
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
            async doAdEdit() {
                let form = this.adEditForm;
                form.startTime=form.startTime.format("yyyy-MM-dd hh:mm:ss");
                form.endTime=form.endTime.format("yyyy-MM-dd hh:mm:ss");
                let res = await editAd(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshAdList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.adEditForm.resetFields();//重置表单
                this.adEditForm = {};
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
                    this.adEditForm.url = res.data.url;
                    this.adEditForm.urlKey = res.data.fileName;
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
                    this.adEditForm.imgUrl = res.data.url;
                    this.adEditForm.imgUrlKey = res.data.fileName;
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
