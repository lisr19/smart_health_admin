//校验用判断

export const userRules = {
    name:[
        // {required: true, message: '姓名不能为空', trigger: 'blur'},
        {max: 20, message: '请输入20个以内字符', trigger: 'blur'},
        {
            pattern:/^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
            message:'姓只含有汉字、字母、下划线不能以下划线开头和结尾',
            trigger:'blur'
        }
    ],
    idNumber: [
        {pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '不合法的身份证号码', trigger: 'blur'}
    ],
    email: [
        {pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/, message: '不合法的邮箱', trigger: 'blur'}
    ],
    phone:[
        {required: true, message: '电话号码不能为空', trigger: 'blur'},
        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur'}
    ],
    sex:[{required: true, message: '性别不能为空', trigger: 'blur'}],
    password: [
        {
            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
            message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
            trigger: 'blur'
        }
    ],
    weight:[
        {pattern: /^[0-9]*\.?[0-9]*$/, message: '请输入合法体重', trigger: 'blur'}
    ],
    height:[
        {pattern: /^[0-9]*\.?[0-9]*$/, message: '请输入合法身高', trigger: 'blur'}
    ]
}