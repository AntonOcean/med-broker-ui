import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterByBrand'
})
export class FilterByBrandPipe implements PipeTransform {
  transform(items: any, select: any): any {
      return select.length
        ? items.filter(item => select.includes(item.productCategory.trim()))
        : items;
  }
}
