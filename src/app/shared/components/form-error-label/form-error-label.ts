import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FormErrorLabel {

  control = input.required<AbstractControl>();

  get errorMessage(){
    const  errors : ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0 ? "Error" : null
  }
}
