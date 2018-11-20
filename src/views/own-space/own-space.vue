<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                User Information
            </p>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="Name：" props="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="Email：" props="email">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.email" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="Phone：" props="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.phone" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="Orgnazation：">
                        <span>{{ userForm.org_name }}</span>
                    </FormItem>
                    <FormItem label="Team：">
                        <span>{{ userForm.team_name }}</span>
                    </FormItem>
                    <FormItem label="Password：">
                        <Button type="text" size="small" @click="showEditPassword">Modify</Button>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">Cancel</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">Save</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">Modify Password</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="Old Password" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="old password currently use" ></Input>
                </FormItem>
                <FormItem label="New Password" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="new password, not less than 6 chars" ></Input>
                </FormItem>
                <FormItem label="Confirm New Password" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="new password again" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">Cancel</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">Save</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'
import Cookies from 'js-cookie';

export default {
    name: 'ownspace_index',
    data () {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('new password not match'));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                name: '',
                cphone: '',
                org_name:'',
                team_name:'',
                email:''
            },
            uid: '', // 登录用户的userId
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            inforValidate: {
                name: [
                    { required: true, message: 'name', trigger: 'blur' }
                ]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: 'old password', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: 'new password', trigger: 'blur' },
                    { min: 6, message: '6 chars min', trigger: 'blur' },
                    { max: 32, message: '32 chars max', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: 'new password again', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit(){
            axios.post("http://mrbj-auto-01:8013/user/modusrinfo",{email:this.userForm.email,name:this.userForm.name,phone:this.userForm.phone,uuid:Cookies.get('uuid_user')}).then(
                        response=>{
                            if(response.data){
                                this.$Message.success('Info changed.');
                                this.editPasswordModal=false;
                            }else{
                                this.$Message.error('Failed.');
                            }
                        }
                    )
        },
        cancelEditPass () {
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    var newpassword=md5(this.editPasswordForm.newPass);
                    axios.post("http://mrbj-auto-01:8013/user/modpass",{email:this.userForm.email,newpass:newpassword}).then(
                        response=>{
                            if(response.data){
                                this.$Message.success('Password changed');
                                this.editPasswordModal=false;
                            }else{
                                this.$Message.error('Failed to change password');
                            }
                        }
                    )
                }
            });
        },
        init () {
            axios.get("http://mrbj-auto-01:8013/user/fetchuser?email="+Cookies.get('email')).then(
                response=>{
                    if(response.data!=null){
                        var target=response.data.Table[0];
                        this.userForm.name=target.name
                        this.userForm.org_name=target.org_name
                        this.userForm.team_name=target.team_name
                        this.userForm.phone=target.phone
                        this.userForm.email=target.email
                    }
                }
            )
        }
    },
    mounted () {
        this.init();
    }
};
</script>
