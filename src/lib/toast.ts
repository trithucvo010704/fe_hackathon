export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

let toastCounter = 0;
export const listeners: ((message: ToastMessage) => void)[] = [];

const notify = (type: ToastMessage['type'], message: string) => {
  const id = `${Date.now()}-${toastCounter++}`;
  listeners.forEach(listener => listener({ id, type, message }));
};

export const toast = {
  success: (message: string) => notify('success', message),
  error: (message: string) => notify('error', message),
  info: (message: string) => notify('info', message),
  warning: (message: string) => notify('warning', message),
};
