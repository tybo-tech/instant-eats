import { Pipe, PipeTransform } from '@angular/core';
import { SliderWidgetModel } from 'src/models/UxModel.model';

@Pipe({
  name: 'sliderwidgetpipe'
})
export class SearchSliderWidgetPipe implements PipeTransform {

  transform(items: SliderWidgetModel[], val: any): any {

    if (!val) { return items; }
    if (!items) { return []; }
    return items.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      || (x.Description || '').includes(val)
      || (x.Id || '') === val

    );
  }

}
