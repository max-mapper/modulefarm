var chalk = require('chalk')
var getPackageReadme = require('get-package-readme')
var parallel = require('run-parallel')

/**
 * Given an array of npm package names, print out which packages have or don't have
 * modulefarm badges.
 * @param  {Array.<string>} pkgs
 */
module.exports = function check (pkgs) {
  var tasks = pkgs.map(function (pkg) {
    return function (cb) {
      getPackageReadme(pkg, function (err, readme) {
        if (err) return cb(err)
        cb(null, { name: pkg, readme: readme })
      })
    }
  })

  parallel(tasks, function (err, results) {
    if (err) throw err
    results.forEach(function (result) {
      var check = (/modulefarm.com/i.test(result.readme))
        ? chalk.bold(chalk.green('✓'))
        : chalk.bold(chalk.red('✗'))
      console.log(check + ' - ' + result.name)
    })
    console.log('Done!')
  })
}

module.exports([ 'webtorrent', 'run-parallel', 'concat-stream' ])
