<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    Welcome
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="Email">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="Password">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>Login</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">Use Email and Password to Login in.</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
import md5 from 'js-md5'
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: 'Email cannot be empty', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Password cannot be empty', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            console.log(md5(this.form.password))
            axios.post("http://mrbj-auto-01:8013/user/login",{email:this.form.userName.toLowerCase(),password:md5(this.form.password)}).then(
                response=>{
                    if(response.data!=null){
                        var usrinfo=response.data;
                        Cookies.set('uuid_user',usrinfo.uuid_user);
                        Cookies.set('password',usrinfo.password);
                        Cookies.set('user',usrinfo.name);
                        Cookies.set('access',usrinfo.access);
                        Cookies.set('email',this.form.userName);
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                        this.$router.push({
                            name: 'home_index'
                        });
                    }else{
                        this.$Message.error('Failed to login in. If not registered, please contact administrator.');
                    }
                }
            )
            // this.$refs.loginForm.validate((valid) => {
            //     if (valid) {
            //         Cookies.set('user', this.form.userName);
            //         Cookies.set('password', this.form.password);
            //         this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
            //         if (this.form.userName === 'weiwei yin') {
            //             Cookies.set('access', 0);
            //         } else {
            //             Cookies.set('access', 1);
            //         }
            //         this.$router.push({
            //             name: 'home_index'
            //         });
            //     }
            // });
        }
    }
};
</script>

<style>

</style>
