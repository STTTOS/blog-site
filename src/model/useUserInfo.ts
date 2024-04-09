import { create } from 'zustand'

import { getUser } from '@/service/user'
import { User } from '@/service/user/types'

interface UserState {
  user?: User
  fetch: () => Promise<void>
  loading: boolean
  /**清空用户信息 */
  reset: () => void
}
const useUserInfo = create<UserState>((set) => ({
  user: undefined,
  loading: true,
  async fetch() {
    try {
      set({ loading: true })
      const user = await getUser()
      set({ user })
    } catch (error) {
      // nothing to do
    } finally {
      set({ loading: false })
    }
  },
  reset() {
    set({ user: undefined })
  }
}))
export default useUserInfo
