/// <reference path="../typings/tsd.d.ts" />
import { window, workspace, TextEditor } from 'vscode';
import { FileContentsExtended } from './file-contents-extended';
import { IFiles } from './file';
import * as fs from 'fs';
import * as path from 'path';
import * as Q from 'q';
import { IInput } from './input';

export class AddFilesExtended {

  public transInput(input: string): IInput {
    let regList = /^(.*)--(.*)$/i.exec(input);
    let inputName: string = input,
      argInput: string = '',
      args: string[] = [];

    if (regList && regList.length > 1) {
      [, inputName, argInput] = regList.map<string>(function (item: string) {
        return item ? item.trim() : '';
      });
      args = argInput.split(/ +/).map(function (item: string) {
        return item;
      });
    }

    let pp = path.parse(inputName);

    let inputRet = {
      input: inputName,
      path: pp.dir,
      fileName: pp.name,
      argInput: argInput,
      args: args,
      component: false,
      template: false,
      css: false,
      module: false,
      service: false,
      model: false,
      spec: false,
      folder: false,
      routing: false,
      shared:true
    };

    args.forEach(function (item: string) {
      switch (item) {
        case 'f':
        case 'folder':
          inputRet.folder = true;
          inputRet.path = path.join(inputRet.path, inputRet.fileName)
          break;
        case 'c':
        case 'component':
          inputRet.component = true;
          break;
        case 't':
        case 'template':
          inputRet.template = true;
          break;
        case 'M':
        case 'module':
          inputRet.module = true;
          break;
        case 'm':
        case 'model':
          inputRet.model = true;
          break;
        case 's':
        case 'service':
          inputRet.service = true;
          break;
        case 'S':
        case 'spec':
          inputRet.spec = true;
          break;
        case 'C':
        case 'css':
          inputRet.css = true;
          break;
        case 'r':
        case 'route':
        case 'routing':
          inputRet.routing = true;
          break;
        case 'ns':
        case 'noshared':
          inputRet.shared = false;
          break;
        case 'all':
          inputRet.component = true;
          inputRet.template = true;
          inputRet.module = true;
          inputRet.model = true;
          inputRet.service = true;
          inputRet.spec = true;
          inputRet.css = true;
          inputRet.routing = true;
          inputRet.shared = true;
        break;
      }
    });

    return inputRet;
  }

  // Create the new "shared" folder for model and service
  public createFolder(input: IInput): Q.Promise<IInput> {
    console.log('input', input);
    var folderName: string = input.path;
    const deferred: Q.Deferred<IInput> = Q.defer<IInput>();
    var fileExists: boolean = fs.existsSync(folderName);
    let shared: boolean = input.shared && (input.model || input.service);
    let sharedPath: string = path.join(folderName, 'shared');

    if (!fileExists) {
      fs.mkdir(folderName, (err) => {
        if (shared) fs.mkdirSync(sharedPath);
        deferred.resolve(input);
      });
    } else {
      if (shared) {
        fileExists = fs.existsSync(sharedPath);
        if (!fileExists) fs.mkdirSync(sharedPath);
      }
      if (input.folder)
        deferred.reject('Folder already exists');
      else
        deferred.resolve(input);
    }
    return deferred.promise;
  }

  // Get file contents and create the new files in the folder 
  public createFiles(input:IInput): Q.Promise<IInput> {
    var folderName:string = input.path;
    const deferred: Q.Deferred<IInput> = Q.defer<IInput>();
    var fileName: string = input.fileName;
    const fc: FileContentsExtended = new FileContentsExtended();
    const afe: AddFilesExtended = new AddFilesExtended();

    var files: IFiles[] = [];

    if (input.component){
      files.push({
        name: path.join(folderName, `${fileName}.component.ts`),
        content: fc.componentContent(fileName)
      });
    }
    if (input.template){
      files.push({
        name: path.join(folderName, `${fileName}.component.html`),
        content: fc.templateContent(fileName)
      });
    }
    if (input.css){
      files.push({
        name: path.join(folderName, `${fileName}.component.css`),
        content: fc.cssContent(fileName)
      });
    }
    if (input.spec){
      files.push({
        name: path.join(folderName, `${fileName}.component.spec.ts`),
        content: fc.specContent(fileName)
      });
    }
    if (input.service){
      files.push({
        name: input.shared ? path.join(folderName, 'shared', `${fileName}.service.ts`) : `${fileName}.service.ts`,
        content: fc.serviceContent(fileName)
      });
    }
    if (input.model){
      files.push({
        name:input.shared ? path.join(folderName, 'shared', `${fileName}.model.ts`) : `${fileName}.model.ts`,
        content: fc.modelContent(fileName)
      });
    }

    if (input.module){
      files.push({
        name: path.join(folderName, `${fileName}.module.ts`),
        content: fc.moduleContent(fileName)
      });
    }
    if (input.routing){
      files.push({
        name: path.join(folderName, `${fileName}.routing.ts`),
        content: fc.routingContent(fileName)
      });
    }

    // write files
    afe.writeFiles(files).then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created. I'm sorry :-(`);
      }
      else {
        deferred.resolve(input);
      }
    });

    return deferred.promise;
  }


  // Show input prompt for folder name 
  // The imput is also used to create the files with the respective name as defined in the Angular2 style guide [https://angular.io/docs/ts/latest/guide/style-guide.html] 
  public showFileNameDialog(args): Q.Promise<string> {
    const deferred: Q.Deferred<string> = Q.defer<string>();

    var clickedFolderPath: string;
    if (args) {
      clickedFolderPath = args.fsPath
    }
    else {
      if (!window.activeTextEditor) {
        deferred.reject('Please open a file first.. or just right-click on a file/folder and use the context menu!');
        return deferred.promise;
      } else {
        clickedFolderPath = path.dirname(window.activeTextEditor.document.fileName);
      }
    }
    var newFolderPath: string = fs.lstatSync(clickedFolderPath).isDirectory() ? clickedFolderPath : path.dirname(clickedFolderPath);

    if (workspace.rootPath === undefined) {
      deferred.reject('Please open a project first. Thanks! :-)');
    }
    else {
      window.showInputBox({
        prompt: 'What\'s the name of the new folder?',
        value: 'folder'
      }).then(
        (fileName) => {
          if (!fileName || /[~`!#$%\^&*+=\[\]\\';,{}|\\":<>\?]/g.test(fileName)) {
            deferred.reject('That\'s not a valid name! (no whitespaces or special characters)');
          } else {
            deferred.resolve(path.join(newFolderPath, fileName));
          }
        },
        (error) => console.error(error)
        );
    }
    return deferred.promise;
  }

  public writeFiles( files: IFiles[]): Q.Promise<string[]> {
    const deferred: Q.Deferred<string[]> = Q.defer<string[]>();
    var errors: string[] = []; 
    files.forEach(file => {
      fs.writeFile(file.name, file.content, (err) => {
          if (err) { errors.push(err.message) }          
          deferred.resolve(errors);
        });
    });
    return deferred.promise;
  }

  // Open the created component in the editor
  public openFileInEditor(folderName): Q.Promise<TextEditor> {
    const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();
    var inputName: string = path.parse(folderName).name;;
    var fullFilePath: string = path.join(folderName, `${inputName}.component.ts`);

    workspace.openTextDocument(fullFilePath).then((textDocument) => {
      if (!textDocument) { return; }
      window.showTextDocument(textDocument).then((editor) => {
        if (!editor) { return; }
        deferred.resolve(editor);
      });
    });

    return deferred.promise;
  }

}