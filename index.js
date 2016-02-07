var path = require('path');
var fs   = require('fs');

module.exports = function(sails) {

  return {
    defaults: {
      __configKey__: {
        active: true,
        usePolling: false,
        dirs: [
          path.resolve(sails.config.appPath,'assets','js'),
        ],
        ignored: [
          path.resolve(sails.config.appPath,'assets', 'js', 'dependencies'),
        ]
      }
    },
    initialize: function(cb) {
      
      var ts = require('typescript');
      var chokidar = require('chokidar');   

      var self = this;
      
      if (!sails.config[this.configKey].active) {
        sails.log.verbose("TypeScript hook deactivated.");
        return cb();
      }
   
      var compilerOptions = { module: ts.ModuleKind.System };
      
      self.checkIgnored = function(dir) {
        
        var ignored = false;
        
        sails.config[this.configKey].ignored.forEach(function(ignore, index) {
   
          if(ignore === dir) {
            ignored = true;
          } 
          
        }, this);
        
        return ignored;
        
      };
      
      self.removeExtension = function(file) { 
        var name = file.substr(0, file.lastIndexOf("."));
        return name;
      }
      
      self.changeExtension = function(file) { 
        var name = self.removeExtension(file);
        return name + ".js";
      }
      
      self.transpileFile = function(pathway) {

            var isDirectory = fs.lstatSync(pathway).isDirectory();
         
            if(isDirectory) {
              
              if(self.checkIgnored(pathway) === false) {
            
                var directoryFiles = fs.readdirSync(pathway);
                
                self.transpileFiles(pathway, directoryFiles);
                
              }
             
            } else if(path.extname(pathway) === ".ts") {
             
              var fileContent = fs.readFileSync(pathway, "utf-8");
              
                var toWrite = ts.transpile(
                  fileContent,
                  compilerOptions,
                  undefined,
                  undefined,
                  path.basename(pathway, '.ts')
                );
                
                fs.writeFile(self.changeExtension(pathway), toWrite, function(err) {
                    if(err) {
                        return sails.log(err);
                    }
                }); 
                
            }
        
      }

      self.transpileFiles = function(dir, files) {
        
          files.forEach(function(file) {
            
            var pathway = path.join(dir, file);
            
            self.transpileFile(pathway);
            
          }, this);
        
      }

      self.compileFiles = function() {
        sails.config[this.configKey].dirs.forEach(function(dir) {
          
          var files = fs.readdirSync(dir);
          
          self.transpileFiles(dir, files);
         
        }, this); 
        
        
      }
      
      self.compileFiles();

      var watcher = chokidar.watch(sails.config[this.configKey].dirs, {
        ignoreInitial: true,
        usePolling: sails.config[this.configKey].usePolling,
        ignored: sails.config[this.configKey].ignored
      });
  
      watcher.on('all', sails.util.debounce(function(action, path, stats) {

        sails.log("Detected TypeScript file changed");
        self.transpileFile(path);
        
      }, 100));
  
      console.log("============");
  
      sails.log.verbose("TypeScript watching: ", sails.config[this.configKey].dirs);
      return cb();

    },

  };

};