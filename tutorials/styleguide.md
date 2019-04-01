### Git Commit Messages
In order to facilitate code versioning and deployment we use [`semantic-release`](https://github.com/semantic-release/semantic-release). You can read all about it on their Github but essentially versioning is applied automatically based on commit messages. For this reason a specific commit style is required, we follow [Angular Commit Message conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). You could type this all manually **OR** you could install [`commitizen`](https://github.com/commitizen/cz-cli). The easiest way to do so is to simply run the command below:
```console
npm install -g commitizen cz-conventional-changelog && echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

You should now be able to commit changes and easily follow the angular commit style by running:

```console
git cz
```

### JavaScript Styleguide
Readable code is achieved through [linting](https://stackoverflow.com/questions/8503559/what-is-linting). This is what ESlint is used for. 

We follow the [AirBnB linting style](https://github.com/airbnb/javascript). The easiest way to follow this linting style is to setup Eslint on your code editor or run the following command and check for warnings/errors:

```console
npm run lint
```

You can activate it in VScode by downloading the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) package. It should pick up linting issues and help you correct them as you code. And before you ask... Spaces > Tabs.