<template>
    <Modal v-model="isAdd" title="添加医生" @on-cancel="doCancel">
        <Form :model="doctorAddForm" ref="doctorAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="doctorAddForm.name"/>
            </FormItem>
            <FormItem label="性别：" prop="sex">
                <Select clearable v-model="doctorAddForm.sex" style="max-width: 60%">
                    <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.sex_desc}}</Option>
                </Select>
            </FormItem>
            <FormItem label="医院：" prop="hospital">
                <Input clearable v-model="doctorAddForm.hospital"/>
            </FormItem>
            <FormItem label="科室：" prop="department">
                <Input clearable v-model="doctorAddForm.department"/>
            </FormItem>
            <FormItem label="职位：" prop="physicianship">
                <Input clearable v-model="doctorAddForm.physicianship"/>
            </FormItem>
            <FormItem label="电话：" prop="phone">
                <Input clearable v-model="doctorAddForm.phone"/>
            </FormItem>
            <FormItem label="描述：" prop="description">
                <Input type="textarea" :rows="4" clearable v-model="doctorAddForm.description"/>
            </FormItem>
            <FormItem label="头像：" prop="img_url">
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
            <Button type="primary" @click="doDoctorAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addDoctor} from '@/libs/API/doctor.js';
    import Cookies from 'js-cookie';

    export default {
        name: 'doctor-add',
        props: ['roleList'],
        data () {
            return {
                isAdd: false,
                doctorAddForm: {},
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    hospital:[
                        {required: true, message: '医院不能为空', trigger: 'blur'},
                    ],
                    department:[
                        {required: true, message: '科室不能为空', trigger: 'blur'},
                    ],
                    physicianship:[
                        {required: true, message: '职位不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doDoctorAdd() {
                let form = this.doctorAddForm;
                let res = await addDoctor(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshDoctorList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.doctorAddForm.resetFields();//重置表单
                this.doctorAddForm = {};
                this.isAdd = false;
            },
            imgHandleSuccess(res, file) {
                if (!res.code) {
                    this.doctorAddForm.avatarUrl = res.data.url;
                    this.doctorAddForm.avatarKey = res.data.fileName;
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
            }
        }
    };
</script>

<style scoped>

</style>
