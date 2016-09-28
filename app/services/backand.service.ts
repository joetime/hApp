import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsService } from './settings.service'; //private settings:SettingsService

@Injectable()
export class Backand {
  auth_token: {header_name: string, header_value: string} = {header_name: 'AnonymousToken', header_value: 'f53fd52e-dec6-41c8-93b4-daef813ebdbe'};
  api_url: string = 'https://api.backand.com'; // /1/objects/logs
  app_name: string = 'acgo';

  constructor(public http: Http, private settings:SettingsService) {}

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

  public getLogs() {
    // sort desc
    let sort = [{    "fieldName": "id",    "order": "desc"  }];
    
    return this.http.get(this.api_url + '/1/objects/logs?returnObject=true&pageSize=50&sort=' + JSON.stringify(sort), {
      headers: this.authHeader()
    })
    .map(res => res.json())
  }

  public addTodo(name: string) {
    console.log('Backand addTodo()', name);

    let data = JSON.stringify({name: name});

    return this.http.post(this.api_url + '/1/objects/todos?returnObject=true', data,
    {
      headers: this.authHeader()
    })
    .map(res => {
      return res.json();
    });
  }

  // actual call to service
  private addLog(msg: string, obj: any, src: string, isError: Boolean) {
    console.log('Backand addLog()')

    if (typeof(obj) == 'object') {
      obj = JSON.stringify(obj);
    }
    
    let data = JSON.stringify({msg: msg, obj: obj, src: src, isError: isError });

    return this.http.post(this.api_url + '/1/objects/logs?returnObject=false', data,
    {
      headers: this.authHeader() 
    })
    .map(res => {
      console.log('Backand addLog() res =>', res);
      return res.json();
    });
  }

  // wrapper - delays call by 3 seconds
  public log(msg: string, obj: any = "", src: string = "", isError: Boolean = false): Promise<any> {
    console.log('Backand log()');
    
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => { 
        this.addLog(msg, obj, src, isError).subscribe((res) => {
          console.log('Backand log resolve');
          resolve(res);
        }); 
        }, this.settings.logDelay)
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