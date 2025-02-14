import dayjs from 'dayjs'
import { create } from 'zustand'

import { getUnReadMomentsCount } from '@/service/timeline'

const unreadMomentsCountKey = 'unread-moments-count'

export const setUnreadMomentCount = () => {
  localStorage.setItem(unreadMomentsCountKey, dayjs().toISOString())
}
interface CountState {
  count?: number
  // eslint-disable-next-line no-unused-vars
  fetch: () => Promise<void>
  loading: boolean
  /**清空用户信息 */
  reset: () => void
  // eslint-disable-next-line no-unused-vars
  set: (user: number) => void
}
const useUnreadMomentsCount = create<CountState>((set) => ({
  count: 0,
  loading: true,
  async fetch() {
    try {
      set({ loading: true })
      const now = dayjs().toISOString()
      const count = await getUnReadMomentsCount({
        startDate: localStorage.getItem(unreadMomentsCountKey) || now
      })
      set({ loading: false, count })
    } catch (error) {
      // nothing to do
      console.log(error)
    } finally {
      set({ loading: false })
    }
  },
  set(count: number) {
    set({ count })
  },
  reset() {
    set({ count: 0 })
  }
}))
export default useUnreadMomentsCount
