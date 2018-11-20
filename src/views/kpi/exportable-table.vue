<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './publish.less';
    .mini_charts{
        width:250px;
        height:170px;
    }
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Card :padding="0">
                    <p slot="title" class="card-title">
                        <Icon type="map"></Icon>
                        KPI Summary
                    </p>
                    <div class="map-con">
                        <Col span="4" v-for="item in teamlist" :key="item.id">
                            <Card>
                                <div>
                                    <span>{{item.title.text}}</span>
                                    <div class="bottom clearfix">
                                    <span style="font-size:12px">{{item.membercount}} members</span> 
                                    </div>
                                </div>
                                <chart :options="item" class="mini_charts"></chart>
                            </Card>
                        </Col>
                    </div>
                </Card>
            </Row> 
        </Row>
        <Row class="margin-top-10">
            <Card>
                <h4 slot="title">
                    <Row>
                        <Col>
                        <Icon type="android-archive"></Icon>
                        Export to Excel files
                        <span style="color:#2b85e4;margin-left:50px">File Name：</span>
                        <Input v-model="excelFileName" icon="document" placeholder="file name here..." style="width: 190px" />
                        <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                        <Button type="primary" size="small" @click="exportExcel">Export->Excel</Button>
                        <Button type="primary" size="small" @click="exportImage">Export->JPG</Button>
                        <div id="showImage">
                            <img id="exportedImage" style="height:0px;"/>
                        </div>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col>
                        <Icon type="android-search"></Icon>
                        Search By Options
                        <Select v-model="search_project" size="small" style="width:150px" placeholder="Project">
                            <Option v-for="item in projectList" :value="item.uuid_project" :key="item.uuid_project">{{ item.name }}</Option>
                        </Select>
                        <Select v-model="search_team" size="small" style="width:150px" placeholder="Team">
                            <Option v-for="item in tmlist" :value="item.uuid_team" :key="item.uuid_team">{{ item.name }}</Option>
                        </Select>
                        <Select v-model="search_user" filterable size="small" style="width:150px" placeholder="Member">
                            <Option v-for="item in usrlist" :value="item.uuid_user" :key="item.uuid_user">{{ item.name }}</Option>
                        </Select>
                        <Select v-model="search_status" size="small" style="width:150px;" placeholder="Status">
                            <Option v-for="item in statusList" :value="item.uuid_status" :key="item.uuid_status">{{ item.name }}</Option>
                        </Select>
                        <Button type="primary" size="small" @click="search">Search</Button>
                        <Button type="primary" size="small" @click="clearsearch">Clear</Button>
                        </Col>
                    </Row>
                </h4>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Col span="12">
                <Table :columns="excelColumns" :data="wklist" size="small" ref="tableExcel" @on-row-click="handleSelect"></Table>
            </Col>
            <Col span='12' class="padding-left-10">
                <Row>
                    <Col span="16">
                        <Card>
                            <p slot="title">
                                <Icon type="paper-airplane"></Icon>
                                Publish
                            </p>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="android-compass"></Icon>&nbsp;&nbsp;Name：</p></Col>
                                <Col span="16"><Input v-model="target.name" size="small" placeholder="name..." style="width:200px"/></Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="android-compass"></Icon>&nbsp;&nbsp;Point：</p></Col>
                                <Col span="16">
                                <Select size="small" v-model="target.score" style="width:150px" placeholder="point...">
                                    <Option v-for="item in scorelist" :value="item" :key="item">{{ item }}</Option>
                                </Select> 
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="android-compass"></Icon>&nbsp;&nbsp;Status：</p></Col>
                                <Col span="16">
                                <Select size="small" v-model="target.status_name" style="width:150px" placeholder="status...">
                                    <Option v-for="item in statusList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="android-home"></Icon>&nbsp;&nbsp;Project：</p></Col>
                                <Col span="16">
                                <Select v-model="target.project_name" size="small" style="width:150px" placeholder="project...">
                                    <Option v-for="item in projectList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="android-checkmark-circle"></Icon>&nbsp;&nbsp;Owner：</p></Col>
                                <Col span="16">
                                <Select v-model="target.owner_name" filterable @on-change="ownerchange" size="small" style="width:150px" placeholder="owner...">
                                    <Option v-for="item in usrlist" :value="item.name" :key="item.name">{{ item.name }}</Option>
                                </Select>
                                </Col>
                            </Row>
                            <Row class="margin-top-10">
                                <Col span="8"><p><Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;Deadline:</p></Col>
                                <Col span="16">
                                <Tag type="dot" color="red" size="small">{{target.deadline}}</Tag>
                                <Button v-show="!editdeadline" size="small" @click="handleEditdeadline" type="text">Modify</Button>
                                <transition name="publish-time">
                                    <div v-show="editdeadline" class="publish-time-picker-con">
                                        <div class="margin-top-10">
                                            <DatePicker v-model="target.deadline" type="datetime" style="width:200px;" placeholder="Choose deadline" ></DatePicker>                                    
                                        </div>
                                        <div class="margin-top-10">
                                            <Button type="primary" @click="handleSavedeadline" size="small">Confirm</Button>
                                            <Button type="ghost" @click="cancelEditdeadline" size="small">Cancel</Button>
                                        </div>
                                    </div>
                                </transition>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="8"><p><Icon type="android-time"></Icon>&nbsp;&nbsp;Create Time：</p></Col>
                                <Col span="16">
                                    <Tag type="dot" color="green" size="small">{{target.create_time}}</Tag>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="8"><p><Icon type="android-time"></Icon>&nbsp;&nbsp;Lastupdate Time：</p></Col>
                                <Col span="16"><Tag type="dot" color="green" size="small">{{target.lastupdate_time}}</Tag></Col>
                            </Row>
                            <Row class="margin-top-20 publish-button-con">
                                <span class="publish-button"><Button v-if="target.uuid_workitem!=''" icon="close" @click="delwk" style="width:90px;" type="error">Delete</Button></span>
                                <span class="publish-button"><Button icon="close" @click="clearwk" style="width:90px;" type="warning">Clear</Button></span>
                                <span class="publish-button"><Button v-if="target.uuid_workitem!=''" icon="checkmark" @click="remindwk" style="width:90px;" type="primary">Remind</Button></span>
                                <span class="publish-button"><Button v-if="target.uuid_workitem!=''" icon="checkmark" @click="updatewk" style="width:90px;" type="primary">Update</Button></span>
                                <span class="publish-button"><Button icon="checkmark" @click="addwk" style="width:90px;" type="success">New</Button></span>
                            </Row>
                        </Card>
                    </Col>
                    <Col span="8">
                        <Card>
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
                                <Col>
                                    <Select  size="small" filterable v-model="targetTagname" placeholder="Select WorkItem Tag">
                                        <Option v-for="item in TagList" :value="item" :key="item">{{ item }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row>                                              
                                <Col>
                                    <Input v-model="newTagName" size="small" placeholder="New Tag..."/>                                   
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button @click="handleAddNewTag" size="small" type="ghost">Add</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <div class="margin-top-10">
                    <Card>
                        <div>
                            <textarea id="workitemEditor"></textarea>
                        </div>
                    </Card>
                </div>
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
import tinymce from 'tinymce';
Vue.component('chart', ECharts)
export default {
    name: 'exportable-table',
    data () {
        return {
            table2excelData: table2excelData,
            excelColumns: [
                {
                    title:'Owner',
                    key:'owner_name',
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
                                }, params.row.owner_name)
                            ]);
                        }
                },
                {
                    title:'Name',
                    key:'name'
                },
                {
                    title:'Point',
                    key:'score',
                    width:80
                },
                {
                    title:'Project',
                    key:'project_name'
                },
                {
                    title:'Status',
                    key:'status_name',
                    render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type:'dot',
                                        color:params.row.status_name==='Not Start'?'#BEBEBE':(params.row.status_name==='In Progress'?'yellow':'green'),
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.status_name)
                            ]);
                        }
                },
                {
                    title:'Create Time',
                    key:'create_time',
                    render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type:'border',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.create_time)
                            ]);
                        }
                }
            ],
            search_status:'',
            search_project:'',
            search_user:'',
            search_team:'',
            imageName: '',
            selectMinRow: 1,
            selectMinCol: 1,
            maxRow: 0,
            minRow: 1,
            maxCol: 0,
            minCol: 1,
            excelFileName: '',
            tableExcel: {},
            fontSize: 16,
            wklist:[],
            scorelist:[1,2,3,4,5,6,7,8,9,10],
            statusList:[],
            projectList:[],
            usrlist:[],
            addingNewTag:false,
            newTagName:'',
            targetTagname:'',
            editdeadline:false,
            TagList:[],
            teamlist:[],
            tmlist:[],
            targettag:[],
            target:{
                uuid_workitem:"",
                uuid_owner:"",
                owner_name:"",
                score:0,
                uuid_project:"",
                project_name:"",
                uuid_status:"",
                status_name:"",
                name:"",
                summary:'',
                create_time:"",
                lastupdate_time:"",
                deadline:''
            }
        };
    },
    mounted () {
        axios.get('http://mrbj-auto-01:8013/workitem/listdetail').then(
            response=>{
                this.wklist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/tag/listtag?suite=workitem').then(
            response=>{
                this.TagList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/team/listdetail').then(
            response=>{
                this.tmlist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/wkstatus/list').then(
            response=>{
                this.statusList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/project/list').then(
            response=>{
                this.projectList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/user/list').then(
            response=>{
                this.usrlist=response.data
            }
        )
        tinymce.init({
            selector: '#workitemEditor',
            branding: false,
            elementpath: false,
            height: 600,
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s',
            image_advtab: true,
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            }
        });
        axios.get("http://mrbj-auto-01:8013/team/listteamforindex").then(
            response=>{
                var length=response.data.length
                for(var i=0;i<length;i++){
                    var team=response.data[i]
                    var datalist=[]
                    for(var j=0;j<team.users.length;j++){
                        var usr=team.users[j]
                        datalist.push({value:usr.wkcount,name:usr.name})
                    }
                    var tempitem= {
                        backgroundColor: '#2c343c',
                        id:team.UUID,
                        membercount:team.users.length,
                        title: {
                            text: team.name,
                            left: 'center',
                            top: 10,
                            textStyle: {
                                color: '#FFFAFA'
                            }
                        },

                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },

                        visualMap: {
                            show: false,
                            min: 0,
                            max: 100,
                            inRange: {
                                colorLightness: [0, 1]
                            }
                        },
                        series : [
                            {
                                name:'KPI Point',
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                data:datalist,
                                roseType: 'radius',
                                label: {
                                    normal: {
                                        textStyle: {
                                            color: 'rgba(255, 255, 255, 0.3)'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgba(255, 255, 255, 0.3)'
                                        },
                                        smooth: 0.2,
                                        length: 10,
                                        length2: 20
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#00EE00',
                                        shadowBlur: 100,
                                        shadowColor: 'rgba(0, 191, 255, 0.5)'
                                    }
                                },

                                animationType: 'scale',
                                animationEasing: 'elasticOut',
                                animationDelay: function (idx) {
                                    return Math.random() * 200;
                                }
                            }
                        ]
                    }                
                    this.teamlist.push(tempitem)
                }
            }
        )
    },
    destroyed () {
        tinymce.get('workitemEditor').destroy();
    },
    methods: {
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
                    axios.get("http://mrbj-auto-01:8013/tag/addtag?idtag="+this.target.uuid_workitem+"&name="+this.newTagName+"&suite=workitem").then(
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
                                axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_workitem).then(
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
                    axios.get("http://mrbj-auto-01:8013/tag/addtag?idtag="+this.target.uuid_workitem+"&name="+this.targetTagname+"&suite=workitem").then(
                        response=>{
                            if(response.data){                              
                            axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_workitem).then(
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
        handleEditdeadline () {
            this.editdeadline = !this.editdeadline;
        },
        handleSavedeadline () {
            this.editdeadline = false;
        },
        cancelEditdeadline () {
            this.editdeadline = false;
        },
        search(){
            axios.get("http://mrbj-auto-01:8013/workitem/search?idstatus="+this.search_status+"&idproject="+this.search_project+"&iduser="+this.search_user+"&idtm="+this.search_team).then(
                response=>{
                    this.wklist=response.data;
                }
            )
        },
        clearsearch(){
            this.search_status='';
            this.search_project='';
            this.search_user='';
            axios.get('http://mrbj-auto-01:8013/workitem/listdetail').then(
                response=>{
                    this.wklist=response.data
                }
            )
        },
        handleSelect(row){
            // console.log('Index:'+index)
            // var item=this.wklist[index]
            this.newTagName=''
            this.targetTagname=''
            axios.get("http://mrbj-auto-01:8013/workitem/fetchworkitem?id="+row.uuid_workitem).then(
                response=>{
                    if(response.data!=null){
                        this.target=response.data.Table[0];
                        tinymce.activeEditor.setContent(this.target.summary);
                        axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+this.target.uuid_workitem).then(
                            rp=>{
                                this.targettag=rp.data
                            }
                        )
                    }
                }
            )
            
        },
        ownerchange(row){
            this.target.owner_name=row;
        },
        removetag (event, name) {
            var index=0;
            for(var i=0;i<this.targettag.length;i++){
                if(this.targettag[i].name===name){
                    index=i
                }
            }
            axios.get("http://mrbj-auto-01:8013/tag/removetag?idtag="+this.target.uuid_workitem+"&name="+name).then(
                response=>{
                    if(response.data){
                        Vue.delete(this.targettag,index)
                        this.$Message.success("Tag removed")
                    }else{
                        this.$Message.error("Failed to remove Tag")
                    }
                }
            )
        },
        updatewk(){
            this.target.summary=tinymce.activeEditor.getContent();
            var index=0;
            for(var i=0;i<this.wklist.length;i++){
                if(this.wklist[i].uuid_workitem===this.target.uuid_workitem){
                    index=i;
                }
            }
            for(var i=0;i<this.usrlist.length;i++){
                if(this.usrlist[i].name===this.target.owner_name){
                    this.target.uuid_owner=this.usrlist[i].uuid_user;
                }
            }
            for(var i=0;i<this.statusList.length;i++){
                if(this.statusList[i].name===this.target.status_name){
                    this.target.uuid_status=this.statusList[i].uuid_status
                }
            }
            for(var i=0;i<this.projectList.length;i++){
                if(this.projectList[i].name===this.target.project_name){
                    this.target.uuid_project=this.projectList[i].uuid_project
                }
            }
            var temp=this.wklist[index];
            console.log('temp:'+temp.status_name)
            axios.post("http://mrbj-auto-01:8013/workitem/updateworkitem",{idwk:this.target.uuid_workitem,idwoner:this.target.uuid_owner,idpro:this.target.uuid_project,idsta:this.target.uuid_status,name:this.target.name,score:this.target.score,summary:this.target.summary,deadline:this.target.deadline}).then(
                response=>{
                    if(response.data){
                        temp.status_name=this.target.status_name
                        temp.owner_name=this.target.owner_name
                        temp.project_name=this.target.project_name
                        temp.name=this.target.name
                        temp.score=this.target.score
                        Vue.set(this.wklist,index,temp)
                        this.$Message.success('WorkItem Updated！');
                    }
                }
            )
        },
        remindwk(){
            axios.post('http://mrbj-auto-01:8013/mail/sendmail',{msg:'This Mail to remind you to finished task before deadline.<br>Task Name：'+this.target.name+'<br/>'+'Task Detail：'+this.target.summary+'<br/>'+'Deadline：'+this.target.deadline,uuid:this.target.uuid_owner,subject:'Task Reminder'}).then(
                rp=>{
                    if(rp.data){
                        this.$Message.success("Remind mail send to user.")
                    }else{
                        this.$Mesage.error("Failed to send mail to user.")
                    }
                }
            )
        },
        addwk(){
            for(var i=0;i<this.statusList.length;i++){
                if(this.statusList[i].name===this.target.status_name){
                    this.target.uuid_status=this.statusList[i].uuid_status
                }
            }
            for(var i=0;i<this.projectList.length;i++){
                if(this.projectList[i].name===this.target.project_name){
                    this.target.uuid_project=this.projectList[i].uuid_project
                }
            }
            for(var i=0;i<this.usrlist.length;i++){
                if(this.usrlist[i].name===this.target.owner_name){
                    this.target.uuid_owner=this.usrlist[i].uuid_user
                }
            }
            axios.post("http://mrbj-auto-01:8013/workitem/addworkitem",{idwoner:this.target.uuid_owner,idpro:this.target.uuid_project,idsta:this.target.uuid_status,name:this.target.name,score:this.target.score,summary:this.target.summary,deadline:this.target.deadline}).then(
                response=>{
                    if(response.data){   
                        axios.get('http://mrbj-auto-01:8013/workitem/listdetail').then(
                            rp=>{
                                this.wklist=rp.data
                            }
                        )
                        this.$Message.success('WorkItem added！');
                        axios.post('http://mrbj-auto-01:8013/mail/sendmail',{msg:'A New Task has been assigned to you. Please finished it before deadline.<br>Task Name:'+this.target.name+'<br/>'+'Task Detail:'+this.target.summary+'<br/>'+'Deadline:'+this.target.deadline,uuid:this.target.uuid_owner,subject:'New Task Assigned to you.'}).then(
                            rp=>{
                                if(rp.data){
                                    console.log('mail send.')
                                }else{
                                    console.log('failed to send mail')
                                }
                            }
                        )
                    }
                }
            )
        },
        clearwk(){
            this.target={
                uuid_workitem:"",
                uuid_owner:"",
                owner_name:"",
                score:0,
                uuid_project:"",
                project_name:"",
                uuid_status:"",
                status_name:"",
                name:"",
                summary:'',
                create_time:"",
                lastupdate_time:"",
                deadline:''
            }
        },
        delwk(){
            if(this.target.uuid_workitem===""){
                this.$Message.error("Please select target workitem first.")
            }else{
                var index=0
                for(var i=0;i<this.wklist.length;i++){
                    if(this.wklist[i].uuid_workitem===this.target.uuid_workitem){
                        index=i
                    }
                }
                axios.get('http://mrbj-auto-01:8013/workitem/delworkitem?id='+this.target.uuid_workitem).then(
                    response=>{
                        if(response.data){
                            Vue.delete(this.wklist,index)
                            this.target={
                                uuid_workitem:"",
                                uuid_owner:"",
                                owner_name:"",
                                score:0,
                                uuid_project:"",
                                project_name:"",
                                uuid_status:"",
                                status_name:"",
                                name:"",
                                summary:'',
                                create_time:"",
                                lastupdate_time:"",
                                deadline:''}
                            this.$Message.success("WorkItem deleted.")
                        }else{
                            this.$Message.error("Failed to delete workitem.")
                        }
                    }
                )
            }
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Origin Data'
                });
            } else if (type === 2) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Filterd Data',
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
                    a.download = vm.imageName ? vm.imageName : 'Untiled';
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
