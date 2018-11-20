<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
            let xAxisData = [];
            let data1 = [];
            let data2 = [];
            for (let i = 0; i < 20; i++) {
                xAxisData.push('类目' + i);
                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            }

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['Platform', 'Wireless', 'MTBF', 'HDMI', 'AV', 'PHAL', 'ETS'],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                series: [
                    {
                        name: '访问量',
                        type: 'bar',
                        data: [
                            {value: 7, name: 'HDMI', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 6, name: 'Wireless', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 10, name: 'MTBF', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 8, name: 'AV', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 9, name: 'Platform', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 8, name: 'PHAL', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 5, name: 'ETS', itemStyle: {normal: {color: '#2d8cf0'}}}
                        ]
                    }
                ]
            };

            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        });
    }
};
</script>
