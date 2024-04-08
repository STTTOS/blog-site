import { create } from 'zustand'

import { getUser } from '@/service/user'
import { User } from '@/service/user/types'

interface UserState {
  user?: User
  fetch: () => void
  loading: boolean
}
const useUserInfo = create<UserState>((set) => ({
  user: undefined,
  loading: true,
  async fetch() {
    try {
      const user = await getUser()
      set({ user })
    } catch (error) {
      // nothing to do
    } finally {
      set({ loading: false })
    }
  }
}))
export default useUserInfo
