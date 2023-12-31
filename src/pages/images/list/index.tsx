import { GetImagesData, delImage, getImages } from "@/api/image.api";
import { Image } from "@/types/image";
import {
  Button,
  Col,
  Divider,
  Image as ImageComponent,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import style from "./index.module.scss";
import useTableData from "@/hooks/useTableData";
import { useState } from "react";
import { CODE } from "@/constant/global";
import { useDebounce } from "@/hooks/useDebounce";
import { formatBytes } from "@/utils/common.util";
import { url } from "inspector";

interface DataType {
  pic: string;
  key: string;
  picname: string;
  picurl: string;
  picsize: string;
}

const dataHandler = (data: Array<Image>): DataType[] => {
  return data.map((val: Image) => {
    return {
      pic: val.url,
      key: val.name,
      picname: val.name,
      picurl: val.url,
      picsize: val.size,
    };
  });
};

const ImageList: React.FC = () => {
  const [getImagesParams, setImagesParams] = useState<GetImagesData>({
    local: "false",
    keyword: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const { tableData, isloading, fetchTableData } = useTableData<Image>({
    fetchData: () => getImages(getImagesParams),
    dataHandler: dataHandler,
    watchData: [getImagesParams],
  });

  const [picSourceSelect] = useState([
    { value: "true", label: "本地" },
    { value: "false", label: "远程" },
  ]);

  const changePicSource = (value: string) =>
    setImagesParams({ ...getImagesParams, local: value as any });

  const confirmDelete = async (record: DataType) => {
    const { picname } = record;
    const { data: result } = await delImage({
      filename: picname,
      local: getImagesParams.local,
    });
    if (result.code === CODE.SUCCESS) {
      messageApi.success("删除成功");
      fetchTableData();
    } else {
      messageApi.success("删除失败," + result.msg);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "图片",
      dataIndex: "pic",
      key: "pic",
      width: 130,
      render: (url: string) => {
        let picSrc = url;
        let previewSrc = url;
        if (url.includes(process.env.REACT_APP_PIC_DOMAIN + "")) {
          picSrc = url + "!v1/both/100x50";
          previewSrc = url + "!v1";
        }
        return (
          <ImageComponent
            src={picSrc}
            preview={{ src: previewSrc }}
            width={100}
            height={50}
          />
        );
      },
    },
    {
      title: "图片名称",
      dataIndex: "picname",
      key: "picname",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "图片地址",
      dataIndex: "picurl",
      key: "picurl",
      ellipsis: true,
      width: "45%",
      render: (text: any) => text,
    },
    {
      title: "图片大小",
      dataIndex: "picsize",
      key: "picsize",
      render: (size: string) => formatBytes(+size),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record) => (
        <Space size="middle">
          <Popconfirm
            title="确认要删除吗？"
            description="删除后不可回复"
            onConfirm={() => confirmDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger type="text">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (args: any) => {
    setImagesParams({ ...getImagesParams, keyword: args[0].target.value });
  };
  const searchDebounce = useDebounce(handleSearch, 500);

  return (
    <>
      {contextHolder}
      <div className="custom_container">
        <Space direction="vertical" style={{ width: "100%" }} size={0}>
          <div className="user_list">
            <div className="user_option bg-white p-4 flex align-middle justify-between">
              <Space.Compact block>
                <Row className="w-full" justify="space-between">
                  <Col span={5}>
                    <div className="search">
                      <Input
                        onChange={searchDebounce}
                        placeholder="请输入需要查询的图片名称"
                      ></Input>
                    </div>
                  </Col>
                  <Col>
                    <div className="source">
                      <span>图片来源:</span>
                      <Select
                        className="ml-3"
                        defaultValue={getImagesParams.local}
                        onChange={changePicSource}
                        style={{ width: 80 }}
                        options={picSourceSelect}
                      />
                    </div>
                  </Col>
                </Row>
              </Space.Compact>
            </div>
            <Divider style={{ margin: 0 }} />
            <Table
              loading={isloading}
              rowClassName={style.table_item}
              columns={columns}
              dataSource={tableData}
            />
          </div>
        </Space>
      </div>
    </>
  );
};

export default ImageList;
