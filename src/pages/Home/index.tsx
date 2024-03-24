import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/grid";

import {
  BookOutlined,
  CommentOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";

import style from "./index.module.scss";
import { confirmWhite } from "@/utils/common.util";
import whiteList from "@/config/whiteList.config";
import { useLocation } from "react-router-dom";
import MyContent from "@/content";
import { getHomeDetail } from "@/api/home.api";
import { HomeData } from "@/types/home";

const Home: React.FC = () => {
  const location = useLocation();
  let lineWrap = useRef<HTMLDivElement>(null);
  const isInWhiteList = confirmWhite(
    whiteList,
    "pathWhiteList",
    location.pathname
  );
  const [statistics, setStatistics] = useState<HomeData>();

  async function getHomeData() {
    const { data: res } = await getHomeDetail();
    if (res.code === 1001) {
      setStatistics(res.data?.row);
    }
  }

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    let myCharts = echarts.init(lineWrap.current);

    myCharts.setOption({
      title: {
        text: "网站实时流量",
        textStyle: {
          color: "#000",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#fff",
          },
        },
      },
      legend: {
        data: ["访问数量"],
        textStyle: {
          color: "#000",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "访问数量",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    });

    window.addEventListener("resize", () => {
      myCharts.resize();
    });
  }, [isInWhiteList]);

  const cardMap = [
    {
      id: 1,
      icon: (
        <UserOutlined className="md:text-4xl lg:text-5xl" rev={undefined} />
      ),
      title: "用户数量",
      num: statistics?.userTotal,
    },
    {
      id: 2,
      icon: (
        <BookOutlined className="md:text-4xl lg:text-5xl" rev={undefined} />
      ),
      title: "文章数量",
      num: statistics?.articleTotal,
    },
    {
      id: 3,
      icon: (
        <CommentOutlined className="md:text-4xl lg:text-5xl" rev={undefined} />
      ),
      title: "评论数量",
      num: statistics?.commentTotal,
    },
    {
      id: 4,
      icon: (
        <CommentOutlined className="md:text-4xl lg:text-5xl" rev={undefined} />
      ),
      title: "标签数量",
      num: statistics?.tagTotal,
    },
    {
      id: 5,
      icon: <EyeOutlined className="md:text-4xl lg:text-5xl" rev={undefined} />,
      title: "网站访问量",
      num: "50",
    },
  ];

  return (
    <MyContent.Consumer>
      {() => {
        return (
          <div className={style.home}>
            <div className={style.top_card}>
              {cardMap.map((item) => {
                return (
                  <div className={style.card} key={item.id}>
                    <div className="icon">{item.icon}</div>
                    <div className={style.info}>
                      <div className={style.info_title}>
                        <span className="md:text-sm lg:text-lg">
                          {item.title}
                        </span>
                      </div>
                      <div className={style.info_num}>
                        <span>{item.num}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className={style.lineCharts}
              ref={lineWrap}
              style={{ width: "100%", height: "400px" }}
            ></div>
          </div>
        );
      }}
    </MyContent.Consumer>
  );
};

export default Home;
