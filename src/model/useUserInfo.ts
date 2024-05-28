import { create } from 'zustand'

import { User } from '@/service/user/types'
import { getUser, userInfoType } from '@/service/user'

interface UserState {
  user?: User
  // eslint-disable-next-line no-unused-vars
  fetch: (type?: userInfoType) => Promise<void>
  loading: boolean
  /**清空用户信息 */
  reset: () => void
  // eslint-disable-next-line no-unused-vars
  set: (user: User) => void
}
const useUserInfo = create<UserState>((set) => ({
  user: undefined,
  loading: true,
  async fetch(type = 'manage') {
    try {
      set({ loading: true })
      const user = await getUser(type)
      set({ user })
    } catch (error) {
      // nothing to do
    } finally {
      set({ loading: false })
    }
  },
  set(user: User) {
    set({ user })
  },
  reset() {
    set({ user: undefined })
  }
}))
export default useUserInfo
