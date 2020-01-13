<template>
    <Modal v-model="isEdit" title="修改医生" @on-cancel="doCancel">
        <Form :model="doctorEditForm" ref="doctorEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="doctorEditForm.name"/>
            </FormItem>
            <FormItem label="性别：" prop="sex">
                <Select clearable v-model="doctorEditForm.sex" style="max-width: 60%">
                    <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.sex_desc}}</Option>
                </Select>
            </FormItem>
            <FormItem label="医院：" prop="hospital">
                <Input clearable v-model="doctorEditForm.hospital"/>
            </FormItem>
            <FormItem label="科室：" prop="department">
                <Input clearable v-model="doctorEditForm.department"/>
            </FormItem>
            <FormItem label="职位：" prop="physicianship">
                <Input clearable v-model="doctorEditForm.physicianship"/>
            </FormItem>
            <FormItem label="电话：" prop="phone">
                <Input clearable v-model="doctorEditForm.phone"/>
            </FormItem>
            <FormItem label="描述：" prop="description">
                <Input type="textarea" :rows="4" clearable v-model="doctorEditForm.description"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doDoctorEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editDoctor} from '@/libs/API/doctor.js';

    export default {
        name: 'doctor-edit',
        props: ['roleList'],
        data () {
            return {
                isEdit: false,
                doctorEditForm: {},
                editRules:{
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
            async doDoctorEdit() {
                let form = this.doctorEditForm;
                delete form.createTime;
                delete form.imgUrl;
                delete form.imgKey;
                delete form._index;
                delete form._rowKey;
                let res = await editDoctor(form);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.$emit('refreshDoctorList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.doctorEditForm.resetFields();//重置表单
                this.doctorEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
