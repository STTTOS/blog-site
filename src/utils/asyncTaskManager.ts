import { EventEmitter } from 'events'

type Task = () => Promise<void>
// 批量处理async任务, 统一
class AsyncTaskManager extends EventEmitter {
  loading = false
  taskQueue: Task[] = []

  /* eslint-disable no-unused-vars */
  callback?: (loading: boolean) => void
  /**
   *
   * @param concurrency 最大并行执行任务数量
   */
  constructor(public concurrency = 5) {
    super()
    this.concurrency = concurrency
  }
  addTask(task: Task) {
    this.taskQueue.push(task)
    this.processQueue()
  }

  processQueue() {
    if (this.loading) return
    this.loading = true
    ;(async () => {
      while (this.taskQueue.length > 0) {
        const task = this.taskQueue.splice(0, this.concurrency)
        this.callback?.(this.loading)
        // this.emit("start");
        try {
          this.callback?.(this.loading)
          await Promise.allSettled(task?.map((t) => t?.()))
        } catch {
          // nothing to do
        }
      }

      // 等没有任务再被添加到队列时, 将loading设置为false
      this.loading = false
      this.callback?.(this.loading)
      // this.emit("end");
    })()
  }

  onStatusChange(callback: (loading: boolean) => void) {
    this.callback = callback
  }
}

export default AsyncTaskManager
