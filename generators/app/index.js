'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const isDomainName = require('is-domain-name');
const generatePackageJson = require('./templates/generatePackageJson');
const generateWebpackBase = require('./templates/generateWebpackBase');

console.log(generateWebpackBase('test'));

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the majestic ${chalk.red('generator-tawang')} generator!`));

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: path.basename(process.cwd()),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Author's Name",
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: "Author's Email",
      }
    ];

    const serverHostQuestion = {
      type: 'input',
      name: 'serverHost',
      message: 'Tawang Server Hostname'
    }

    const useInvalidServerHostQuestion = {
      type: 'confirm',
      name: 'useInvalid',
      message: 'This doesn\'t look like a domain name, do you want to use it anyways?'
    }

    const serverHostLoop = async () => {
      let serverHost = await this.prompt(serverHostQuestion);
      console.log(JSON.stringify(serverHost))
      if (isDomainName(serverHost.serverHost)) {
        console.log('\nVALID');
        return;
      } else {
        console.log('\nINVALID');
        let useInvalidPrompt = await this.prompt(useInvalidServerHostQuestion);
        console.log('\nuseValid: ' + JSON.stringify(useInvalidPrompt));
        if (useInvalidPrompt.useInvalid) {
          return
        } else {
          return serverHostLoop();
        }
      }

    }

    const serverTestLoop = async () => {
      console.log('testing')
      return
    }

    // Ask all input questions.
    return this.prompt(prompts).then(async props => {
      this.props = props;
      await serverHostLoop();
      return serverTestLoop();

    });
  }

  writing() {
    this.fs.copy(this.templatePath('static'), this.destinationPath(''), {
      globOptions: { dot: true },
    });

    this.fs.copy(this.templatePath('tawang-starter.arproj'), this.destinationPath(`${this.props.name}.arproj`));

    this.fs.writeJSON(
      this.destinationPath('package.json'),
      generatePackageJson({
        name: this.props.name,
        description: this.props.description,
        authorName: this.props.authorName,
        authorEmail: this.props.authorEmail,
      }),
    );

    console.log(generateWebpackBase);
    this.fs.write(
      this.destinationPath('tools/webpack/webpack.base.config.js'),
      generateWebpackBase({
        serverHost: this.props.serverHost,
      }),
    );
  }

  install() {
    this.log(
      chalk.bold.green('\n\nImportant:'),
      `\nAfter I'm finished, please add "${
        this.props.serverHost
      }" to the whitelisted domains in the AR Studio project properties.\n`,
      '\nYou can find a detailed guide on how to do this here: ',
      '\nhttps://github.com/timstruthoff/generator-tawang/blob/master/docs/whitelist-guide/whitelist.md'
    );
    this.installDependencies({
      bower: false,
      npm: true,
    });
  }
};
