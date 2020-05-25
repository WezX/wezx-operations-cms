import { notification } from 'antd';

interface checkItem {
  label: string;
  value: any;
}

export default function checkForm(data: checkItem[]) {
  let i = 0;
  while (i < data.length) {
    if (data[i].value === '') {
      notification.warning({
        message: `请填写${  data[i].label  }，该项为必填`,
      });
      return false
    }
    i += 1
  }
  return true
}
