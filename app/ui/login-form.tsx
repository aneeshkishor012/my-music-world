'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  const onFinish = async (values: any) => {
    setIsPending(true);
    setErrorMessage(undefined);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setErrorMessage('Invalid credentials.');
        } else {
          setErrorMessage('Something went wrong.');
        }
      } else {
        // Successful login
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setErrorMessage('Something went wrong.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{ padding: '0 12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: '1.5rem' }}>Please log in to continue.</h2>

      <Form
        name="login_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email address' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            disabled={isPending}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            disabled={isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isPending}>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div style={{ minHeight: 48 }}>
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon />
        )}
      </div>
    </div>
  );
}