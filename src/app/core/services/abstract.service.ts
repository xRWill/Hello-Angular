import 'rxjs/add/observable/throw';
import { Headers, Response, URLSearchParams } from '@angular/http';

import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/**
 * Abstract Class Service.
 */
export abstract class Service {

  protected headers: Headers;
  protected domain: string = environment.api_url;
  protected abstract API_ENDPOINT: string;
  protected required_columns: Array<string> = [];

  public constructor() {
    this.headers = new Headers({ 'Accept': 'application/json' });
    //this.headers.append("content-type", "application/x-www-form-urlencoded");
  }

  protected setAuthorizationHeader() {
    this.headers.set('authorization', sessionStorage.getItem('token_type') +' ' + sessionStorage.getItem('token'));
  }

  /**
   * Returns full API endpoint.
   */
  protected apiEndpoint(path: string = ''): string {
    let url = this.domain + '/';
    url += (this.API_ENDPOINT !== '') ? this.API_ENDPOINT + '/' : '';

    return url + path;
  }

  /**
   * Handle response errors.
   */
  public handleError(error: Response | any): Observable<any> {
    let errorMsg: string;
    let body: string | any;

    if (error instanceof Response) {
      body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errorMsg = `${error.statusText || ''}, ${err}`;
    } else {
      errorMsg = error.statusText ? error.statusText : error.toString();
    }

    console.error(`${error.status} - ` + errorMsg);

    return Observable.throw(body);
  }

  protected parseGetParams(data: Object = {}) {
    let urlParams: URLSearchParams = new URLSearchParams;
    let tmpArray = new Array();

    if (_.get(data, 'advanced_search', false)) {
      _.forOwn(data, (value, key) => {
        // the value it's an object?
        if (_.isPlainObject(value)) {
          _.forOwn(value, (subValue) => { subValue != '' ? urlParams.append(key+'[]', subValue) : null; });
          console.info();
        } else if (_.isArray(value)) {
          _.forOwn(value, (subValue => { urlParams.append(key+'[]', subValue) }));
        } else {
          urlParams.set(key, value);
        }
      });

      return urlParams;
    }

    _.forOwn(data, (value, key) => {
      // parse search, sortedBy and page param
      if (key == "search" || key == "sortedBy" || key == 'page' || key == 'trashed') {
        urlParams.set(key, value);
      }

      // parse orderBy param
      if (key == "orderBy") {
        if (_.has(data, 'orderByRelationsMap.'+value)) {
          //console.warn(_.get(data, 'orderByRelationsMap.'+value) as String);
          urlParams.set(key, _.get(data, 'orderByRelationsMap.'+value) as string);
        } else {
          urlParams.set(key, value);
        }
      }

      // parse columns param
      if (key == "filter") {
        // concat the required_columns with the filter columns given on parameters
        urlParams.set('filter', _.join(this.required_columns.concat(value), ';'));
      }

      // parse include model relations
      if (key == "include") {
        tmpArray = [];
        // iterate over the include object
        _.forOwn(value, (includeValue, includeKey) => {
          // if the include key exist on the columns array, then collect the include value
          if (_.includes(_.get(data, 'filter', []), includeKey)) {
            tmpArray.push(includeValue);
          }
        });
        // join the array with "," and set the url param
        urlParams.set(key, _.join(tmpArray, ','));
      }
    });

    return urlParams;
  }
}