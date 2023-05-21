import * as echarts from "echarts";

export default function echartsOptions({mappingChinese}) {
    // 转换rgba颜色
    const hexToRgba = (hex, opacity) => {
        let rgbaColor = ''
        let reg = /^#[\da-f]{6}$/i
        // 0X默认解析为16进制
        if (reg.test(hex)) {
            rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
                "0x" + hex.slice(3, 5)
            )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`
        }
        return rgbaColor
    }
    let color = [
        "#5473e8",
        "#ff9f24",
    ]
    // ["1", "2", "3", "4", "5", "6", "7", "8"]
    // [100, 138, 350, 173, 180, 150, 180, 230]
    // [233, 233, 200, 180, 199, 233, 210, 180]
    // areaStyle关键代码 颜色 和hexToRgba方法 转换16进制颜色
    const options = {
        legend: {
            type: "scroll",
            itemHeight: 10,
            lineStyle: {
                width: 1
            },
            /*formatter: [
              '{a|{name}}'
            ].join('\n'),*/
            formatter: function (attr) {
                return mappingChinese[attr]
            },
        },
        grid: {
            left: '8%',
            right: '8%'
        },
        tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
                type: 'cross'
            },
            formatter(params) {
                let html = `<div style="width: 173px;font-size: 14px;font-weight: 700;color: #616161;">${params[0].name}</div>`;
                params.forEach(v => {
                    html += `
          <div style="display:flex;align-items: center;">
               <span style="display:inline-block;margin-right:5px;width:6px;height:2px;background-color:${v.color}"></span>
                ${mappingChinese[v.seriesName]}
                <span style="color:${color[0]};margin-left:10px;">${['photo_click_ratio', 'action_ratio'].includes(v.seriesName) ? v.value[v.seriesName] + '%' : v.value[v.seriesName]}</span>
          </div>`;
                })
                return html
            },
            extraCssText: 'background: #fff; border-radius: 2px;box-shadow: 0px 3px 6px 0px rgba(28,39,80,0.16);',
        },
        xAxis: [{
            type: "category",
            boundaryGap: false,
            axisLabel: {
                formatter: '{value}',
                color: "#333"
            },
            axisLine: {
                lineStyle: {
                    color: "#D9D9D9"
                }
            },
        }],
        yAxis: [
            {
                type: "value",
                // name: '单位：万千瓦时',
                axisLabel: {
                    color: "#666"
                },
                nameTextStyle: {
                    color: "#666",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            {
                type: "value",
                // name: '单位：万千瓦时',
                axisLabel: {
                    color: "#666",
                    formatter: '{value} %',
                },
                nameTextStyle: {
                    color: "#666",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
        ],
        series: [
            {
                type: "line",
                symbolSize: 5,
                smooth: true,
                // showSymbol: false,/
                zlevel: 3,
                itemStyle: {
                    color: "#FF9F24"
                },
                showSymbol: false,
                lineStyle: {
                    width: .5 // 设置线条粗细
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: hexToRgba('#FF9F24', .6)
                            },
                            {
                                offset: 1,
                                color: hexToRgba('#FFFFFF', .1)
                            }
                        ],
                        false
                    ),
                    shadowColor: hexToRgba('#0090FF', 0.1),
                    shadowBlur: 10
                },
            },
            {
                type: "line",
                smooth: true,
                // showSymbol: false,
                symbolSize: 5,
                zlevel: 3,
                itemStyle: {
                    color: "#5473E8"
                },
                lineStyle: {
                    width: .5 // 设置线条粗细
                },
                showSymbol: false,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: hexToRgba('#5473E8', .4)
                            },
                            {
                                offset: 1,
                                color: hexToRgba('#FFFFFF', .3)
                            }
                        ],
                        false
                    ),
                    shadowColor: hexToRgba('#36CE9E', 0.1),
                    shadowBlur: 10
                },
            },
        ]
    }
    return {
        options,
    }
}
