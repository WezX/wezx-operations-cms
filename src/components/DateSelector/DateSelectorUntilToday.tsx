import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export interface PropsType {
  defaultDate?: string;
  untilToday?: boolean;
  handleChangeDate: (res: string) => void;
}

class DateSelectorUntilToday extends PureComponent<PropsType> {
  disabledDate = (current = moment()) => {
    if (this.props.untilToday) {
      return current < moment().endOf('day');
    }
    return false;
  };

  handleChange = (date: moment.Moment | null) => {
    if (date) {
      this.props.handleChangeDate(date.format(dateFormat));
    }
  };

  render() {
    const { defaultDate } = this.props;
    const defaultValue = defaultDate !== '' ? moment(defaultDate) : moment();
    return (
      <div style={{ width: '100%' }}>
        <DatePicker
          style={{
            width: '100%'
          }}
          defaultValue={defaultValue}
          // @ts-ignore
          disabledDate={this.disabledDate}
          // @ts-ignore
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default DateSelectorUntilToday;
