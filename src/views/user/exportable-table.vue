<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './publish.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col>
                <Card>
                    <h4 slot="title">
                        <Row>
                            <Col>
                            <Icon type="android-archive"></Icon>
                            Export to Excel files
                            <span style="color:#2b85e4;margin-left:50px">File Name：</span>
                            <Input v-model="excelFileName" icon="document" placeholder="file name here..." style="width: 190px" />
                            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                            <Button type="primary" size="small" @click="exportExcel">Exrpot->Excel</Button>
                            <Button type="primary" size="small" @click="exportImage">Exrpot->JPG</Button>
                            <div id="showImage">
                                <img id="exportedImage" style="height:0px;"/>
                            </div>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col>
                            <Icon type="android-search"></Icon>
                            Search By Options
                            <Select v-model="search_team" filterable size="small" style="width:150px" placeholder="Team">
                                <Option v-for="item in teamlist" :value="item.uuid_team" :key="item.uuid_team">{{ item.name }}</Option>
                            </Select>
                            <Select v-model="search_company" filterable size="small" style="width:150px" placeholder="Company">
                                <Option v-for="item in companylist" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                            <Select v-model="search_title" filterable size="small" style="width:150px" placeholder="Level">
                                <Option v-for="item in titleList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                            <Button type="primary" size="small" @click="search">Search</Button>
                            <Button type="primary" size="small" @click="clearsearch">Clear</Button>
                            </Col>
                        </Row>
                    </h4>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="8">
                <Table :columns="excelColumns" :data="usrlist" size="small" ref="tableExcel" @on-row-click="handleSelect"></Table>
            </Col>
            <Col span='16' class="padding-left-10">
                <Row>
                    <Col span='12'>
                        <Card>
                            <p slot="title">
                                <Icon type="paper-airplane"></Icon>
                                Update Information
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-bookmark"></Icon>&nbsp;&nbsp;Name:
                                <Input v-model="target.name" size="small" placeholder="name..." style="width:200px"/>                                   
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-mail"></Icon>&nbsp;&nbsp;Email:
                                <Input v-model="target.email" size="small" placeholder="email..." style="width:200px"/>                                   
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-call"></Icon>&nbsp;&nbsp;Phone：
                                <Input v-model="target.phone" size="small" placeholder="phone..." style="width:200px"/>                                   
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-pin"></Icon>&nbsp;&nbsp;Company:
                                <Select v-model="target.company" filterable size="small" style="width:150px" placeholder="please select...">
                                    <Option v-for="item in companylist" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                                <Input v-model="newcompany" size="small" placeholder="new company" style="width:150px;"/>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-upload"></Icon>&nbsp;&nbsp;Level：
                                <Select v-model="target.title" filterable size="small" style="width:150px" placeholder="please select...">
                                    <Option v-for="item in titleList" :value="item" :key="item">{{ item }}</Option>
                                </Select>                                   
                                <Input v-model="newtitle" size="small" placeholder="new level" style="width:150px;"/>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="cash"></Icon>&nbsp;&nbsp;Salary：
                                <Input v-model="target.salary" size="small" placeholder="salary..." style="width:200px"/>                                   
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-locate"></Icon>&nbsp;&nbsp;Orgnazation:
                                <Select v-model="target.uuid_org" filterable size="small"  style="width:150px" placeholder="please select...">
                                    <Option v-for="item in orgList" :value="item.uuid_org" :key="item.uuid_org">{{ item.name }}</Option>
                                </Select>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-people"></Icon>&nbsp;&nbsp;Team：
                                <Select v-model="target.uuid_team" filterable size="small" style="width:150px" placeholder="please select...">
                                    <Option v-for="item in teamlist" :value="item.uuid_team" :key="item.uuid_team">{{ item.name }}</Option>
                                </Select>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;Join Time：
                                <Tag type="dot" color="red" size="small">{{target.join_time}}</Tag>
                                <Button v-show="!editjointime" size="small" @click="handleEditjointime" type="text">Modify</Button>
                                <transition name="publish-time">
                                    <div v-show="editjointime" class="publish-time-picker-con">
                                        <div class="margin-top-10">
                                            <DatePicker v-model="target.join_time" type="datetime" style="width:200px;" placeholder="Choose join time" ></DatePicker>                                    
                                        </div>
                                        <div class="margin-top-10">
                                            <Button type="primary" @click="handleSavejointime" size="small">Confirm</Button>
                                            <Button type="ghost" @click="cancelEditjointime" size="small">Cancel</Button>
                                        </div>
                                    </div>
                                </transition>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-time"></Icon>&nbsp;&nbsp;CreateTime：
                                <Tag type="dot" color="green">{{target.create_time}}</Tag>
                            </p>
                            <p class="margin-top-10">
                                <Icon type="android-time"></Icon>&nbsp;&nbsp;LastUpdateTime：
                                <Tag type="dot" color="green">{{target.lastupdate_time}}</Tag>
                            </p>
                            <Row class="margin-top-20 publish-button-con">
                                <span class="publish-button"><Button v-if="target.uuid_user!=''" icon="close" @click="deluser" style="width:90px;" type="error">Delete</Button></span>
                                <span class="publish-button"><Button icon="close" @click="clearuser" style="width:90px;" type="warning">Clear</Button></span>
                                <span class="publish-button"><Button v-if="target.uuid_user!=''" icon="checkmark" @click="updateuser" style="width:90px;" type="primary">Update</Button></span>
                                <span class="publish-button"><Button icon="checkmark" @click="adduser" style="width:90px;" type="success">New</Button></span>
                            </Row>
                        </Card>    
                        <Card class="margin-top-10">
                            <p slot="title">
                                <Icon type="ios-pricetags-outline"></Icon>
                                Tags
                            </p>
                            <Row>
                                <Col>
                                    <tag v-bind:color="item.color" closable v-for="item in targettag" :name="item.name" :key="item.name" @on-close="removetag">{{item.name}}</tag>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="10">
                                    <Select  size="small" filterable v-model="targetTagname" placeholder="Please select Tag">
                                        <Option v-for="item in TagList" :value="item" :key="item">{{ item }}</Option>
                                    </Select>
                                </Col>
                                <Col span="10">
                                    <Input v-model="newTagName" size="small" placeholder="New Tag..."/>                                   
                                </Col>
                                <Col span="4" class="padding-left-10">
                                    <Button @click="handleAddNewTag" size="small" type="ghost">Add Tag</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span='12' class="padding-left-10">                       
                        <Card>
                            <Button v-show="!addpromotion" size="small" @click="addpromotionmethod" type="text">Add Promotion Info</Button>
                            <transition name="publish-time">
                                <div v-show="addpromotion" class="margin-bottom-10">
                                    <div class="margin-top-10">
                                        <Input v-model="promotion_message" size="small" placeholder="Promotion Message..."/>                                   
                                    </div>
                                    <div class="margin-top-10">
                                        <DatePicker @on-change="seteffectivetime" type="datetime" style="width:200px;" placeholder="Choose Effective Time" ></DatePicker>                                    
                                    </div>
                                    <div class="margin-top-10">
                                        <Button type="primary" shape="circle" icon="checkmark-round" size="small" @click="handleaddpromotion">Add</Button>
                                        <Button type="ghost" shape="circle" icon="close-round" size="small" @click="canceladdpromotion">Cancel</Button>
                                    </div>
                                </div>
                            </transition>
                            <p slot="title">
                                <Icon type="ios-pricetags-outline"></Icon>
                                Promotion History
                            </p>
                            <Timeline>
                                <TimelineItem v-for="item in promotionlist" :key="item.uuid_promotion">
                                    <Row>
                                        <Col span="6"><p>Effective Time：</p></Col>
                                        <Col span="18"><Tag color="green">{{item.effective_time}}</Tag></Col>
                                    </Row>
                                    <Row>
                                        <Col span="6"><p>Justification：</p></Col>
                                        <Col span="18"><Tag color="blue">{{item.message}}</Tag></Col>
                                    </Row>
                                    <Row>
                                        <Col span="6"><Button type="text" @click="deletepromotion(item.uuid_promotion)">Delete This Record</Button></Col>
                                        <Col span="18"></Col>
                                    </Row>                                   
                                </TimelineItem>
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import {table2excelData, excelColumns} from './data/table2excel.js';
import table2excel from '@/libs/table2excel.js';
import html2canvas from 'html2canvas';
import Vue from 'vue';
import axios from 'axios';
import ECharts from 'vue-echarts'
Vue.component('chart', ECharts)

