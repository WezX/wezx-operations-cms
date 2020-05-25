import React, { PureComponent } from 'react';
import {Upload, message} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import UploadChangeParam from 'antd/lib/upload/interface';
import {formatMessage} from "@@/plugin-locale/localeExports";

export type ImageUrlType = string | ArrayBuffer | null;

export interface ImageType {
  url: ImageUrlType;
  upload: boolean;
  name?: string;
  high?: number;
}

interface InputImageProps {
  img: ImageType;
  size?: {
    width?: number | string;
    height?: number | string;
  };
  fileSize?: number;
  outputFile: (img: ImageType) => void;
  multiple?: boolean;
}

interface InputImageState {
  loading: false,
}

function getBase64(
  img: Blob,
  callback: { (imageUrl: ImageUrlType): void },
) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default class InputSurface extends PureComponent<InputImageProps, InputImageState> {
  public state: InputImageState = {
    loading: false,
  }

  handleChange = (info: UploadChangeParam.UploadChangeParam) => {
    const { outputFile } = this.props;
    if (info.file.status === 'done') {
      getBase64(
        info.file.originFileObj as Blob,
        (imageUrl: ImageUrlType) => {
          const img = {
            url: imageUrl,
            name: info.file.name,
            upload: false,
          };
          return outputFile(img)
        },
      );
    }
  };

  beforeUpload = (file: UploadChangeParam.RcFile) => {
    const { fileSize } = this.props;
    if (fileSize) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(`图片大小必须小于${fileSize}MB！`);
      }
      return isLt2M;
    }
    return true
  };

  render() {
    const { img, size, multiple } = this.props;
    const { loading } = this.state;
    const sizeDefault = {
      width: 734,
    };
    const sizeNow = size ? {
      ...sizeDefault,
      ...size,
    } : sizeDefault;
    const uploadButton = (
      <div
        style={{ ...sizeNow }}
      >
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text"> {formatMessage({ id: 'article-edit.surface' })}</div>
      </div>
    );
    return (
      <div
        style={{ ...sizeNow }}
      >
        <Upload
          style={{ ...sizeNow }}
          listType="picture-card"
          accept="image/png,image/gif,image/jpeg"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          multiple={multiple}
        >
          {
            img.url !== '' ? <img
              src={img.url as string}
              alt={img.name}
              style={{ width: 734 }} /> : uploadButton
          }
        </Upload>
      </div>
    );
  }
}
