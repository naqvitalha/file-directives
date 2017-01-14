To use this utility use the following command:

`npm install file-directives -g`

What this utility allows you to do is to auto comment code based on enviroment variable. 
Following is a common scenario where this is helpful:
```
//#if [DEV_MODE]
  int bufferSize = 0;
//#endif

//#if [RELEASE_MODE]
  //int bufferSize = 4096;
//#endif
```
Here DEV_MODE and RELEASE_MODE are environment variables. Before running your bundler or deployer
just go to the relevant directory and run:

`file-directives RELEASE_MODE node_modules`

This will automatically uncomment relevant code and comment the irrelevant one. Following is the syntax:

`file-directives comma-separated-env-vars comma-separated-folder-to-ignore`

Also, you need to enclose env vars in [] while you use them in code. Following is the directive 
syntax:
```
//#if [ENV1] || [ENV2] || [ENV3]

.... relevant code

//#endif
```
Note: Else is not supported :)
