import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/grid';

import {
  UserOutlined
} from '@ant-design/icons'

import style from './index.module.scss'
import { confirmWhite } from '@/utils/common.util'
import whiteList from '@/config/whiteList.config'
import { useLocation } from 'react-router-dom'
import MyContent from '@/content'

const Home: React.FC = () => {
  const location = useLocation()
  let lineWrap = useRef<HTMLDivElement>(null)
  const isInWhiteList = confirmWhite(whiteList, 'pathWhiteList', location.pathname)

  useEffect(() => {

    document.title = "首页"
    let myCharts = echarts.init(lineWrap.current)

    myCharts.setOption({
      title: {
        text: '网站实时流量',
        textStyle: {
          color: "#000"
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#fff',
          }
        }
      },
      legend: {
        data: ['访问数量'],
        textStyle: {
          color: "#000"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '访问数量',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        }
      ]
    })

    window.addEventListener('resize', () => {
      myCharts.resize()
    })
  }, [isInWhiteList])


  return (
    <MyContent.Consumer>
      {
        () => {          
          return (<div className={style.home}>
            <div className={style.top_card}>
              {
                [1, 2, 3, 4].map((item) => {

                  return (
                    <div className={style.card} key={item}>
                      <div className="icon">
                        <UserOutlined style={{ fontSize: '50px' }} rev={undefined} />
                      </div>
                      <div className={style.info}>
                        <div className={style.info_title}>
                          <span>用户注册总数</span>
                        </div>
                        <div className={style.info_num}>
                          <span>50人</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className={style.lineCharts} ref={lineWrap} style={{ width: "100%", height: "400px" }}></div>
          </div>)
        }
      }
    </MyContent.Consumer>
  )
}

export default Home
