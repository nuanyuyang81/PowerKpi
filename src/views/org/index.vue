<template>
    <div>
        <Row class="margin-top-10">
            <Col>
            <Icon type="android-search"></Icon>
            List Orgnazation Architecture Map
            <Select v-model="search_org" size="small" style="width:150px" placeholder="Orgnazation">
                <Option v-for="item in orglist" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
            <Button type="primary" size="small" @click="search">Search</Button>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col>
                <chart :options="option" style="width:100%;height:800px;"></chart>
            </Col>
        </Row>
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import ECharts from 'vue-echarts'
Vue.component('chart', ECharts)

export default {
    name:'orgnazation',
    data () {
        return {
            option:null,
            orglist:null,
            search_org:'Client Platform'
    }},
    mounted () { 
        axios.get('http://mrbj-auto-01:8013/org/list').then(
            response=>{
                this.orglist=response.data
            }
        )
        var orgname=this.search_org.replace(' ','%20')
        axios.get('http://mrbj-auto-01:8013/org/orgmap?org='+orgname).then(
            response=>{
                console.log(response.data)
                if(response.data!=null&&response.data.length>0){
                    var org={name:this.search_org,children:[]}
                    for(var i=0;i<response.data.length;i++){
                        var team={name:response.data[i].name,children:[]}
                        for(var j=0;j<response.data[i].users.length;j++){
                            var user=response.data[i].users[j]
                            team.children.push({"name":user.name,"value":0})
                        }
                        org.children.push(team)
                    }
                    this.option={
                        tooltip: {
                            trigger: 'item',
                            triggerOn: 'mousemove'
                        },
                        series: [
                            {
                                type: 'tree',
                                height:'90%',
                                data: [org],
                                top: '5%',
                                left: '10%',
                                bottom: '5%',
                                right: '20%',

                                lineStyle:{
                                    curveness:1.2
                                },

                                symbolSize: 10,
                                symbolOffset:[0,'-50%'],

                                label: {
                                    normal: {
                                        position: 'bottom',
                                        verticalAlign: 'middle',
                                        align: 'middle',
                                        fontSize: 15,
                                        height:50
                                    }
                                },
                                leaves: {
                                    label: {
                                        normal: {
                                            position: 'right',
                                            verticalAlign: 'middle',
                                            align: 'left'
                                        }
                                    }
                                }                                
                            }
                        ]
                    }
                }
            }
        )  
    },
    methods: {
        search(){
            var orgname=this.search_org.replace(' ','%20')
           axios.get('http://mrbj-auto-01:8013/org/orgmap?org='+orgname).then(
            response=>{
                console.log(response.data)
                if(response.data!=null&&response.data.length>0){
                    var org={name:this.search_org,children:[]}
                    for(var i=0;i<response.data.length;i++){
                        var team={name:response.data[i].name,children:[]}
                        for(var j=0;j<response.data[i].users.length;j++){
                            var user=response.data[i].users[j]
                            team.children.push({"name":user.name,"value":0})
                        }
                        org.children.push(team)
                    }
                    this.option={
                        tooltip: {
                            trigger: 'item',
                            triggerOn: 'mousemove'
                        },
                        series: [
                            {
                                type: 'tree',
                                height:'90%',
                                data: [org],
                                top: '5%',
                                left: '20%',
                                bottom: '5%',
                                right: '20%',

                                lineStyle:{
                                    curveness:1.2
                                },

                                symbolSize: 10,
                                symbolOffset:[0,'-50%'],

                                label: {
                                    normal: {
                                        position: 'bottom',
                                        verticalAlign: 'middle',
                                        align: 'middle',
                                        fontSize: 15,
                                        height:50
                                    }
                                },
                                leaves: {
                                    label: {
                                        normal: {
                                            position: 'right',
                                            verticalAlign: 'middle',
                                            align: 'left'
                                        }
                                    }
                                }                                
                            }
                        ]
                    }
                }
            }
            )  
        }
    }
}
</script>

