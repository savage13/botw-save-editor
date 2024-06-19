
export function parse_var(input: string): any {
  const re = /^(\w+)(\[ *(\d+) *\])?(\[ *(\d+) *\])?$/;
  const out = re.exec(input)
  if (out == null)
    return []
  let tmp: any = [out[1]]
  if (out[3])
    tmp.push(parseInt(out[3]))
  if (out[5])
    tmp.push(parseInt(out[5]))
  return tmp
}

function acomp(a: any, b: any) {

  if (!Array.isArray(a) || !Array.isArray(b))
    return false
  if (a.length != b.length)
    return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i])
      return false
  }
  return true
}


function run_test() {
  const tests: any = [
    ['a', ['a']],
    ['abc', ['abc']],
    ['abcdefg', ['abcdefg']],
    ['abc1ji', ['abc1ji']],
    ['abc1ji[0]', ['abc1ji', 0]],
    ['abc1ji[1]', ['abc1ji', 1]],
    ['abc1ji[10]', ['abc1ji', 10]],
    ['abc1ji[1][0]', ['abc1ji', 1, 0]],
    ['abc1ji[1][20]', ['abc1ji', 1, 20]],
    ['abc1ji[ 1][20 ]', ['abc1ji', 1, 20]],
    ['abc1ji[ 1 ][ 20 ]', ['abc1ji', 1, 20]],
    [' [ 1 ][ 20 ]', []],
  ]
  for (const t of tests) {
    let out = parse_var(t[0])
    if (!acomp(t[1], out))
      console.log(t, out)
  }
}
//run_test()
