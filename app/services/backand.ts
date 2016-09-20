import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Backand {
  auth_token: {header_name: string, header_value: string} = {header_name: 'AnonymousToken', header_value: 'f53fd52e-dec6-41c8-93b4-daef813ebdbe'};
  api_url: string = 'https://api.backand.com';
  app_name: string = 'acgo';

  constructor(public http: Http) {}

  private authHeader() {
    var authHeader = new Headers();
    authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
    return authHeader;
  }

  public getTodos() {
    return this.http.get(this.api_url + '/1/objects/todos?returnObject=true', {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }

  public addTodo(name: string) {
    let data = JSON.stringify({name: name});

    return this.http.post(this.api_url + '/1/objects/todos?returnObject=true', data,
    {
      headers: this.authHeader()
    })
    .map(res => {
      return res.json();
    });
  }

  public removeTodo(id: string) {
    return this.http.delete(this.api_url + '/1/objects/todos/' + id,
    {
      headers: this.authHeader()
    })
    .map(res => {
      return res.json();
    });
  }
}