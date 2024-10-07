import React from 'react'
export type ChildProps = {
  children?: React.ReactNode
}

export enum ViewFocusType {
  None,
  Menu = 'Menu',
  VaultMenu = 'VaultMenu',
  VaultItem = 'VaultItem'
}
