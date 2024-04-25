import { create } from 'zustand'

export interface EditOptionProps {
  /**隐私编辑模式 */
  isPrivate: boolean
  // eslint-disable-next-line no-unused-vars
  setPrivateMode?: (value: boolean) => void
}
const useEditOptions = create<EditOptionProps>((set) => ({
  isPrivate: localStorage.getItem('private') ? true : false,
  setPrivateMode(isPrivate: boolean) {
    set({ isPrivate })
  }
}))
export default useEditOptions
