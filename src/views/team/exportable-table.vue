<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';
    @import './publish.less';
</style>

<template>
    <div>
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
                </h4>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Col span="9">
            <Card>
                <p slot="title">
                    <Icon type="stats-bars"></Icon>
                    Team Member Level Summary
                </p>
                <chart :options="levelcharts"></chart>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="12">
                <Table :columns="excelColumns" :data="teamlist" size="small" ref="tableExcel" @on-row-click="handleSelect"></Table>
            </Col>
            <Col span='12' class="padding-left-10">
            <Row>
                <Col>
                    <Card>
                        <p slot="title">
                            <Icon type="paper-airplane"></Icon>
                            Update
                        </p>
                        <Row class="margin-top-10">
                            <Col span="8"><p><Icon type="android-compass"></Icon>&nbsp;&nbsp;Name：</p></Col>
                            <Col span="16"><Input v-model="target.name" size="small" placeholder="name..." style="width:200px"/></Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="8"><p><Icon type="android-compass"></Icon>&nbsp;&nbsp;Orgnazation：</p></Col>
                            <Col span="16">
                            <Select v-model="target.uuid_org" size="small" @on-change="ownerchangeorg"  style="width:150px" placeholder="please select...">
                                <Option v-for="item in orgList" :value="item.uuid_org" :key="item.uuid_org">{{ item.name }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="8"><p><Icon type="android-checkmark-circle"></Icon>&nbsp;&nbsp;Owner：</p></Col>
                            <Col span="16">
                            <Tag type="dot" color="red">{{target.owner_name}}</Tag>
                            <Select v-model="target.uuid_owner" filterable @on-change="ownerchange" size="small" style="width:150px" placeholder="please select...">
                                <Option v-for="item in usrlist" :value="item.uuid_user" :key="item.uuid_user">{{ item.name }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8"><p><Icon type="cash"></Icon>&nbsp;&nbsp;Average Salary：</p></Col>
                            <Col span="16"><Tag type="dot" color="green" size="small">{{averagesalary}}</Tag></Col>
                        </Row>
                        <Row>
                            <Col span="8"><p><Icon type="android-time"></Icon>&nbsp;&nbsp;Create Time：</p></Col>
                            <Col span="16"><Tag type="dot" color="green" size="small">{{target.create_time}}</Tag></Col>
                        </Row>
                        <Row>
                            <Col span="8"><p><Icon type="android-time"></Icon>&nbsp;&nbsp;Lastupdate Time：</p></Col>
                            <Col span="16"><Tag type="dot" color="green" size="small">{{target.lastupdate_time}}</Tag></Col>
                        </Row>
                        <Row class="margin-top-10 publish-button-con">
                            <span class="publish-button"><Button v-if="target.uuid_team!=''" icon="close" @click="deltm" style="width:90px;" type="error">Delete</Button></span>
                            <span class="publish-button"><Button icon="close" @click="cleartm" style="width:90px;" type="warning">Clear</Button></span>
                            <span class="publish-button"><Button v-if="target.uuid_team!=''" icon="checkmark" @click="updatetm" style="width:90px;" type="primary">Update</Button></span>
                            <span class="publish-button"><Button icon="checkmark" @click="addtm" style="width:90px;" type="success">New</Button></span>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col>                       
                    <Card>
                        <Button v-show="!addchange" size="small" @click="addchangemethod" type="text">Add Change Info</Button>
                        <transition name="publish-time">
                            <div v-show="addchange" class="margin-bottom-10">
                                <div class="margin-top-10">
                                    <Input v-model="change_message" size="small" placeholder="Change Message..."/>                                   
                                </div>
                                <div class="margin-top-10">
                                    <DatePicker @on-change="seteffectivetime" type="datetime" style="width:200px;" placeholder="Choose Effective Time" ></DatePicker>                                    
                                </div>
                                <div class="margin-top-10">
                                    <Button type="primary" shape="circle" icon="checkmark-round" size="small" @click="handleaddchange">Add</Button>
                                    <Button type="ghost" shape="circle" icon="close-round" size="small" @click="canceladdchange">Cancel</Button>
                                </div>
                            </div>
                        </transition>
                        <p slot="title">
                            <Icon type="ios-pricetags-outline"></Icon>
                            Team Changes History
                        </p>
                        <Timeline>
                            <TimelineItem v-for="item in changelist" :key="item.uuid_promotion">
                                <Row>
                                    <Col span="6"><p>Change Time：</p></Col>
                                    <Col span="18"><Tag color="green">{{item.effective_time}}</Tag></Col>
                                </Row>
                                <Row>
                                    <Col span="6"><p>Claim：</p></Col>
                                    <Col span="18"><Tag color="blue">{{item.message}}</Tag></Col>
                                </Row>
                                <Row>
                                    <Col span="6"><Button type="text" @click="deletechange(item.uuid_promotion)">Delete This Record</Button></Col>
                                    <Col span="18"></Col>
                                </Row>                                   
                            </TimelineItem>
                        </Timeline>
                    </Card>
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
                    title:'Orgnazation',
                    key:'org_name'
                },
                {
                    title:'Create Time',
                    key:'status_name',
                    render: (h, params) => {
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type:'dot',
                                        color:'green',
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
            Openness: '公开',
            currentOpenness: '公开',
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
            teamlist:[],
            orgList:[],
            usrlist:[],
            titleList:[],
            changelist:[],
            addchange:false,
            change_message:'',
            change_effective_time:'',
            addingNewTag:false,
            newTagName:'',
            editdeadline:false,
            levelcharts:null,
            averagesalary:'',
            target:{
                uuid_team:"",
                uuid_owner:"",
                owner_name:"",
                uuid_org:"",
                org_name:"",
                uuid_status:"",
                name:"",
                create_time:"",
                lastupdate_time:"",
                users:[]
            }
        };
    },
    mounted () {
        axios.get('http://mrbj-auto-01:8013/org/list').then(
            response=>{
                this.orgList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/user/list').then(
            response=>{
                this.usrlist=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/user/listtitle').then(
            rp=>{
                this.titleList=rp.data

            }
        )
        axios.get('http://mrbj-auto-01:8013/team/listdetail').then(
            response=>{
                this.teamlist=response.data
                var teamnamelist=[]
                for(var i=0;i<this.teamlist.length;i++){
                    teamnamelist.push(this.teamlist[i].name)
                }
                var levellist=[]
                for(var i=0;i<this.titleList.length;i++){
                    levellist.push({name:this.titleList[i],max:3})
                }
                var teamlevel=[]
                axios.get('http://mrbj-auto-01:8013/analysis/team_level_analysis').then(
                    rp=>{
                        var teamanaysis=rp.data
                        for(var j=0;j<teamanaysis.length;j++){
                            var item={
                                value:[],name:''
                            }
                            item.name=teamanaysis[j].name
                            for(var k=0;k<teamanaysis[j].level.length;k++){
                                item.value.push(teamanaysis[j].level[k].levelcount)
                            }
                            teamlevel.push(item)
                        }
                        this.levelcharts={
                            tooltip: {},
                            legend: {
                                data: teamnamelist
                            },
                            radar: {
                                // shape: 'circle',
                                name: {
                                    textStyle: {
                                        color: '#fff',
                                        backgroundColor: '#999',
                                        borderRadius: 3,
                                        padding: [3, 5]
                                }
                                },
                                indicator: levellist
                            },
                            series: [{
                                name: 'Level',
                                type: 'radar',
                                data : teamlevel
                            }]
                        }

                    }
                )
            }
        )
    },
    methods: {
        addchangemethod(){
            this.addchange=!this.addchange
        },
        seteffectivetime(datetime){
            this.change_effective_time=datetime
        },
        handleaddchange(){
            axios.post('http://mrbj-auto-01:8013/promotion/addpromotion',{uuid:this.target.uuid_team,message:this.change_message,effective_time:this.change_effective_time,type:'team'}).then(
                response=>{
                    if(response.data!=null){
                        this.changelist.push(response.data)
                        this.$Message.success("Promotion Information added.")
                        this.addchange=false
                    }else{
                        this.$Message.error("Failed to add promotion inforamtion")
                    }
                }
            )
        },
        canceladdchange(){
            this.addchange=false
        },
        deletechange(uuid){
            var index=0
            for(var i=0;i<this.changelist.length;i++){
                if(this.changelist[i].uuid_promotion===uuid){
                    index=i
                }
            }
            axios.get('http://mrbj-auto-01:8013/promotion/delete?uuid='+uuid).then(
                response=>{
                    if(response.data)
                    {
                        Vue.delete(this.changelist,index)
                        this.$Message.success("Promotion record deleted.")
                    }else{
                        this.$Message.error("Failed to delete promotion record.")
                    }
                }
            )
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
        handleSelect:function(row){
            axios.get("http://mrbj-auto-01:8013/team/fetchteam?id="+row.uuid_team).then(
                response=>{
                    if(response.data!=null){
                        this.target=response.data;
                        axios.get('http://mrbj-auto-01:8013/team/averagesalary?uuid='+row.uuid_team).then(
                            rep=>{
                                this.averagesalary=rep.data;
                            }
                        )
                        axios.get('http://mrbj-auto-01:8013/promotion/listbyid?uuid='+this.target.uuid_team).then(
                            rp=>{
                                this.changelist=rp.data;
                            }
                        )
                    }
                }
            )
        },
        ownerchange(row){
            for(var i=0;i<this.usrlist.length;i++){
                if(this.usrlist[i].uuid_user===row){
                    this.target.owner_name=this.usrlist[i].name;
                }
            }
        },
        ownerchangeorg(row){
            for(var i=0;i<this.orgList.length;i++){
                if(this.orgList[i].uuid_org===row){
                    this.target.org_name=this.orgList[i].name;
                }
            }
        },
        updatetm:function(){
            var index=0;
            for(var i=0;i<this.teamlist.length;i++){
                if(this.teamlist[i].uuid_team===this.target.uuid_team){
                    index=i;
                }
            }
            var temp=this.teamlist[index];
            axios.post("http://mrbj-auto-01:8013/team/updateteam",{id:this.target.uuid_team,name:this.target.name,idowner:this.target.uuid_owner,idorg:this.target.uuid_org}).then(
                response=>{
                    if(response.data){
                        temp.owner_name=this.target.owner_name
                        temp.org_name=this.target.org_name
                        temp.name=this.target.name
                        Vue.set(this.teamlist,index,temp)
                        this.$Message.success('Team Info Updated');
                    }else{
                        this.$Message.error('Failed to update team info')
                    }
                }
            )
        },
        addtm(){
            for(var i=0;i<this.usrlist.length;i++){
                if(this.usrlist[i].uuid_user===this.target.uuid_owner){
                    this.target.owner_name=this.usrlist[i].name
                }
            }
            for(var i=0;i<this.orgList.length;i++){
                if(this.orgList[i].uuid_org===this.target.uuid_org){
                    this.target.org_name=this.orgList[i].name
                }
            }
            axios.post("http://mrbj-auto-01:8013/team/addteam",{name:this.target.name,idowner:this.target.uuid_owner,idorg:this.target.uuid_org}).then(
                response=>{
                    if(response.data){                
                        axios.get('http://mrbj-auto-01:8013/team/listdetail').then(
                            response=>{
                                this.teamlist=response.data
                            }
                        )
                        this.$Message.success('Team Info Updated');
                    }else{
                        this.$Message.error('Failed to update team info')
                    }
                }
            )
        },
        cleartm(){
            this.target={
                uuid_team:"",
                uuid_owner:"",
                owner_name:"",
                uuid_org:"",
                org_name:"",
                uuid_status:"",
                name:"",
                create_time:"",
                lastupdate_time:"",
                users:[]
            }
        },
        deltm(){
            var index=0;
            for(var i=0;i<this.teamlist.length;i++){
                if(this.teamlist[i].uuid_team===this.target.uuid_team){
                    index=i
                }
            }
            axios.get('http://mrbj-auto-01:8013/team/delteam?id='+this.target.uuid_team).then(
                response=>{
                    if(response.data){
                        Vue.delete(this.teamlist,index)
                        this.target={
                            uuid_team:"",
                            uuid_owner:"",
                            owner_name:"",
                            uuid_org:"",
                            org_name:"",
                            uuid_status:"",
                            name:"",
                            create_time:"",
                            lastupdate_time:"",
                            users:[]
                        }
                        this.$Message.success("Team deleted.")
                    }else{
                        this.$Message.error("Failed to delete team.")
                    }
                }
            )
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Origin data'
                });
            } else if (type === 2) {
                this.$refs.tableCsv.exportCsv({
                    filename: 'Filterd data',
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
