<template>
    <Modal v-model="isAdd" title="添加视频" @on-cancel="doCancel">
        <Form :model="videoAddForm" ref="videoAddForm" :label-width="100" :rules="addRules">
            <FormItem label="标题：" prop="title">
                <Input clearable v-model="videoAddForm.title" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="副标题：" prop="subTitle">
                <Input clearable v-model="videoAddForm.subTitle" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="系列：" prop="series">
                <label>
                    <Select v-model="videoAddForm.series" style="width:200px">
                        <Option v-for="item in seriesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </label>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <label>
                    <Select v-model="videoAddForm.type" style="width:200px">
                        <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </label>
            </FormItem>
            <FormItem label="状态：" prop="status">
                <label>
                    <i-switch size="default" v-model="status" @on-change="changeStatus" />
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
            <FormItem label="图片1：" prop="img_url1">
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
            <FormItem label="图片2：" prop="img_url2">
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
                <Input type="textarea" :rows="4" clearable v-model="videoAddForm.desc" placeholder="请输入名称"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>

  import {addVideo} from '@/libs/API/video.js';
  import Cookies from 'js-cookie';

  export default {
    name: 'video-add',
    data() {
      return {
        status:true,
        seriesList:[],//所有视频系列list
        typeList:[],// 所有视频类型list
        isAdd: false,
        videoAddForm: {
          status:1,
          desc:"",//视频描述
          title:"",//视频标题
          subTitle:"",//视频副标题
          series:"",//视频系列
          type:"",//视频类型
        },
        myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
        uploadList: [],
        addRules: {
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
      async doVideoAdd() {
        let form = this.videoAddForm;
        let res = await addVideo(form);
        if (!res.code) {
          this.$Message.success('添加成功');
          this.$emit('refreshVideoList');//调用父组件获取用户列表方法刷新列表
          this.doCancel();
        } else {
          this.$Message.error(res.msg);
        }
      },
      changeStatus(status){
        if(status){
          this.videoAddForm.status = 1;
          this.$Message.info('已启用');
        }else{
          this.videoAddForm.status = 2;
          this.$Message.info('已禁用');
        }
      },
      doCancel() {
        this.$refs.videoAddForm.resetFields();//重置表单
        this.videoAddForm = {};
        this.isAdd = false;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请选择视频文件。'
        });
      },
      handleSuccess(res, file) {
        if (!res.code) {
          this.videoAddForm.url = res.data.url;
          this.videoAddForm.urlKey = res.data.fileName;
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
          this.videoAddForm.imgUrl1 = res.data.url;
          this.videoAddForm.imgUrl1Key = res.data.fileName;
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
          this.videoAddForm.imgUrl2 = res.data.url;
          this.videoAddForm.imgUrl2Key = res.data.fileName;
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
