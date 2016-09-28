
import { ExceptionHandler, WrappedException, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
//import { Toast } from './toast.service';

export class AppExceptionHandler extends ExceptionHandler {
    
    http: Http;
    
    constructor( @Inject(Http) http: Http /*, @Inject(Toast) toast: Toast*/) {
        super(new _ArrayLogger(), true); // (ArrayLogger is defined below)
        this.http = http;
        //this.toast = toast;
        console.log('AppExceptionHandler initialized');
    }
 
    call(exception, stackTrace = null, reason = null) {
 
        console.info('exception caught');
        //this.toast.toast('exception caught');

        /*console.warn(exception);
        console.warn(stackTrace);
        console.warn(reason);*/

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

        /*console.warn ('context.source', exception.context.source); // line #
        console.warn ('message', exception.message); // summarized error message
        console.warn ('name', exception.name); // "Error"
        console.warn ('originalException', exception.originalException); // actual exception text
        console.warn ('originalStack', exception.originalStack); // undef
        console.warn ('wrapperMessage', exception.wrapperMessage); // src
        console.warn ('wrapperStack', exception.wrapperStack); // stack!
        */

        let log = { isError: true, msg: "", obj: "", src: "", detail: "" };
        log.msg = exception instanceof WrappedException ? exception.originalException : exception.src;
        log.src =  exception instanceof WrappedException ? exception.wrapperMessage : exception.toString();
        log.detail = exception instanceof WrappedException ? JSON.stringify(exception.wrapperStack): "";
        log.detail += stackTrace + "||" + reason;
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
