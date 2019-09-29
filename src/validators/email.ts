import { FormControl } from '@angular/forms';

export class EmailValidator {  
  static isValid(control: FormControl) {
    // validate that is a valid email entry by checking the values before @ and the ending is the proper size
    const check = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(control.value);
    if (check) {
      return null;
    }
    return {
      "invalidEmail": true
    };
  }
}