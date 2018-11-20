<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .mini_charts{
        width:300px;
        height:200px;
        margin-left:20px;
        margin-bottom:10px;
    }
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatorPath" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">{{userForm.name}}</b><br/>
                                            <Tag checkable v-bind:color="item.color" v-for="item in targettag" :name="item.name" :key="item.name" >{{item.name}}</Tag>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <div class="line-gray"></div>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">Last Login Time:</p></Col>
                                <Col span="16" class="padding-left-8">2018.06.11-13:32:20</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">Last Login Address:</p></Col>
                                <Col span="16" class="padding-left-8">Beijing</Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                To Do List
                            </p>
                            <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                                <Icon type="plus-round"></Icon>
                            </a>
                            <Modal
                                v-model="showAddNewTodo"
                                title="Add New"
                                @on-ok="addNew"
                                @on-cancel="cancelAdd">
                                <Row type="flex" justify="center">
                                    <Input v-model="newToDoItemValue" icon="compose" placeholder="Please input..." style="width: 300px" />
                                </Row>
                                <Row slot="footer">
                                    <Button type="text" @click="cancelAdd">Cancel</Button>
                                    <Button type="primary" @click="addNew">Confirm</Button>
                                </Row>
                            </Modal>
                            <div class="to-do-list-con">
                                <div v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item">
                                    <to-do-list-item :content="item.name"></to-do-list-item>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="analysis.totalteam"
                            iconType="android-people"
                            color="#2d8cf0"
                            intro-text="Teams"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="analysis.totaluser"
                            iconType="android-person"
                            color="#00BFFF"
                            :iconSize="50"
                            intro-text="Members"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="analysis.totalworkitem"
                            iconType="android-clipboard"
                            color="#495060"
                            intro-text="Kpi Task"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="analysis.monthworkitem"
                            iconType="android-archive"
                            color="#19be6b"
                            intro-text="Kpi Task this Month"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            Excellent Team
                        </p>
                        <div class="map-con">
                            <Col span="8" v-for="item in teamlist" :key="item.id">
                                <Card :body-style="{ padding: '10px' }">
                                    <div style="padding: 14px;">
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
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        Kpi Tasks Completed this month
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        Wiki
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        Member Levels
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';
import axios from 'axios'
import Vue from 'vue'
import ECharts from 'vue-echarts'
import Cookies from 'js-cookie';

Vue.component('chart', ECharts)

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        inforCard,
        mapDataTable,
        toDoListItem
    },
    data () {
        return {
            toDoList: [],
            analysis:{
                totalteam:0,
                totaluser:0,
                totalworkitem:0,
                weekworkitem:0,
                monthworkitem:0
            },
            showAddNewTodo: false,
            newToDoItemValue: '',
            teamvisible:false,
            team_name:'',
            teamlist:[],
            tempteammember:[],
            allmember:[],
            member_added:'',
            orglist:[],
            targettag:[],
            org_added:'',
            userForm: {
                name: '',
                cphone: '',
                org_name:'',
                team_name:'',
                email:''
            }
        };
    },
    created () {
        axios.get("http://mrbj-auto-01:8013/user/list").then(
            response=>{
                this.allmember=response.data
            }
        )
        axios.get("http://mrbj-auto-01:8013/workitem/analysis").then(
            response=>{
                this.analysis=response.data
            }
        )
        axios.get("http://mrbj-auto-01:8013/workitem/listbyusr?idusr="+Cookies.get('uuid_user')).then(
            response=>{
                this.toDoList=response.data
            }
        )
        axios.get('http://mrbj-auto-01:8013/tag/fetchtag?uuid_tag='+Cookies.get('uuid_user')).then(
            response=>{
                this.targettag=response.data
            }
        )
        console.log(Cookies.get('email'))
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
        axios.get("http://mrbj-auto-01:8013/team/listteamforindex").then(
            response=>{
                var length=response.data.length
                if(response.data.length>3){
                    length=3
                }
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
                                name:'Kpi Point',
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
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('to do item required');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        }
    }
};
</script>
