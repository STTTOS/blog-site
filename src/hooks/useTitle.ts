import { useEffect } from 'react'

const useTitle = (title?: string) => {
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
}
export default useTitle
