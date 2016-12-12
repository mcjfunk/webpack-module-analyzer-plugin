function ModuleAnalyzerPlugin(options = {}) {
    options.filename = options.filename || 'outputStats';
    options.srcDir = options.srcDir || 'src';
    this.options = options;
}

ModuleAnalyzerPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
        const stats = compilation.getStats().toJson();

        const modules = stats.modules.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (b.name < a.name) {
                return 1;
            }
            return 0;
        });

        const externals = ['EXTERNALS\n---------'];
        const srcFiles = ['\nSOURCE FILES\n--------------------'];
        const modulesFiles = ['\nINCLUDED MODULES\n--------------------'];

        modules.forEach((module) => {
            // Externals
            if (module.name.includes('external ')) {
                externals.push(module.name.replace(/external /, ''));
            // Source Files
            } else if (module.name.includes(`./${this.options.srcDir}/`)) {
                // If the module name includes the issuerName, then it's a less loader line, which looks
                // like a duplicate of the actual less file. Ignore that. This may be obscuring other
                // user-cases, so if something is not showing up as expected, revisit this.
                if (!module.name.includes(module.issuerName)) {
                    const re = new RegExp(`^\.\/${this.options.srcDir}\/`);
                    let name = module.name.replace(re, '');
                    srcFiles.push(name);
                }
            // Node modules
            } else {
                // Remove some junk at the beginning of the lines
                const name = module.name.replace(/^\.\/(~\/)?/, '');
                const size = Math.round(module.size / 1024 * 100) / 100;
                modulesFiles.push(`${name} (${size} kb) -- Issuer: ${module.issuerName || module.issuer}`);
            }
        });

        const contents = externals.concat(srcFiles, modulesFiles).join('\n');

        compilation.assets[this.options.filename] = {
            source: () => {
                return contents;
            },
            size: () => {
                return contents.length;
            }
        };

        callback();
    });
};

module.exports = ModuleAnalyzerPlugin;
