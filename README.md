![](images/icon.png)

# VS Code Angular2 Add Files

This extension allows you to add **Angular2 typescript files including snippets** to your VS Code project.

> Inspired by [Sebastian Baar](https://github.com/sebastianbaar)'s [Angular2 Add Files for VS Code](https://github.com/sebastianbaar/vscode-add-angular2-files).

## Changelog

### 1.0.0
**Now Updated for Angular 2.0.0 release** 

### Add Angular2 Files

This command adds the following files to your new folder (let's assume you typed in `home --c t css spec f`):
```
home/home.component.ts
home/home.component.html
home/home.component.css
home/home.component.spec.ts
```

This command adds the following extended files to your new folder (let's assume you typed in `home --c t css spec s m f`):
```
home/home.component.ts
home/home.component.html
home/home.component.css
home/home.component.spec.ts
home/shared/home.service.ts
home/shared/home.model.ts
```

This command adds the following extended files to your new folder (let's assume you typed in `home --c t css spec s m M r f`):
```
home/home.component.ts
home/home.component.html
home/home.component.css
home/home.component.spec.ts
home/shared/home.service.ts
home/shared/home.model.ts
home/home.module.ts
home/home.routing.ts
```

This command adds the following extended files to your new folder (let's assume you typed in `home --all f`):
```
home/home.component.ts
home/home.component.html
home/home.component.css
home/home.component.spec.ts
home/shared/home.service.ts
home/shared/home.model.ts
home/home.module.ts
home/home.routing.ts
```

This command adds the following extended files to your new folder (let's assume you typed in `home --all`):
```
home.component.ts
home.component.html
home.component.css
home.component.spec.ts
shared/home.service.ts
shared/home.model.ts
home.module.ts
home.routing.ts
```

## Options

1. -c | component: component.ts
2. -t | template: component.html
3. -C | css: component.css
4. -s | service: service.ts
5. -S | spec: component.spec.ts
6. -m | model: model.ts
7. -M | moudle: moudle.ts
8. -r | routing: routing.ts
9. -f | folder: add folder
10. -ns | noshared: Default model.ts and service.ts in the shared directory

## Installation

1. Install Visual Studio Code 1.3.0 or higher
2. Launch Code
3. From the command palette `Ctrl`-`Shift`-`P` (Windows, Linux) or `Cmd`-`Shift`-`P` (OSX)
4. Select `Install Extension`
5. Type `add angular2 files` and press enter
6. Reload Visual Studio Code

# Contributors

[Front Y](https://github.com/winpzs)

# License

MIT
