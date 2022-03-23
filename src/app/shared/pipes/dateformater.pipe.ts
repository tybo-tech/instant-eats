import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformater'
})
export class DateformaterPipe implements PipeTransform {

  transform(value: string, type?: string): unknown {
    if (!value)
      return ''
    value = this.formatDateString(value);
    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const formatedValue = new Date(value);
    const formatedTime = `${formatedValue.getHours() > 9 ? formatedValue.getHours() : '0' + formatedValue.getHours()}:${formatedValue.getMinutes() > 9 ? formatedValue.getMinutes() : '0' + formatedValue.getMinutes()}`;
    const formatedDate = `${formatedValue.getDate()} ${mS[formatedValue.getMonth()]} ${formatedValue.getFullYear()}`;

    if (type === 'time')
      return formatedTime;
    return formatedDate;
  }
  formatDateString(v: string) {
    if (v && v.split(' ').length === 2) {
      return v.replace(' ', "T");
    }
    return v;
  }
}
