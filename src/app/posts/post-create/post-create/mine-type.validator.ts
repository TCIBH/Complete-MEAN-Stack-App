// import { AbstractControl } from "@angular/forms"
// import { Observable, Observer,of } from "rxjs"

// export const mineType=(control:AbstractControl):Promise<{[ket:string]:any}>|Observable<{[ket:string]:any}>=>{
//     if(typeof(control.value)==="string"){
//         return of(null);
//     }
//     const file=control.value as File;
//     const fileReader=new FileReader();
//      const fsObs=Observable.create((observer:Observer<{[ket:string]:any}>)=>{
//          fileReader.addEventListener("loadend",()=>{
//              const arr=  new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
//            let header='';
//            let isvalid=false;
//              for(let i=0;i<arr.length;i++){
//              header+=arr[i].toString(16);
//            }
//            switch(header){
//             case "89504e47":
//                 isvalid=true;
//                 break;
//                 case "ffd8ffe0":
//                 case "ffd8ffe1":
//                 case "ffd8ffe2":
//                  case "ffd8ffe3":
//                 case "ffd8ffe8":
//                     isvalid=true;
//                     break;
//                 default:
//                     isvalid=false;
//                     break
                    
//            }
//            if(isvalid){
//             observer.next(null);
//            }
//            else{
//             observer.next({inValidMineType:true})
//            }
//            observer.complete();
//             });
//          fileReader.readAsArrayBuffer(file);
//      });
//      return fsObs;
// }
import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mineType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof (control.value) === "string") {
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const fsObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = "";
      let isValid = false;

      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }

      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });

    fileReader.readAsArrayBuffer(file);
  });

  return fsObs;
};