export default {
    name: 'exportable-table',
    data () {
        return {
            table2excelData: table2excelData,
            excelColumns: [
                {
                    title:'Name',
                    key:'name',
                    width:200,
                    render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type:'border',
                                        color:'blue',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.name)
                            ]);
                        }
                },
                {
                    title:'Company',
                    key:'company',
                    width:100
                },
                {
                    title:'Level',
                    key:'title',
                    width:100
                },
                {
                    title:'Team',
                    key:'team_name'
                }
             ],
            imageName: '',
            levelcharts:'',
            selectMinRow: 1,
            selectMinCol: 1,
            maxRow: 0,
            minRow: 1,
            maxCol: 0,
            minCol: 1,
            excelFileName: '',
            tableExcel: {},
            fontSize: 16,
            teamlist:[],
            search_team:'',
            search_company:'',
            search_title:'',
            orgList:[],
            usrlist:[],
            titleList:[],
            newtitle:'',
            companylist:[],
            newcompany:'',
            newTagName:'',
            targetTagname:'',
            targettag:[],
            TagList:[],
            promotionlist:[],
            addpromotion:false,
            promotion_effective_time:'',
            promotion_message:'',
            editjointime:false,
            target:{
                uuid_user:"",
                email:"",
                name:'',
                title:'',
                company:'',
                salary:0,
                phone:'',
                join_time:'',
                create_time:'',
                lastupdate_time:'',
                uuid_team:'',
                team_name:'',
                uuid_org:'',
                org_name:''
            }
        };
    },
    mounted () {
        axios.get('http://mrbj-auto-01:8013/team/listdetail').then(
            response=>{
                this.teamlist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/org/list').then(
            response=>{
                this.orgList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/user/listdetail').then(
            response=>{
                this.usrlist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/user/listtitle').then(
            rp=>{
                this.titleList=rp.data

            }
        )
        axios.get('http://mrbj-auto-01:8013/user/listcom').then(
            response=>{
                this.companylist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/tag/listtag?suite=user').then(
            response=>{
                this.TagList=response.data
            }
        )
    },
    methods: {
        search(){
            axios.get('http://mrbj-auto-01:8013/user/search?idtm='+this.search_team+"&company="+this.search_company+"&title="+this.search_title).then(
                response=>{
                    this.usrlist=response.data
                }
            )
        },
        clearsearch(){
            this.search_team=''
            this.search_company=''
            this.search_title=''
            axios.get('http://mrbj-auto-01:8013/user/listdetail').then(
                response=>{
                    this.usrlist=response.data
                }
            )
        },
        handleEditjointime () {
            this.editjointime = !this.editjointime;
        },
        handleSavejointime () {
            this.editjointime = false;
        },
        cancelEditjointime () {
            this.editjointime = false;
        },
        addpromotionmethod(){
            this.addpromotion=!this.addpromotion
        },
        seteffectivetime(datetime){
            this.promotion_effective_time=datetime
        },
        handleaddpromotion(){
            axios.post('http://mrbj-auto-01:8013/promotion/addpromotion',{uuid:this.target.uuid_user,message:this.promotion_message,effective_time:this.promotion_effective_time,type:'user'}).then(
                response=>{
                    if(response.data!=null){
                        this.promotionlist.push(response.data)
                        this.$Message.success("Promotion Information added.")
                        this.addpromotion=false
                    }else{
                        this.$Message.error("Failed to add promotion inforamtion")
                    }
                }
            )
        },
        canceladdpromotion(){
            this.addpromotion=false
        },
        deletepromotion(uuid){
            var index=0
            for(var i=0;i<this.promotionlist.length;i++){
                if(this.promotionlist[i].uuid_promotion===uuid){
                    index=i
                }
            }
            axios.get('http://mrbj-auto-01:8013/promotion/delete?uuid='+uuid).then(
                response=>{
                    if(response.data)
                    {
                        Vue.delete(this.promotionlist,index)
                        this.$Message.success("Promotion record deleted.")
                    }else{
                        this.$Message.error("Failed to delete promotion record.")
                    }
                }
            )
        },
        handleAddNewTag () {
            if(this.newTagName!=''){
                var addornot=true
                if(this.targettag!=null){
                     for(var i=0;i<this.targettag.length;i++){
                        if(this.targettag[i].name===this.newTagName){
                            addornot=false;
                        }
                    }                   
                }
                if(addornot){
                    axios.get("http://mrbj-auto-01:8013/tag/addtag?idtag="+this.target.uuid_user+"&name="+this.newTagName+"&suite=user").then(
                        response=>{
                            if(response.data){
                                var addtagornot=true
                                for(var i=0;i<this.TagList.length;i++){
                                    if(this.TagList[i]===this.newTagName){
                                        addtagornot=false;
                                    }
                                }
                                if(addtagornot){
                                    this.TagList.push(this.newTagName)
                                }
                                axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_user).then(
                                    rp=>{
                                        this.targettag=rp.data
                                    }
                                )
                                this.$Message.success("Tag Added.")
                            }else{
                                this.$Message.error("Failed to add Tag.")
                            }
                        }
                    )
                }else{
                    this.$Message.warning("Tag already exist.")
                }
                
            }
            if(this.targetTagname!=''){               
                var addornot=true
                if(this.targettag!=null){
                    for(var i=0;i<this.targettag.length;i++){
                        if(this.targettag[i].name===this.targetTagname){
                            addornot=false;
                        }
                    }
                }
                if(addornot){
                    axios.get("http://mrbj-auto-01:8013/tag/addtag?idtag="+this.target.uuid_user+"&name="+this.targetTagname+"&suite=user").then(
                        response=>{
                            if(response.data){                              
                                axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_user).then(
                                    rp=>{
                                        this.targettag=rp.data
                                    }
                                )
                                this.$Message.success("Tag Added")
                            }else{
                                this.$Message.error("Failed to add Tag")
                            }
                        }
                    )
                }else{
                    this.$Message.warning("Tag already exist")
                }
            }          
        },
        removetag (event, name) {
            var index=0;
            for(var i=0;i<this.targettag.length;i++){
                if(this.targettag[i].name===name){
                    index=i
                }
            }
            axios.get("http://mrbj-auto-01:8013/tag/removetag?idtag="+this.target.uuid_user+"&name="+name).then(
                response=>{
                    if(response.data){
                        Vue.delete(this.targettag,index)
                        this.$Message.success("标签移除")
                    }else{
                        this.$Message.error("移除失败")
                    }
                }
            )
        },
        handleSelect:function(row){
            this.newTagName=''
            this.targetTagname=''
            this.newcompany=''
            axios.get("http://mrbj-auto-01:8013/user/fetchuser?email="+row.email).then(
                response=>{
                    if(response.data!=null){
                        this.target=response.data.Table[0];
                        axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_user).then(
                            rp=>{
                                this.targettag=rp.data
                            }
                        )
                        axios.get('http://mrbj-auto-01:8013/promotion/listbyid?uuid='+this.target.uuid_user).then(
                            rp=>{
                                this.promotionlist=rp.data
                            }
                        )
                        axios.get('http://mrbj-auto-01:8013/user/listtitle').then(
                            response=>{
                                this.titleList=response.data
                            }
                        )
                        axios.get('http://mrbj-auto-01:8013/user/listcom').then(
                            response=>{
                                this.companylist=response.data
                            }
                        )
                    }
                }
            )

        },
        teamchange(row){
            for(var i=0;i<this.teamlist.length;i++){
                if(this.teamlist[i].uuid_team===row){
                    this.target.team_name=this.teamlist[i].name;
                    this.target.uuid_team=this.teamlist[i].uuid_team;
                }
            }
        },
        orgchange(row){
            for(var i=0;i<this.orgList.length;i++){
                if(this.orgList[i].uuid_org===row){
                    this.target.org_name=this.orgList[i].name;
                    this.target.uuid_org=this.orgList[i].uuid_org
                }
            }
        },
        updateuser:function(){
            var index=0;
            for(var i=0;i<this.usrlist.length;i++){
                if(this.usrlist[i].uuid_user===this.target.uuid_user){
                    index=i;
                }
            }
            var temp=this.usrlist[index];
            if(this.newcompany!=''){
                this.target.company=this.newcompany
            }
            if(this.newtitle!=''){
                this.target.title=this.newtitle
            }
            axios.post("http://mrbj-auto-01:8013/user/updateuser",{id:this.target.uuid_user,name:this.target.name,title:this.target.title,company:this.target.company,salary:this.target.salary,phone:this.target.phone,email:this.target.email,idorg:this.target.uuid_org,idteam:this.target.uuid_team,join_time:this.target.join_time}).then(
                response=>{
                    if(response.data){
                        temp.name=this.target.name
                        temp.company=this.target.company
                        temp.title=this.target.title
                        temp.org_name=this.target.org_name
                        temp.team_name=this.target.team_name
                        Vue.set(this.usrlist,index,temp)
                        this.$Message.success('User Info updated');
                    }else{
                        this.$Message.error('Failed to update user info')
                    }
                }
            )
        },
        adduser(){
            if(this.newcompany!=''){
                this.target.company=this.newcompany
            }
            if(this.newtitle!=''){
                this.target.title=this.newtitle
            }
            axios.post('http://mrbj-auto-01:8013/user/adduser',{email:this.target.email,name:this.target.name,title:this.target.title,company:this.target.company,salary:this.target.salary,phone:this.target.phone,idorg:this.target.uuid_org,idteam:this.target.uuid_team,join_time:this.target.join_time}).then(
                response=>{
                    if(response.data){
                        axios.get('http://mrbj-auto-01:8013/user/listdetail').then(
                            response=>{
                                this.usrlist=response.data
                            }
                        )
                        this.$Message.success("User added.")
                    }else{
                        this.$Message.error("Failed to add user")
                    }
                }
            )
        },
        clearuser(){
            this.target={
                uuid_user:"",
                email:"",
                name:'',
                title:'',
                join_time:'',
                create_time:'',
                lastupdate_time:'',
                uuid_team:'',
                team_name:'',
                uuid_org:'',
                org_name:''
            }
        },
        deluser(){
            axios.get('http://mrbj-auto-01:8013/user/deluser?id='+this.target.uuid_user).then(
                response=>{
                    if(response.data){
                        this.target={
                            uuid_user:"",
                            email:"",
                            name:'',
                            title:'',
                            join_time:'',
                            create_time:'',
                            lastupdate_time:'',
                            uuid_team:'',
                            team_name:'',
                            uuid_org:'',
                            org_name:''
                        }
                        this.$Message.success("User deleted.")
                    }else{
                        this.$Message.error("Failed to delete user.")
                    }
                }
            )
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Origin Data'
                });
            } else if (type === 2) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Filtered data',
                    original: false
                });
            } else if (type === 3) {
                this.$refs.tableCsv.exportCsv({
                    filename: this.csvFileName,
                    columns: this.columnsCsv.filter((col, index) => index >= this.selectMinCol - 1 && index <= this.selectMaxCol - 1),
                    data: this.csvData.filter((data, index) => index >= this.selectMinRow - 1 && index <= this.selectMaxRow - 1)
                });
            }
        },
        exportExcel () {
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
        },
        exportImage () {
            let vm = this;
            let table = this.$refs.tableExcel.$el;
            /* 这部分代码用来解决生成的图片不清晰的问题 */
            let tableWidth = table.offsetWidth;
            let tableHeight = table.offsetHeight;
            let canvas = document.createElement('canvas');
            canvas.width = tableWidth * 2;
            canvas.height = tableHeight * 2;
            canvas.style.width = tableWidth + 'px';
            canvas.style.height = tableHeight + 'px';
            document.body.appendChild(canvas);
            var context = canvas.getContext('2d');
            context.scale(2, 2);
            /* 这部分代码用来解决生成的图片不清晰的问题 */
            html2canvas(table, {
                // canvas: canvas,
                onrendered (image) {
                    var url = image.toDataURL();
                    document.getElementById('exportedImage').src = url;
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = vm.imageName ? vm.imageName : 'Untitled';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    // document.body.removeChild(canvas);
                }
            });
        }
    }
};
</script>
