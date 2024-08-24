import { pathToRegexp, Key } from 'path-to-regexp'
import { MatchOption, MatchRes } from './index'
export function PathMatch(
  path: string = '',
  url: string = '',
  options: MatchOption = { sensitive: false, strict: false, end: false },
  debug: boolean = false
): MatchRes | null {
  const matchKeys: Key[] = []
  const pathRegexp = pathToRegexp(path, matchKeys, options) //get reg
  const matchResult = pathRegexp.exec(url) //check is match
  if (!matchResult) {
    if (debug) {
      console.log('not match: routepath:', path, 'url:', url, 'option:', JSON.stringify(options))
    }
    return null
  }
  const matchVals = [].slice.call(matchResult, 1) //first element is path,not need
  const parmasObj: Record<string, string> = {}
  matchKeys.forEach((item, index) => {
    parmasObj[item.name] = matchVals[index]
  })
  const res = { params: parmasObj, url: matchResult[0], isExact: matchResult[0] === url, path }
  if (debug) {
    if (res != null) {
      console.log(`match: routepath:${path}  url:${url} option:${JSON.stringify(options)}`)
    } else {
      console.log('not match: routepath:', path, 'url:', url, 'option:', JSON.stringify(options))
    }
  }
  return res
}
