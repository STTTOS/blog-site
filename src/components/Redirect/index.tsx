import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface RedirectProps {
  to: string
}
const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const nav = useNavigate()

  useEffect(() => nav(to), [to])
  return null
}

export default Redirect
