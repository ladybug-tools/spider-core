To start contributing you will need to set up your local coding environment if this is not already the case.

## Installing NodeJS
We all have to start our coding, Javascript or NodeJS journey somewhere so why not start with `Spider-Core`! For the sake of ensuring that specific versions of NodeJS may be used without making your life difficult in the future, we recommend installing NodeJS through `nvm`, which manages multiple NodeJS version on your machine for you.

* [NVM](https://github.com/creationix/nvm) - OSX/Linux
* [NVM](https://github.com/coreybutler/nvm-windows) - Windows


Once that's done you can start using NodeJS 11:
```console
nvm install 11
nvm use 11
```
Or
```console
nvm install latest
```
NVM will report to you the number of the reakease it has installed.

Or even set NodeJS 11 as your default:
```console
nvm user default 11
```

## Using NPM
[Here](https://blog.codeanalogies.com/2018/09/24/node-package-manager-npm-explained-by-directing-a-movie/) is a great guide on what NPM is and how to use it. The low down is that NPM stands for Node Package Manager and... well... it manages nodejs packages. 


## Installing a code editor
There are many code editors out there and it is pointless to start listing them all. If you're not sure/don't care which to pick, we reccomend you use [VSCode](https://code.visualstudio.com/) because most developers for this project use it and it'll make it easier to setup linting and such.

## Cloning Spider-Core
In order to write code and propose changes you will need to [Fork](https://guides.github.com/activities/forking/) the project and clone your Fork to your computer. You will need to install [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) to do so. Once git is installed run the following command replacing `YOURNAME` with your github username:
```console
git clone git@github.com:YOURNAME/spider-core.git
```

## Installing Node Packages
Once the repository has been cloned you will need to install the Node packages so you can run tests and ensure the code is working. First `cd` into the project folder and then run `npm install`:

```console
cd /path/to/spider-core
npm install
```

## Writing Code
Right! You're good to go! Write some awesome code, don't forget to test it and check the [Contributing](./tutorial-contributing.html) docs to make sure you're Pull Request gets dealt with as smoothly as possible. Thanks again for the help!
