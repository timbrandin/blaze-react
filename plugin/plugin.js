Plugin.registerCompiler({
  extensions: ['html'],
  isTemplate: true
}, () => new ReactTemplateCompiler()
);
