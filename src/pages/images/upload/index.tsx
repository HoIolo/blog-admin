import { InboxOutlined } from "@ant-design/icons";
import {
  UploadProps,
  ConfigProvider,
  UploadFile,
  Button,
  App,
  Space,
  Select,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import "./index.css";
import { useState } from "react";
import { RcFile } from "antd/es/upload";
import { uploadImage } from "@/api/image.api";
import { AxiosProgressEvent } from "axios";

const ImagesUpload: React.FC = () => {
  const { message } = App.useApp();
  const [uploadFile, setUploadFile] = useState<{
    fileList: UploadFile[];
    handleProcess: any;
    handleSuccess: any;
    handleError: any;
  }>({
    fileList: [],
    handleProcess: [],
    handleSuccess: [],
    handleError: [],
  });
  const [uploading, setUploading] = useState(false);

  const [islocal, setIslocal] = useState("true");

  const handleUpload = () => {
    setUploading(true);
    for (let i = 0; i < uploadFile.fileList.length; i++) {
      const formData = new FormData();
      formData.append("file", uploadFile.fileList[i] as RcFile);
      formData.append("local", islocal);
      uploadImage(formData, (progressEvent: AxiosProgressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded / (progressEvent.total as number)) * 100
        );
        uploadFile.handleProcess[i]({ percent }, uploadFile.fileList[i]);
      })
        .then((res) => {
          // 上传成功，移除对应的处理函数和文件
          setUploadFile((preState) => {
            return {
              ...uploadFile,
              fileList: preState.fileList.filter(
                (v) => v.uid !== uploadFile.fileList[i].uid
              ),
              handleSuccess: preState.handleSuccess.filter(
                (v: any) => v !== uploadFile.handleSuccess[i]
              ),
              handleError: preState.handleError.filter(
                (v: any) => v !== uploadFile.handleError[i]
              ),
              handleProcess: preState.handleProcess.filter(
                (v: any) => v !== uploadFile.handleProcess[i]
              ),
            };
          });
          uploadFile.handleSuccess[i](res);
        })
        .catch((e) => {
          uploadFile.handleError[i](e);
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    listType: "picture",
    onChange(info) {
      const { status } = info.file;
      const errorMsg = "图片上传失败";
      const successMsg = "图片上传成功";
      if (status !== "uploading") {
        // 待上传。。。
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} ${successMsg}`);
      } else if (status === "error") {
        message.error(`${info.file.name} ${errorMsg}`);
      }
    },
    beforeUpload: (file) => {
      setUploadFile((prevState) => {
        return {
          ...uploadFile,
          fileList: [...prevState.fileList, file],
        };
      });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: "small",
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    customRequest: (option) => {
      const { onProgress, onError, onSuccess } = option;
      setUploadFile((prevState) => {
        return {
          ...uploadFile,
          handleProcess: [...prevState.handleProcess, onProgress],
          handleSuccess: [...prevState.handleSuccess, onSuccess],
          handleError: [...prevState.handleError, onError],
        };
      });
    },
  };

  const changeUploadPicSource = (value: string) => setIslocal(value);

  return (
    <div className="custom_container">
      <ConfigProvider
        theme={{
          token: {
            colorFillAlter: "#fff",
            padding: 100,
          },
        }}
      >
        <Space direction="vertical" className="w-full">
          <Space className="action">
            <span>上传方式:</span>
            <Select
              defaultValue={islocal}
              onChange={changeUploadPicSource}
              options={[
                { value: "true", label: "本地" },
                { value: "false", label: "远程" },
              ]}
            ></Select>
          </Space>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined rev={undefined} />
            </p>
            <p className="ant-upload-text">
              点击此处，或者将文件拖到此处进行上传
            </p>
            <p className="ant-upload-hint">
              支持单个或批量上传。严格禁止 上传公司数据或其他被禁止的文件。
            </p>
          </Dragger>
        </Space>
        <div className="upload_option text-right">
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={uploadFile.fileList.length === 0}
            loading={uploading}
          >
            {uploading ? "上传中" : "开始上传"}
          </Button>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ImagesUpload;
