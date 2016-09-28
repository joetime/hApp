
import { Backand } from './backand.service';
import { ExceptionHandler, WrappedException, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';

export class AppExceptionHandler extends ExceptionHandler {
    
    http: Http;
 
    constructor( @Inject(Http) http: Http) {
        super(new _ArrayLogger(), true); // (ArrayLogger is defined below)
        this.http = http;
    }
 
    call(exception, stackTrace = null, reason = null) {
 
        try {
            var extractedException = this._extractMessage(exception, stackTrace, reason);
            //var queryParams = JSON.stringify(extractedException);
    
            var queryHeaders = this.authHeader();
    
            this.http.post('https://api.backand.com/1/objects/logs', extractedException, { headers: queryHeaders }).subscribe(res => { });
        }
        catch (ex) {
            console.warn('exception not logged because ', ex);
            console.error('original exception: ', exception);
        }

        // also run the standard ExceptionHandler
        super.call(exception, stackTrace, reason);
    }
 
    // creates a log object from the exception info
    _extractMessage(exception: any, stackTrace:any, reason: any): any {
        let log = { isError: true, msg: "", obj: "", src: "" };
        log.msg = exception instanceof WrappedException ? exception.wrapperMessage : exception.toString();
        log.src = stackTrace ? stackTrace.toString(): "";
        log.obj = reason ? reason.ToString() : "";
        return log;
    }

    // Auth for Backand server
    private auth_token = {header_name: 'AnonymousToken', header_value: 'f53fd52e-dec6-41c8-93b4-daef813ebdbe'};
    private authHeader(): Headers {
        var authHeader = new Headers();
        authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
        return authHeader;
    }
}

// a class to pass along to the standard ExceptionHandler
class _ArrayLogger {
  res = [];
  log(s: any): void { this.res.push(s); }
  logError(s: any): void { this.res.push(s); }
  logGroup(s: any): void { this.res.push(s); }
  logGroupEnd(){};
}
