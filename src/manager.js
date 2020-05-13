const fs = require('fs')
const peerList = require('./peer-list')

function parsePackage(packageJSON) {
  const projectPeers = packageJSON["peerDependencies"]
  if (!projectPeers) {
    throw 'Peer-Manager Error: package.json does not contain any peer dependencies'
  }
  let nonMatchingPeers = {}
  Object.keys(projectPeers).forEach(function(peer) {
    if (!peerList[peer] || projectPeers[peer] !== peerList[peer]) {
      nonMatchingPeers[peer] = {
        expected: peerList[peer],
        got: projectPeers[peer]
      }
    }
  })

  return nonMatchingPeers
}

module.exports = function() {
  try {
    fs.readFile('./package.json', function(err, data) {
      if (err) throw err
      try {
        const packageJSON = JSON.parse(data)
        const nonMatches = parsePackage(packageJSON)
        const nonMatchesKeys = Object.keys(nonMatches)
        if (!nonMatchesKeys.length) {
          console.log('\x1b[32m%s\x1b[0m', 'Peer-Manager Success: package.json has matching peers')
        } else {
          console.log('\x1b[31m%s\x1b[0m', 'Peer-Manager Failed: package.json does not have matching peers')
          console.group()
          nonMatchesKeys.forEach(function(nonMatch) {
            console.log(nonMatch)
            console.log('\x1b[33m%s\x1b[0m', `${nonMatch}: expected ${nonMatches[nonMatch]["expected"]} but got ${nonMatches[nonMatch]["got"]}`)
          })
          console.groupEnd()
        }
      } catch (error) {
        throw error
      }
    })
  } catch (err) {
    console.error(err)
  }
}