import React, { PureComponent } from 'react';
import {Button, Card, Input, Cascader, Form, notification, Popconfirm} from 'antd';
import {formatMessage} from "@@/plugin-locale/localeExports";
import InputSurface, {ImageType} from "@/components/InputSurface";
import {ListItem} from "@/pages/article/data";
import cities from '@/assets/files/cities';

import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'

import DateSelectorUntilToday from "@/components/DateSelector/DateSelectorUntilToday";
import {queryRule, updateRule, addRule, removeRule} from "@/services/article";
import checkForm from "@/utils/checkForm";
import {history} from "@@/core/history";
import styles from './style.less';

const itemEmpty: ListItem = {
  key: '',
  title: '',
  status: 0,
  date: '',
  deadDate: '',
  updateDate: '',
  province: '',
  city: '',
  author: '',
  surface: {
    url: '',
    upload: false,
  },
  content: '',
};

interface SelectCityProps {
  province: string;
  city: string;
  onChangeCities: (value: string[])=> void;
}

function SelectCity(props: SelectCityProps) {
  const {province, city} = props;
  return (
    <div>
      <Cascader
        // @ts-ignore
        options={cities()}
        onChange={props.onChangeCities}
        value={
          province === city ?
            [city] :
            [province, city]}
        allowClear
      />
    </div>
  )
}

interface ArticleEditProps {
  location: any;
}

interface ArticleEditState {
  article: ListItem;
}

class ArticleEdit extends PureComponent<ArticleEditProps, ArticleEditState>{
  public state: ArticleEditState = {
    article: itemEmpty,
  };

  componentDidMount(): void {
    const { location } = this.props;
    const key = location.search.split('=')[1];
    if (key) {
      queryRule({
        key: Number(key)
      }).then(value => {
        // eslint-disable-next-line no-console
        console.log(value);
        this.setState({
          article: value.data[0],
        });
      });
    }
  }

  handleChange = (editorState: string) => {
    this.setState(state => ({
      article: {
        ...state.article,
        content: editorState,
      },
    }));
  }

  handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>, property: string) => {
    const { value } = e.target;
    this.setState(state => ({
      article: {
        ...state.article,
        [property]: value,
      },
    }));
  };

  handleImage = (img: ImageType) => {
    this.setState(state => ({
      article: {
        ...state.article,
        surface: img,
      }
    }));
  };

  handleChangeDate = (date: string) => {
    this.setState(state => ({
      article: {
        ...state.article,
        deadDate: date,
      }
    }));
  };

  onChangeCities = (value: string[]) => {
    if (value.length === 2) {
      this.setState(state => ({
        article: {
          ...state.article,
          province: value[0] || '',
          city: value[1] || '',
        },
      }));
    } else {
      this.setState(state => ({
        article: {
          ...state.article,
          province: value[0] || '',
          city: value[0] || '',
        },
      }));
    }
  };

  onSubmit = (type: string) => {
    const { article } = this.state;
    const form = [
      {
        label: formatMessage({ id: 'article.surface' }),
        value: article.surface.url,
      },
      {
        label: formatMessage({ id: 'article.title' }),
        value: article.title,
      },
      {
        label: formatMessage({ id: 'article.city' }),
        value: article.city,
      },
      {
        label: formatMessage({ id: 'article.deadDate' }),
        value: article.deadDate,
      },
      {
        label: formatMessage({ id: 'article.content' }),
        value: article.content,
      },
    ];
    if (checkForm(form)) {
        if (type === 'update') {
          updateRule({
            key: Number(article.key),
          }).then(value => {
            // eslint-disable-next-line no-console
            console.log(value);
            notification.warning({
              message: formatMessage({ id: 'notification.update.success' }),
            });
          });
        } else {
          addRule(article).then(value => {
            // eslint-disable-next-line no-console
            console.log(value);
            notification.warning({
              message: formatMessage({ id: 'notification.add.success' }),
            });
            history.push('/article');
          });
        }
    }
  };

  onDelete = () => {
    const { article } = this.state;
    removeRule({
      key: [Number(article.key)]
    }).then(value => {
      // eslint-disable-next-line no-console
      console.log(value);
      notification.warning({
        message: formatMessage({ id: 'notification.delete.success' }),
      });
      history.push('/article');
    });
  };

  render () {
    const { article } = this.state;
    return (
      <div className={styles.container}>
        <Card className={styles.contentBox}>
          <div className={styles.actionBar}>
            {
              article.key !== '' ?
                <div>
                  <Button
                    type="primary"
                    onClick={() => this.onSubmit('update')}
                  >
                    {formatMessage({ id: 'article-edit.update' })}
                  </Button>
                  <Popconfirm
                    placement="bottomRight"
                    title="确认删除吗？"
                    onConfirm={() => this.onDelete()}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button
                      // @ts-ignore
                      type="danger"
                      style={{marginLeft: 8}}
                    >
                      {formatMessage({ id: 'article-edit.delete' })}
                    </Button>
                  </Popconfirm>
                </div>:
                <Button
                  type="primary"
                  onClick={() => this.onSubmit('add')}
                >
                  {formatMessage({ id: 'article-edit.add' })}
                </Button>
            }
          </div>
          <InputSurface img={article.surface} outputFile={this.handleImage}/>
          <Form>
            <div>
              <Input
                size="large"
                placeholder={formatMessage({ id: 'article-edit.edit.title' })}
                maxLength={50}
                value={article.title}
                onChange={_ => this.handleChangeValue(_, 'title')}
              />
            </div>
            <div style={{marginTop:24}}>
              <Form.Item
                label={formatMessage({ id: 'article-edit.edit.city' })}
              >
                <SelectCity
                  province={article.province}
                  city={article.city}
                  onChangeCities={this.onChangeCities}
                />
               </Form.Item>
              <Form.Item
                label={formatMessage({ id: 'article.dead-date' })}
              >
                <DateSelectorUntilToday
                  handleChangeDate={this.handleChangeDate}
                  defaultDate={article.deadDate}
                  untilToday
                />
              </Form.Item>
              <BraftEditor
                value={article.content}
                onChange={this.handleChange}
              />
            </div>
          </Form>
        </Card>
      </div>
    )
  }
}

export default ArticleEdit
