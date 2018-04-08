import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {Observable} from 'rxjs/Observable';
import {MessageService} from './message.service';
import {HttpClient} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs/observable/of";

@Injectable()
export class HeroService {

  private heroesUrl = 'https://api.github.com';  // URL to web api

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  getHero(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/repos/clairtonluz/${id}`)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>('getHeroes'))
      );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}/users/clairtonluz/repos`)
      .pipe(
        tap(hero => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
