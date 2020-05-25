import { Card, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, history, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';

const { UserName, Password, Submit } = LoginFrom;

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  history.replace(redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({ ...values, type });
      if (msg.status === 'ok') {
        message.success('登陆成功！');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error('登陆失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}/>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <Card className={styles.card}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>WezX OCMS</span>
              </Link>
            </div>
          </div>

          <div className={styles.main}>
            <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
              <UserName
                name="userName"
                placeholder="用户名: wezx"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="密码: 123456"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
              <Submit loading={submitting}>登录</Submit>
            </LoginFrom>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
