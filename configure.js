#!/usr/bin/env node
const globby = require('globby')
const semverSort = require('semver-sort')
const { copy, writeJson } = require('fs-extra')

const updatesForUpdates = updates => ({
  addons: {
    '{2ba468bc-75b0-4d22-98fe-6fe3ec4ec120}': {
      updates,
    },
  },
})

const getUpdateForVersion = version => ({
  version,
  update_link: `https://ufcgprodist.now.sh/ufcgpro-${version}-an+fx.xpi`,
})

const getVersionFromPath = path => path.split('-')[1]

const last = coll => coll.reverse()[0]

const asyncGetXpis = async () => {
  return await globby(['ufcgpro*.xpi'])
}

const asyncCreateLatestFromFile = async filename => {
  await copy(filename, 'latest.xpi', { overwrite: true })
}

const asyncSaveUpdates = content => writeJson('./updates.json', content,{ spaces: 2 })

const main = async () => {
  const paths = await asyncGetXpis()
  const sortered = semverSort.asc(paths)
  const finalUpdates = updatesForUpdates(
    sortered.map(getVersionFromPath).map(getUpdateForVersion)
  )
  await asyncSaveUpdates(finalUpdates)
  await asyncCreateLatestFromFile(last(sortered)) 
}

main()
