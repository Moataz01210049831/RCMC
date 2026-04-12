import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private t: TranslationService) {}

  transform(key: string): string {
    return this.t.translate(key);
  }
}
