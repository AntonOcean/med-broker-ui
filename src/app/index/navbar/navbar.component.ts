import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {ProductService} from '../../shared/services/product.service';
import {TranslateService} from '../../shared/services/translate.service';
import {ThemeService} from 'src/app/shared/services/theme.service';
import {ToastrService} from '../../shared/services/toastr.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isCollapsed: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    public productService: ProductService,
    public translate: TranslateService,
    private themeService: ThemeService,
    private toastService: ToastrService,
  ) {
    // console.log(translate.data);
  }

  ngOnInit() {
    this.isCollapsed = true;
  }

  logout() {
    this.authService.logout();
    this.toastService.warning('Вы вышли', '');
    this.router.navigate(['/']);
  }

  setLang(lang: string) {
    // console.log("Language", lang);
    this.translate.use(lang).then(() => {
    });
  }

  updateTheme(theme: string) {
    this.themeService.updateThemeUrl(theme);
  }
}
