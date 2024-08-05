import { renderViewType } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect, useState } from 'react'

export default function QucickLayout(props: ChildProps): JSX.Element {
  useEffect(() => {
    const timer = setInterval(() => {
      const rect = document.body.getBoundingClientRect()
      // console.log('oldsize', window.innerHeight, 'newsize', rect.height)
      if (rect.height == window.innerHeight) return
      changeSize(rect.height)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  async function changeSize(newheight: number = 0) {
    console.log('change sisze', newheight)
    await window.electron.ipcRenderer.invoke(
      webToManMsg.ResizeWindow,
      renderViewType.Quickview,
      0,
      newheight
    )
  }
  return <div>{props.children}</div>
}
