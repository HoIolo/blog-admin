import {
  addWebsiteSetting,
  getWebsiteSetting,
  updateWebsiteSetting,
} from "@/api/website.api";
import { WebsiteSetting } from "@/types/website";
import { Button, Card, Divider, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const Setting: React.FC = () => {
  const [form] = Form.useForm();
  const [websiteSetting, setWebsiteSetting] = useState<WebsiteSetting>();
  const [websiteSettingCount, setWebsiteSettingCount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  async function getSetting() {
    const res = await getWebsiteSetting();
    if (res.data.code === 1001) {
      form.setFieldsValue(res.data?.data?.rows![0]);
      setWebsiteSetting(res.data?.data?.rows![0]);
      setWebsiteSettingCount(res.data.data?.count!);
    }
  }

  useEffect(() => {
    getSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 网站设置保存提交
  const websiteSettingUpdateSubmit = async () => {
    const values = form.getFieldsValue();
    let res = null;
    // 数量大于等于1时，更新，否则新增
    if (websiteSettingCount >= 1) {
      res = await updateWebsiteSetting({ id: websiteSetting?.id, ...values });
    } else res = await addWebsiteSetting(values);
    if (res.data.code === 1001) {
      messageApi.success("保存成功");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="custom_container">
        <Card
          title="网站全局设置"
          extra={
            <Button
              htmlType="submit"
              onClick={websiteSettingUpdateSubmit}
              type="primary"
            >
              保存
            </Button>
          }
        >
          <Form form={form} layout="vertical" initialValues={websiteSetting}>
            <Form.Item<WebsiteSetting>
              label="网站LOGO文本"
              tooltip="支持HTML"
              name="logo_text"
            >
              <Input />
            </Form.Item>
            <Form.Item<WebsiteSetting>
              label="大背景Typed语句"
              tooltip="请使用换行区分每一条语句"
              name="typed_text"
            >
              <Input.TextArea placeholder="例如: 今天天气真好" autoSize={{ minRows: 2, maxRows: 6 }}/>
            </Form.Item>
            <Divider plain>底部区域</Divider>
            <Form.Item<WebsiteSetting>
              label="网站底部文本"
              tooltip="支持HTML"
              name="footer_text"
            >
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }}/>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Setting;
