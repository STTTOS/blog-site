import { VideoCameraOutlined } from '@ant-design/icons'
import { PluginProps, PluginComponent } from 'react-markdown-editor-lite'

import Upload from '@/components/Upload'
import { uploadFile } from '@/service/common'

export default class Counter extends PluginComponent {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'upload-video'
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left'
  // // 如果需要的话，可以在这里定义默认选项
  // static defaultConfig = {
  //   start: 0
  // }

  constructor(props: Readonly<PluginProps>) {
    super(props)

    this.handleUpload = this.handleUpload.bind(this)
    this.state = {
      num: this.getConfig('start')
    }
  }

  async handleUpload(file: File) {
    const url = await uploadFile({ file })
    this.editor.insertText(`![${file.name}](${url})`)
    return url
  }

  render() {
    return (
      <Upload
        accept=".mp4"
        listType="text"
        showFileList={false}
        maxSize={2 * 1024 * 1024}
        request={this.handleUpload}
      >
        <VideoCameraOutlined
          className="button"
          style={{ fontSize: 16, marginTop: 2 }}
        />
      </Upload>
    )
  }
}
