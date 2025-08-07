import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toggle-password]',
  exportAs: 'toggle'
})
export class TogglePassword {
  toggled: boolean = false;
  
  constructor(private el: ElementRef) { }

  togglePassword() {
    this.el.nativeElement.type = this.toggled ? 'password' : 'text';

    this.toggled = !this.toggled;
  }
}
