export function setCookie(name: string, value: string, day: number) {
  let expires = ''
  if (day) {
    const date = new Date()
    date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + '; expires=' + expires + '; path=/'
}

export function getCookie(name: string) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function eraseCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export function SetLocalValue(name: string, value: string) {
  if (value) {
    window.localStorage.setItem(name, value)
  } else {
    window.localStorage.removeItem(name)
  }
}

export function GetLocalValue(name: string) {
  return window.localStorage.getItem(name)
}
