import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { DisplayLottieComponent } from '../../shared-components/display-lottie/display-lottie.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private loader: DisplayLottieComponent;

  loadedLibraries: { [url: string]: ReplaySubject<void> } = {};

  constructor(@Inject(DOCUMENT) private readonly document: Document) { }

  loadScript(url: string): Observable<void> {
      if (this.loadedLibraries[url]) {
          return this.loadedLibraries[url].asObservable();
      }

      this.loadedLibraries[url] = new ReplaySubject();

      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = () => {
          this.loadedLibraries[url].next();
          this.loadedLibraries[url].complete();
      };

      this.document.body.appendChild(script);

      return this.loadedLibraries[url].asObservable();
  }


  setLoader(loader: DisplayLottieComponent): void {
    this.loader = loader;
  }


  beginWorking(): void {
    if (this.loader) this.loader.isWorking(true);
  }

  stopWorking(): void {
    if (this.loader)  this.loader.isWorking(false);
  }




}
