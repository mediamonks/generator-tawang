'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const isDomainName = require('is-domain-name');
const generatePackageJson = require('./templates/generatePackageJson');
const generateWebpackBase = require('./templates/generateWebpackBase');
const ServerTest = require('./components/ServerTest');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the majestic ${chalk.red('Tawang')} generator!`));

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

    const ignoreFailedTest = {
      type: 'confirm',
      name: 'ignoreFailed',
      message: 'Do you want to continue anyways?'
    }

    // Asks the user for a serverName
    const serverHostLoop = async () => {
      let serverHost = await this.prompt(serverHostQuestion);
      if (isDomainName(serverHost.serverHost)) {
        return serverHost.serverHost;
      } else {
        let useInvalidPrompt = await this.prompt(useInvalidServerHostQuestion);
        if (useInvalidPrompt.useInvalid) {
          return serverHost.serverHost;
        } else {
          return serverHostLoop();
        }
      }

    }

    /**
     * Adds a green checkmark to the beginning of a string.
     * @param {String} string 
     * @return {String} The string with the checkmark.
     */
    const successLog = (string) => {
      // Selecting a fallback checkmark if on windows.
      let checkmark = process.platform === 'win32' ?  chalk.green('√') : chalk.green('✔');
      return checkmark + ' ' + string
    }

    /**
     * Adds a red cross to the beginning of a string.
     * @param {String} string 
     * @return {String} The string with the cross.
     */
    const errorLog = (string) => {
      // Selecting a fallback checkmark if on windows.
      let cross = process.platform === 'win32' ?  chalk.red('×') : chalk.red('✖');
      return cross + ' ' + string
    }
    
    /**
     * Runs tests on a Tawang server async.
     * @param {String} serverHost The serverHost to check
     */
    const serverTestLoop = async (serverHost) => {
      this.log(chalk.bold(`\nTesting if the Tawang server at ${serverHost} is working.`));

      let test = new ServerTest(serverHost);

      // Checking get endpoint.
      if (await test.checkDomain()) {

        this.log(successLog('Server responded'))

        // Checking source map Post endpoint.
        if (await test.checkPost()) {

          this.log(successLog('Posted source map successfully.'))

          // Checking parse endpoint
          if (await test.checkParse()) {
            
            // All tests were successful.
            this.log(successLog('Parsed source map successfully.'))
            this.log(chalk.green('All test completed successfully.\n'))
            return serverHost;
          } else {
            this.log(errorLog('Parsing source map failed'));
          }
        } else {
          this.log(errorLog('Posting source map failed'));
        }
      } else {
        this.log(errorLog('Server test failed'));
      }


      this.log(chalk.bold.red(`The server at ${serverHost} doesn\'t seem to work!`));

      // Displaying prompt if user wants to continue anyways.
      let ignoreFailedPrompt = await this.prompt(ignoreFailedTest);
      if (ignoreFailedPrompt.ignoreFailed) {
        return;
      } else {

        // Displaying serverHost prompt and then testing again.
        return await serverTestLoop(await serverHostLoop());
      }

    }

    // Ask all input questions.
    return this.prompt(prompts).then(async props => {
      this.props = props;
      let serverHost = await serverTestLoop(await serverHostLoop());
      this.props.serverHost = serverHost;
      return

    });
  }

  writing() {

    // Copying all static files
    this.fs.copy(this.templatePath('static'), this.destinationPath(''), {
      globOptions: { dot: true },
    });

    // Copying the project file and renaming it according to the name.
    this.fs.copy(this.templatePath('tawang-starter.arproj'), this.destinationPath(`${this.props.name}.arproj`));

    // Generating package.json file
    this.fs.writeJSON(
      this.destinationPath('package.json'),
      generatePackageJson({
        name: this.props.name,
        description: this.props.description,
        authorName: this.props.authorName,
        authorEmail: this.props.authorEmail,
      }),
    );

    // Generating the webpack.base.config.js file
    this.fs.write(
      this.destinationPath('tools/webpack/webpack.base.config.js'),
      generateWebpackBase({
        serverHost: this.props.serverHost,
      }),
    );
  }

  install() {

    // Displaying information about whitelist.
    this.log(
      chalk.bold.green('\n\nImportant:'),
      `\nAfter I'm finished, please add "${
        this.props.serverHost
      }" to the whitelisted domains in the AR Studio project properties.\n`,
      '\nYou can find a detailed guide on how to do this here: ',
      '\nhttps://github.com/timstruthoff/generator-tawang/blob/master/docs/whitelist-guide/whitelist.md'
    );

    // Installing npm dependencies.
    this.installDependencies({
      bower: false,
      npm: true,
    });
  }
};
