import {ToastrService} from '../../shared/services/toastr.service';
import {EmailValidator, NgForm} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/models/user';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EmailValidator]
})
export class LoginComponent implements OnInit {
  user = {
    emailId: '',
    loginPassword: ''
  };

  errorInUserCreate = false;
  errorMessage: any;
  createUser;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createUser = new User();
  }

  ngOnInit() {
  }

  addUser(userForm: NgForm) {
    userForm.value.isAdmin = false;
    this.authService
      .createUserWithEmailAndPassword(userForm.value.emailId, userForm.value.password)
      .then((res) => {
        const user = {
          email: res.user.email,
          famil_name: res.user.displayName,
          uid: res.user.uid,
          verified_email: res.user.emailVerified,
          phoneNumber: res.user.phoneNumber,
          picture: res.user.photoURL
        };

        this.userService.createUser(user);

        this.toastService.success('Регистрация', 'Вы зарегистрированы!');

        setTimeout((router: Router) => {
          $('#createUserForm').modal('hide');
          this.router.navigate(['/']);
        }, 800);
      })
      .catch((err) => {
        this.errorInUserCreate = true;
        this.errorMessage = err;
        this.toastService.error('Ошибка при регистрации', err);
      });
  }

  signInWithEmail(userForm: NgForm) {
    this.authService
      .signInRegular(userForm.value.emailId, userForm.value.loginPassword)
      .then((res) => {
        this.toastService.success('Вход выполнен', '');

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        setTimeout((router: Router) => {
          this.router.navigate([returnUrl || '/']);
        }, 800);

        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.toastService.error('Вход не выполнен', 'Введен неверный логин\\пароль');
      });
  }

  signInWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then((res) => {
        if (res.additionalUserInfo.isNewUser) {
          this.userService.createUser(res.additionalUserInfo.profile);
        }
        this.toastService.success('Вход выполнен', '');
        setTimeout((router: Router) => {
          this.router.navigate(['/']);
        }, 800);
      })
      .catch((err) => {
        this.toastService.error('Ошибка', 'Попробуйте позже');
      });
  }
}
