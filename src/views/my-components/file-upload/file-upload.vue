<style lang="less">
    @import '../../../styles/common.less';
    @import 'upload.less';
</style>


<template>
    <div>
        <Row>
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="upload"></Icon>
                        上传图片
                    </p>
                    <div class="height-120px">
                        <Row type="flex" justify="center" align="middle" class="height-100">
                            <Upload
                                    action="//192.168.0.123:8080/smart_health/upload/img"
                                    :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                                    :on-format-error="handleFormatError"
                                    :headers="myHeader"
                                    :on-success="handleSuccess2"
                                    :on-progress="handleProgress"
                            >
                                <span>选择图片上传&nbsp;&nbsp;</span>
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                            </Upload>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="upload"></Icon>
                        上传视频
                    </p>
                    <div class="height-120px">
                        <Row type="flex" justify="center" align="middle" class="height-100">
                            <Upload
                                    action="//192.168.0.123:8080/smart_health/upload/video"
                                    :format="['mp4', 'avi', 'mkv', 'rmvb', 'flv', 'wmv']"
                                    :on-format-error="handleFormatError"
                                    :headers="myHeader"
                                    :name="fileName"
                                    :on-success="handleSuccess2"
                                    :on-error="handleError"
                            >
                                <span>选择视频上传&nbsp;&nbsp;</span>
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传视频</Button>
                            </Upload>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span="8" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="upload"></Icon>
                        上传apk
                    </p>
                    <div class="height-120px">
                        <Row type="flex" justify="center" align="middle" class="height-100">
                            <Upload
                                action="//192.168.0.123:8080/smart_health/upload/apk"
                                :format="['apk']"
                                :on-format-error="handleFormatError"
                                :headers="myHeader"
                            >
                                <span>选择apk&nbsp;&nbsp;</span>
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传apk</Button>
                            </Upload>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>

    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        name: 'file-upload',
        data () {
            return {
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: [],
                myHeader: {'phone': Cookies.get('user'), authorization: localStorage.token},
                fileName: 'videoFile'
            };
        },
        methods: {
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            handleBeforeUpload (file) {
                this.$Notice.warning({
                    title: '文件准备上传',
                    desc: '文件 ' + file.name + ' 准备上传。'
                });
            },
            handleProgress (event, file) {
                this.$Notice.info({
                    title: '文件正在上传',
                    desc: '文件 ' + file.name + ' 正在上传。'
                });
            },
            handleSuccess (evnet, file) {
                this.$Notice.success({
                    title: '文件上传成功',
                    desc: '文件 ' + file.name + ' 上传成功。'
                });
                console.log('success');
            },
            handleError (event, file) {
                this.$Notice.error({
                    title: '文件上传成功',
                    desc: '文件 ' + file.name + ' 上传失败。'
                });
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
            // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess2 (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
                this.$Notice.success({
                    title: '文件上传成功',
                    desc: '文件 ' + file.name + ' 上传成功。'
                });
                console.log(res);
            },
            handleFormatError2 (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload2 () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    });
                }
                return check;
            }
        },
        mounted () {
            // this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>
