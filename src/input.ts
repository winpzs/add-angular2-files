export interface IInput {
    input:string;
    path:string;
    fileName:string;
    argInput:string;
    args:string[],
    //component.ts  --c | component
    component:boolean;
    //template.html  --t | template
    template:boolean;
    //css  --C | css
    css:boolean;
    //module.ts  --M | module
    module:boolean;
    //service.ts  --s | service
    service:boolean;
    //model.ts  --m | model
    model: boolean;
    //component.spec.ts  --S | spec
    spec:boolean;
    //routing.ts  --r | routing
    routing:boolean;
    //是否为model和service生成到./shared目录， 默认为true
    //--ns | noshared
    shared:boolean;
    //是否生成一个目录， 比如输入user --f c会生./user/user.component.ts
    //--f | folder
    folder:boolean;
}