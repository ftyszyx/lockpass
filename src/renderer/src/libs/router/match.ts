import { pathToRegexp, Key } from 'path-to-regexp'
import { MatchOption, MatchRes } from 'kl_router'
export function PathMatch(
  path: string = '',
  url: string = '',
  options: MatchOption = { sensitive: false, strict: false, end: false },
  debug: boolean = false
): MatchRes | null {
  const matchKeys: Key[] = []
  const pathRegexp = pathToRegexp(path, matchKeys, options) //get reg
  const matchResult = pathRegexp.exec(url) //check is match
  if (!matchResult) return null
  const matchVals = [].slice.call(matchResult, 1) //first element is path,not need
  const parmasObj: Record<string, string> = {}
  matchKeys.forEach((item, index) => {
    parmasObj[item.name] = matchVals[index]
  })
  const res = { params: parmasObj, url: matchResult[0], isExact: matchResult[0] === url, path }
  // if (debug) console.log("match res:", res, "path:", path, "url:", url, "exp:", pathRegexp, "key:", matchKeys);
  if (res != null && debug)
    console.log(`match: routepath:${path}  url:${url} option:${JSON.stringify(options)}`)
  return res
}
