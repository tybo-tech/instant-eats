import { Pipe, PipeTransform } from '@angular/core';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Pipe({
  name: 'homesliderwidgetpipe'
})
export class SearchHomeSliderWidgetPipe implements PipeTransform {

  transform(items: SliderHomeWidgetModel[], val: any): any {

    if (!val) { return items; }
    if (!items) { return []; }
    return items.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      || (x.Description || '').includes(val)
      || (x.Id || '') === val

    );
  }

}
