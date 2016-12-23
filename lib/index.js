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

        const collapsed = {};

        modules.forEach((module) => {
            // Externals
            if (module.name.includes('external ')) {
                externals.push(module.name.replace(/external /, ''));
            // Source Files
            } else if (module.name.includes(`./${this.options.srcDir}/`)) {
                let size = Math.round(module.size / 1024 * 100) / 100;
                // If the module name includes the issuerName, then it's a less loader line, which looks
                // like a duplicate of the actual less file. Ignore that. This may be obscuring other
                // user-cases, so if something is not showing up as expected, revisit this.
                if (!module.name.includes(module.issuerName)) {
                    const re = new RegExp(`^\.\/${this.options.srcDir}\/`);
                    let name = module.name.replace(re, '');
                    srcFiles.push(`${name} (${size} kb)`);
                }
            // Node modules
            } else {
                // Remove some junk at the beginning of the lines
                let name = module.name.replace(/^\.\/(~\/)?/, '');
                let size = module.size || 0;
                let issuerName = module.issuerName || module.issuer || '';
                issuerName = issuerName.replace(/^\.\/(~\/)?/, '');

                if (this.options.expandDependentFiles) {
                    size = Math.round(size / 1024 * 100) / 100;
                    modulesFiles.push(`${name} (${size} kb) -- Issuer: ${issuerName}`);
                } else {
                    // clean up names, just the dependency name
                    name = name.replace(/\/.*$/, '');
                    issuerName = issuerName.replace(/\/.*$/, '');

                    // See if we've already stored the module, if so add an issuer,
                    // bump the size, otherwise add it as new.
                    if (collapsed[name]) {
                        let obj = collapsed[name];
                        if (!obj.issuers.includes(issuerName) && issuerName !== name) {
                            obj.issuers.push(issuerName);
                        }
                        obj.size += size;
                    } else {
                        collapsed[name] = {
                            size: size,
                            issuers: []
                        };
                        if (issuerName !== name) {
                            collapsed[name].issuers.push(issuerName);
                        }
                    }
                }
            }
        });

        // if we are collapsing all files from a dependency, loop through what we
        // gathered, and write those to the modulesFiles array.
        if (!this.options.expandDependentFiles) {
            for (let key in collapsed) {
                if (collapsed.hasOwnProperty(key)) {
                    let item = collapsed[key];
                    const size = Math.round(item.size / 1024 * 100) / 100;
                    modulesFiles.push(`${key} (${size} kb) -- Issuers: ${item.issuers.join(', ')}`);
                }
            }
        }

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
