import { ArticleType } from "@/types/article";
import { Button, Form, Image, Input, Select, Space, Upload } from "antd";
import style from "./articleDetail.module.scss";
import { useState } from "react";

type PropsType = {
  article?: ArticleType;
};

const ArticleDetail: React.FC<PropsType> = (props: PropsType) => {
  const { article } = props;
  const [disabled, setDisabled] = useState(true);

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="m-auto"
        initialValues={{
          type: article?.type,
          title: article?.title,
          description: article?.description,
        }}
      >
        <Form.Item<ArticleType>
          label="标题"
          name="title"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item<ArticleType>
          label="类型"
          name="type"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Select
            disabled={disabled}
            options={[
              { value: "前端", label: "前端" },
              { value: "后端", label: "后端" },
              { value: "其他", label: "其他" },
            ]}
          />
        </Form.Item>

        <Form.Item<ArticleType>
          label="描述"
          name="description"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item<ArticleType>
          label="配图"
          name="pic"
          rules={[{ required: true, message: "Please input your username!" }]}
          valuePropName="fileList"
        >
          <Upload
            listType="picture-card"
            className={style["pic-uploader"]}
            showUploadList={false}
            disabled={disabled}
            // beforeUpload={beforeUpload}
            // onChange={handleChange}
          >
            <Image preview={disabled} src={article?.pic} width={200} />
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
          <Space>
            <Button type="primary" onClick={() => setDisabled(false)}>
              编辑
            </Button>
            <Button type="primary">保存</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ArticleDetail;
