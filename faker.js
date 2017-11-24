const jsf = require('json-schema-faker');
const fs = require('fs');
const tmpDir = require('os-tmpdir')();
const cliArgs = require('command-line-args');
const usage = require('command-line-usage');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false, description: 'prints this usage guide.' },
  { name: 'kind', alias: 'k', type: String,  description: 'Openshift/Kubernetes object, e.g. container, deployment' },
  { name: 'version', alias: 'v', type: String, defaultValue: '3.6.0', description: 'Openshift version' },
  { name: 'number', alias: 'n', type: Number, defaultValue: 10, description: 'amount of files to generate' },
  { name: 'fakeOptionals', alias: 'f', type: Boolean, defaultValue: true, description: 'should all optional fields be faked too?' },
  { name: 'location', alias: 'l', type: String, defaultValue: tmpDir, description: `where files should be stored. Defaults to [underline]{${tmpDir}}` }
];

const help = [
  {
    header: 'Openshift / Kubernetes JSON Faker',
    content: 'Generates fake data based on [italic]{json-schema} files (for more see [underline]{https://github.com/bartoszmajsak/openshift-json-schema/}.)'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
];

const options = cliArgs(optionDefinitions); 

const REMOTE_REF = `https://raw.githubusercontent.com/bartoszmajsak/openshift-json-schema/master/v${options.version}-standalone/${options.kind}.json`;
const schema = {
  $ref: REMOTE_REF
};

jsf.extend('faker', function() {
  return require('faker');
});

if (options.help || process.argv.length == 2) {
  console.log(usage(help));
  process.exit(0);
}


jsf.option({alwaysFakeOptionals: options.fakeOptionals});

if (!fs.existsSync(options.location)) {
  fs.mkdirSync(options.location);
}

let promises = [];
for (let index = 0; index < options.number; index++) {
  promises.push(jsf.resolve(schema).then(function(result) {
    fs.writeFile(`${options.location}/faker-${options.kind}-${options.version}-${index}.json`, JSON.stringify(result, null, 2), function (err) {
      if (err) {
        console.error(err);
      }
    });
  }));  
}

Promise.all(promises).then(function () {
  console.info(`Finished generating faker files for ${options.kind} kind defined for Openshift v${options.version}`);
});
