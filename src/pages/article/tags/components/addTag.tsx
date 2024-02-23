import { Form, FormInstance, Input } from "antd";
import { useEffect } from "react";

type FieldType = {
  tagName?: string;
};

type propsType = {
  getForm: (form: FormInstance<FieldType>) => void;
  onsubmit: (values: any) => void;
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const AddTag: React.FC<propsType> = (props: propsType) => {
  const [form] = Form.useForm<FieldType>();

  useEffect(() => {
    props.getForm(form);
  }, []);
  
  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={props.onsubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="标签名称"
        name="tagName"
        rules={[{ required: true, message: "请输入标签名称！" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default AddTag;
