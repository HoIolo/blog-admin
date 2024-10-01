import { Form, FormInstance, Input } from "antd";
import { useEffect } from "react";

type FieldType = {
    name?: string;
};

type PropsType = {
    getForm: (form: FormInstance<FieldType>) => void
    onsubmit: (values: any) => void
}

const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };  

const AddType: React.FC<PropsType> = (props: PropsType) => {
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
        label="分类名称"
        name="name"
        rules={[{ required: true, message: "请输入分类名称！" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}

export default AddType;