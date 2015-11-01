// class SideburnsTemplateCompiler {
//   processFilesForTarget(inputFiles) {
//     inputFiles.forEach(function (inputFile) {
//       let original = inputFile.getContentsAsString();
//       var inputFilePath = inputFile.getPathInPackage();
//       var outputFilePath = inputFile.getPathInPackage();
//       var fileOptions = inputFile.getFileOptions();
//       var toBeAdded = {
//         sourcePath: outputFilePath,
//         path: outputFilePath.replace('.jsx.html', '.jsx.js'),
//         data: original,
//         hash: inputFile.getSourceHash(),
//         sourceMap: null,
//         bare: !! fileOptions.bare
//       };
//
//       // source = "" + new ReactTemplate(original);
//       // const result = ReactTemplateCompiler.transpile(source, inputFile);
//       // toBeAdded.data = result.code;
//       // toBeAdded.hash = result.hash;
//       // toBeAdded.sourceMap = result.map;
//       //
//       inputFile.addJavaScript(toBeAdded);
//     });
//   }
// }
//
//
// Plugin.registerCompiler({
//   extensions: ['js']
// }, () => new SideburnsTemplateCompiler()
// );


Plugin.registerCompiler({
  extensions: ['js'],
}, function () {
  return new BabelCompiler();
});
