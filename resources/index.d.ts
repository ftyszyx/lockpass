declare module '*?.png' {
  const value: any
  export = value
}

// node asset
declare module '*?asset' {
  const src: string
  export default src
}
