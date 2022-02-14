import path from 'path'
import glob from 'fast-glob'
import { Octokit } from 'octokit'
import { docRoot, projRoot } from '../utils/paths'
import type { Plugin } from 'vite'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

interface ContributorInfo {
  name: string
  count: number
  email: string
  hash: string
}

// async function getContributorsAt(paths: string[]) {
//   // try {
//   //   const list = (
//   //     await git.raw(['log', '--pretty=format:"%an|%ae"', '--', ...paths])
//   //   )
//   //     .split('\n')
//   //     .map((i) => i.slice(1, -1).split('|') as [string, string])
//   //   const map: Record<string, ContributorInfo> = {}

//   //   list
//   //     .filter((i) => i[1])
//   //     .forEach(([name, email]) => {
//   //       if (!map[email]) {
//   //         map[email] = {
//   //           name,
//   //           count: 0,
//   //           email,
//   //           hash: md5(email),
//   //         }
//   //       }
//   //       map[email].count++
//   //     })

//   //   return Object.values(map).sort((a, b) => b.count - a.count)
//   // } catch (e) {
//   //   console.error(e)
//   //   return []
//   // }
//   const {
//     viewer: { login },
//   } = await octokit.graphql(`{
//     viewer {
//       login
//     }
//   }`)

//   console.log(login)
//   return []
// }

export async function getContributors() {
  // const components = await glob('*', {
  //   cwd: path.resolve(projRoot, 'packages/components'),
  //   onlyDirectories: true,
  // })
  // const result = await Promise.all(
  //   components.map(async (name) => {
  //     return [
  //       name,
  //       await getContributorsAt([
  //         path.resolve(projRoot, `packages/components/${name}`),
  //         path.resolve(projRoot, `packages/theme-chalk/src/${name}*`),
  //         path.resolve(docRoot, `examples/${name}`),
  //         path.resolve(docRoot, `en-US/component/${name}*`),
  //       ]),
  //     ]
  //   })
  // )
  // return Object.fromEntries(result)

  const {
    viewer: { login },
  } = await octokit.graphql(`{
    viewer {
      login
    }
  }`)
  console.log(login)

  return {}
}

const ID = '/virtual-contributors'

export async function Contributors(): Promise<Plugin> {
  const data = await getContributors()
  return {
    name: 'element-plus-contributors',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID) return null
      return `export default ${JSON.stringify(data)}`
    },
  }
}
