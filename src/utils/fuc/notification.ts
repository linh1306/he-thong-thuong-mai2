import { notification } from 'antd';

export default function createNotification(status: 'success' | 'error' | 'warning', message: string) {
  switch (status) {
    case 'success':
      notification.success({
        message: status,
        description: message,
        placement: 'topRight',
      });
      break;
    case 'warning':
      notification.warning({
        message: status,
        description: message,
        placement: 'topRight',
      });
      break;
    case 'error':
      notification.error({
        message: status,
        description: message,
        placement: 'topRight',
      });
      break;
  }
}