import { Pipe, PipeTransform } from '@angular/core';
import { Product, User } from 'src/models';

@Pipe({
  name: 'searchuser'
})
export class SearchUserPipe implements PipeTransform {

  transform(products: User[], val: any): any {

    if (!val) { return products; }
    if (!products) { return []; }
    return products.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Email || '').includes(val));
  }

}
