export function GetStrComp(text: string) {
  return text.split('\n').map((item, index) => {
    return (
      <span key={index}>
        {item}
        <br />
      </span>
    )
  })
}
