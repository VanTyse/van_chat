import { useEffect } from 'react'
import './index.css'

export const Mask = ({ showMask = false, setShowMask }) => {
  return <div onClick={e => {
    e.stopPropagation()
    setShowMask(false)
  }} className={`mask ${showMask ? 'show-mask' : 'pull-mask'}`} />
}