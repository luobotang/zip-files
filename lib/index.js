var fs = require('fs')
var ZipFile = require("yazl").ZipFile
var grunt = require('grunt')

/*
 * @param {object} options
 * @param {object[]} options.files - 输入文件配置
 * @param {object[]} options.zips - 输出 zip 文件配置
 */
module.exports = function (options) {
	for (var i in options.zips) {
		zipFiles(options.zips[i], options.files)
	}
}

function zipFiles(out, inFiles) {
	var zip = new ZipFile()

	console.log('add files to ' + out.outFile + ':')

	out.files.forEach(function (file) {
		var fileOptions = inFiles[file]
		zipFilesTo(zip, fileOptions, file)
	})

	console.log('\n')

	zip.outputStream.pipe(
		fs.createWriteStream(out.outFile)
	).on('error', function () {
		console.log(out.outFile + ' - fail')
	}).on('close', function() {
		console.log(out.outFile + ' - done')
	})

	zip.end()
}

/*
 * @param {ZipFile} zip
 * @param {object} options
 * @param {string} options.files
 * @param {string} options.root
 * @param {string} options.prefix - add to file's metapath in zip file
 */
function zipFilesTo(zip, options, fileConfigName) {
	
	var rootLen = options.root.length
	var prefix = options.prefix || ''

	console.log('(from: ' + fileConfigName + ')')

	var files = grunt.file.expand(options.files)
	files.forEach(function (file) {
		if (grunt.file.isFile(file)) {
			var pathInZip = prefix + file.substr(rootLen)
			zip.addFile(file, pathInZip)

			console.log('- ' + file + ' -> ' + pathInZip)
		}
	})
}