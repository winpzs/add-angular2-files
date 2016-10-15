import { ExtensionContext, commands, window } from 'vscode'; 
import { AddFilesExtended } from './add-files-extended';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension is now active!');

  var addAngular2FilesExtended = commands.registerCommand('extension.addAngular2FilesByFrontY', (args) => {
    const addFilesExtended: AddFilesExtended = new AddFilesExtended();
    addFilesExtended.showFileNameDialog(args)
      .then(addFilesExtended.transInput)
      .then(addFilesExtended.createFolder)
      .then(addFilesExtended.createFiles)
      .then(addFilesExtended.openFileInEditor)
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  });

  context.subscriptions.push(addAngular2FilesExtended);
}