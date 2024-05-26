'use client'
import React, { useEffect, useState } from 'react';
import { App, Button, Select, Space } from 'antd';
function speak(text: string, voiceName: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  const voices = window.speechSynthesis.getVoices();

  utterance.voice = voices.find(voice => voice.name === voiceName) ?? null;
  window.speechSynthesis.speak(utterance);
}

interface IVoiceOption {
  value: string;
  label: string;
}

function getListVoice() {
  return window.speechSynthesis.getVoices();
}

export default function Test() {
  const { message, modal, notification } = App.useApp();
  const [voicesName, setVoicesName] = useState('')
  const [voices, setVoices] = useState<IVoiceOption[]>([])

  const getvoi = () => {
    const listVoice = getListVoice()
    console.log(listVoice);
    
    const voiceOptions: IVoiceOption[] = []
    listVoice.forEach(voice => {
      voiceOptions.push({ value: voice.name, label: voice.name })
    });
    setVoices(voiceOptions)
  }


  const showMessage = () => {
    getvoi()
    message.success('Success!');
  };

  const showModal = () => {
    modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
    });
  };

  const showNotification = () => {
    notification.info({
      message: `Notification topLeft`,
      description: 'Hello, Ant Design!!',
      placement: 'topRight',
    });
  };
  const sp = () => {
    if ('speechSynthesis' in window) {
      speak('Create Text to Speech Converter using JavaScript', voicesName);
    } else {
      console.log('Trình duyệt của bạn không hỗ trợ Web Speech API.');
    }
  };

  return (
    <Space wrap>
      <Select
        style={{ width: 300 }}
        onChange={(value: string) => setVoicesName(value)}
        options={voices}
      />
      <Button type="primary" onClick={showMessage}>
        Open message
      </Button>
      <Button type="primary" onClick={showModal}>
        Open modal
      </Button>
      <Button type="primary" onClick={showNotification}>
        Open notification
      </Button>
      <Button type="primary" onClick={sp}>
        nói
      </Button>
    </Space>
  );
};