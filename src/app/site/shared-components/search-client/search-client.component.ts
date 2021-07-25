import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { client } from '../../clients/models/entitys/client';
import { ClientService } from '../../clients/services/client.service';
import { ValidateForm } from '../../core/helpers/validate-formfields-helper';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.scss']
})
export class SearchClientComponent implements OnInit {


  @Output()
  onSubmit = new EventEmitter<client>();

  active = 1;

  constructor(
    private _formBuilder: FormBuilder,
    private clientService:ClientService
  ) {}

  ngOnInit(): void {
    this.SetValidatorSearch();
  }
  search: string[];
  searching = false;

  submitAttempt: boolean = true;
  searchForm: FormGroup;

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searchingPhone: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      searchingLastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
    });
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  formatter = (client: client) =>
    client ? `${client.firstName} - ${client.phone} ` : '';

  searchPhone: OperatorFunction<string, readonly client[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) =>
        this.clientService
          .getClientByPhonePipe((term))
          .pipe(
            tap(() => {}),
            catchError(() => {
              return of([]);
            })
          )
      ),
      tap(() => this.searching = false)
    );

  searchLastName: OperatorFunction<string, readonly client[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) =>
        this.clientService
          .getClientByLastNamePipe((term))
          .pipe(
            tap(() => {}),
            catchError(() => {
              return of([]);
            })
          )
      ),
      tap(() => this.searching = false)
    );

    selectedItem($event,input){
      $event.preventDefault();
      input.value = '';
      let prod = $event.item as client;
      this.onSubmit.emit(prod);
    }


}
