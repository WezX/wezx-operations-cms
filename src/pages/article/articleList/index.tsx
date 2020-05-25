import React, { PureComponent } from 'react';
import { EditTwoTone } from '@ant-design/icons';
import {Card, List, Typography, Button, Checkbox, notification, Popconfirm} from 'antd';
import { history , formatMessage, Link } from 'umi';
import {queryRule, removeRule} from '@/services/article';
import {ListItem} from "@/pages/article/data";
import styles from './style.less';

const { Paragraph } = Typography;

interface DescriptionItemProps {
  label: string;
  content: string;
}

function DescriptionItem(props: DescriptionItemProps) {
  return (
    <span style={{marginRight: 16}}>
      {props.label}: {props.content}
    </span>
  );
}

interface ArticleListState {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number
  },
  data: ListItem[],
  batch: {
    active: boolean;
    data: number[];
  }
}

class ArticleList extends PureComponent<{}, ArticleListState>{
  public state: ArticleListState = {
    pagination: {
      currentPage: 1,
      pageSize: 1,
      total: 0
    },
    data: [],
    batch: {
      active: false,
      data: [],
    }
  };

  componentDidMount(): void {
    queryRule().then(value => {
      // eslint-disable-next-line no-console
      console.log(value);
      this.setState({
        pagination: {
          currentPage: value.current,
          pageSize: value.pageSize,
          total: value.total,
        },
        data: value.data,
      })
    });
  }

  changePage = (current: number) => {
    queryRule({
      currentPage: current,
    }).then((value: any) => {
      // eslint-disable-next-line no-console
      console.log(value);
      this.setState({
        pagination: {
          currentPage: value.current,
          pageSize: value.pageSize,
          total: value.total,
        },
        data: value.data,
      })
    });
  };

  onChange = (key: number) => {
    const { data } = this.state.batch;
    let check = false;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] === key) {
        check = true;
        data.splice(i, 1)
      }
    }
    if (!check) {
      data.push(key)
    }
    this.setState(state => ({
      batch: {
        ...state.batch,
        data,
      },
    }));
  };

  toggleBatch = () => {
    this.setState(state => ({
      batch: {
        data: [],
        active: !state.batch.active,
      },
    }));
  };

  onDelete = () => {
    const { batch } = this.state;
    removeRule({
      key: batch.data
    }).then(value => {
      // eslint-disable-next-line no-console
      console.log(value);
      notification.warning({
        message: formatMessage({ id: 'notification.delete.success' }),
      });
      this.setState({
        batch: {
          data: [],
          active: false,
        },
      });
      history.push('/article');
    });
  };

  render()  {
    const { pagination, data, batch } = this.state;
    return (
      <div>
        <div className={styles.actionBar}>
          {
            batch.active ?
              (<div>
                <Button
                  style={{marginRight: 8}}
                  onClick={this.toggleBatch}>
                  {formatMessage({ id: 'article.batch.off' })}
                </Button>
                <Popconfirm
                  disabled={batch.data.length === 0}
                  placement="bottomRight"
                  title="确认删除吗？"
                  onConfirm={() => this.onDelete()}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    disabled={batch.data.length === 0}
                    // @ts-ignore
                    type="danger"
                  >
                    {formatMessage({ id: 'article.delete' })}
                  </Button>
                </Popconfirm>
              </div>) :
              (<div>
                <Button
                  style={{marginRight: 8}}
                  onClick={this.toggleBatch}>
                  {formatMessage({ id: 'article.batch' })}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/article_edit');
                  }}
                >
                  {formatMessage({ id: 'article.add' })}
                </Button>
              </div>)
          }
        </div>
        <Card>
          <List<ListItem>
            itemLayout="vertical"
            size="large"
            pagination={{
              ...pagination,
              onChange: (current: number) => this.changePage(current),
            }}
            dataSource={data}
            renderItem={item => (
              <List.Item
                extra={
                  item.surface ?
                    <img
                      className={styles.surface}
                      alt={item.title}
                      // @ts-ignore
                      src={item.surface.url}
                    /> : null
                }
              >
                <List.Item.Meta
                  title={
                    batch.active ?
                      <Checkbox
                        onChange={() => this.onChange(item.key as number)}
                      >{item.title}</Checkbox> :
                      <Link to={`/article_edit?key=${  item.key}`}>
                        {item.title}
                        <EditTwoTone style={{marginLeft: 8}}/>
                      </Link>
                  }
                  description={
                    <div>
                      <DescriptionItem
                        label={formatMessage({ id: 'article.author' })}
                        content={item.author}
                      />
                      <DescriptionItem
                        label={formatMessage({ id: 'article.date' })}
                        content={item.date}
                      />
                      <DescriptionItem
                        label={formatMessage({ id: 'article.dead-date' })}
                        content={item.deadDate}
                      />
                      <DescriptionItem
                        label={formatMessage({ id: 'article.city' })}
                        content={item.city}
                      />
                    </div>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>
                  {item.content}
                </Paragraph>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}

export default ArticleList
