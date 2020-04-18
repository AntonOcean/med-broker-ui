import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {IndexModule} from './index/index.module';
import {SharedModule} from './shared/shared.module';
import {RouterModule} from '@angular/router';
import {AppRoutes} from './app.routing';
import {TranslateService} from './shared/services/translate.service';
import {ProductModule} from './layouts/product/product.module';
import {UserModule} from './layouts/user/user.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {TaskBoardModule} from './layouts/task-board/task-board.module';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';


registerLocaleData(localeRu, 'ru');
/* to load and set en.json as the default application language */
export function setupTranslateFactory(service: TranslateService) {
  return () => service.use('en');
}

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IndexModule,
    ProductModule,
    UserModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TaskBoardModule,
    HttpClientModule
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [ TranslateService ],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
