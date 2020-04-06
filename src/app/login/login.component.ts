import { Component } from '@angular/core';
import { users } from '../users';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  users = users;
  checkoutForm;
  constructor(private formBuilder: FormBuilder,
    private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      username: '',
      password: ''
    });
    console.log('inside submit');
  }

  onSubmit(user){
    let validUser = false;
    users.forEach(element => {
      if(element.username == user.username
        && element.password == user.password){
          alert('log in');
          validUser = true;
      }
    });

    if(!validUser){
      alert('invalid username/password');
    }else{
      this.router.navigate(['main']);
    }
  }
}
