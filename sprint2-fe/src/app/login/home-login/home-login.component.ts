import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from '../service/cookie.service';
import {NavigationEnd, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LoginService} from '../service/login.service';
import {AuthService} from '../service/auth.service';
import {ForgotService} from '../service/forgot.service';
import {CommonService} from '../service/common.service';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {SocialUser} from 'angularx-social-login';

declare var FB: any;

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.css']
})
export class HomeLoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  forgotForm: FormGroup;
  messageReceived: any;
  private subscriptionName: Subscription;
  public activeLogin: boolean = false;
  public LoginFailCount: number = 0;
  public realTimeSecond: number = 0;
  public realTimeMinute: number = 2;

  user: SocialUser;
  isLogin: boolean; // false

  constructor(private cookieService: CookieService,
              private router: Router,
              private toastrService: ToastrService,
              private loginService: LoginService,
              private authService: AuthService,
              private forgotService: ForgotService,
              private commonService: CommonService,
              private title: Title,
              private socialAuthService: SocialAuthService) {

    const timePrevious = Number(localStorage.getItem('time'));

    if (timePrevious != 0) {
      let realTimeInterval = setInterval(() => {
        const d = new Date();
        let hours: number = d.getHours();
        let minutes: number = d.getMinutes();
        let seconds: number = d.getSeconds();
        const timeNext = hours * 60 * 60 + minutes * 60 + seconds;
        if (timeNext - timePrevious >= 120) {
          this.activeLogin = true;
          clearInterval(realTimeInterval);
          this.realTimeSecond = 0;
          this.realTimeSecond = 0;
          localStorage.setItem('time', '0');
        }
        let realTime = ((timePrevious - timeNext) + 120);
        this.realTimeMinute = Math.floor(realTime / 60);
        this.realTimeSecond = realTime % 60;
      }, 1000);
    } else {
      this.activeLogin = true;
    }

    this.title.setTitle('????ng Nh???p');
    this.subscriptionName = this.commonService.getUpdate().subscribe(message => {
      this.messageReceived = message;
    });
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createForgotForm();

    (window as any).fbAsyncInit = function() {
      FB.init({
        appId: '863324377984890',
        cookie: true,
        xfbml: true,
        version: 'v3.5.6'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      stayLogged: new FormControl()
    });
  }

  createForgotForm() {
    this.forgotForm = new FormGroup({
      username: new FormControl('', [Validators.required])
    });
  }

  onLogin() {
    if (this.loginForm.valid && this.activeLogin) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      if (this.loginForm.value.stayLogged) {
        this.cookieService.setCookie('stayLogged', 'true', 1);
      }
      this.loginService.onLogin(username, password).subscribe(value => {
        this.authService.isLogin(value);
      }, error => {
        this.LoginFailCount++;
        if (this.LoginFailCount >= 3) {
          const d = new Date();
          let hours = d.getHours();
          let minutes = d.getMinutes();
          let seconds: number = d.getSeconds();
          localStorage.setItem('time', String(hours * 60 * 60 + minutes * 60 + seconds));
          this.activeLogin = false;
          this.toastrService.error('B???n nh???p sai qu?? 3 l???n h??y th??? l???i sau ??t ph??t!');
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([window.location.pathname]);
          });
        } else {
          switch (error.error) {
            case 'isLogin':
              this.toastrService.warning('B???n ???? ????ng nh???p r???i!');
              break;
            case 'PasswordExpired':
              this.toastrService.warning('M???t kh???u b???n ???? qu?? h???n vui l??ng ?????i m???t kh???u m???i!');
              break;
            default:
              this.toastrService.warning('T??n ????ng nh???p ho???c m???t kh???u kh??ng ch??nh x??c!');
              this.toastrService.warning('B???n nh???p sai ' + this.LoginFailCount + ' l???n.');
              break;
          }
        }

      }, () => {
        this.router.navigateByUrl('/').then(() => {
          this.toastrService.success('????ng nh???p th??nh c??ng!');
        });
        setTimeout(() => {
          this.router.navigateByUrl('/').then(() => {
            this.toastrService.success('????ng nh???p th??nh c??ng!');
            this.sendMessage();
          });
        }, 1000);
        this.router.navigateByUrl('/loading').then(() => {
        });
      });
    } else {
      this.LoginFailCount++;
      if (this.LoginFailCount >= 3) {
        const d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let seconds: number = d.getSeconds();
        localStorage.setItem('time', String(hours * 60 * 60 + minutes * 60 + seconds));
        this.activeLogin = false;
        this.toastrService.error('B???n nh???p sai qu?? 3 l???n h??y th??? l???i sau ??t ph??t!');
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([window.location.pathname]);
        });
      } else {
        this.toastrService.warning('B???n nh???p sai ' + this.LoginFailCount + ' l???n.');
        this.toastrService.error('Th??ng tin b???n nh???p kh??ng ch??nh x??c!');
      }
    }
  }

  onForgot() {
    if (this.forgotForm.valid) {
      this.router.navigateByUrl('/loading').then(() => {
        //@ts-ignore
        $('#staticBackdropForgot').modal('hide');
      });
      this.forgotService.onForgot(this.forgotForm.value.username).subscribe(value => {
      }, error => {
        //@ts-ignore
        $('#staticBackdropForgot').modal('hide');
        this.router.navigateByUrl('/login').then(() => {
          this.toastrService.warning('T??n t??i kho???n kh??ng t???n t???i!');
          //@ts-ignore
          $('#staticBackdropForgot').modal('show');
        });
      }, () => {
        this.router.navigateByUrl('/login').then(() => {
          //@ts-ignore
          $('#staticBackdropForgot').modal('hide');
          this.toastrService.success('G???i y??u c???u th??nh c??ng. Vui l??ng ki???m tra email c???a b???n!');
          this.forgotForm.reset();
        });
      });
    } else {
      this.toastrService.warning('Th??ng tin b???n nh???p ch??a ch??nh x??c!');
    }
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.commonService.sendUpdate('????ng Nh???p th??nh c??ng!');
  }

  closeForgot() {
    this.forgotForm.reset();
  }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }



  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        console.log(data);
        this.loginService.loginWithGoogle(data.idToken).subscribe(
          res => {
            console.log(res);
          }
        );
      }
    );
  }

  //
  // signInWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  //   this.socialAuthService.authState.subscribe(user => {
  //     console.log(user);
  //     // this.isLogin = (user != null);
  //   });
  //
  // }
  //
  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }


}
