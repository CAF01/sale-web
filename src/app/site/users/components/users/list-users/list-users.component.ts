import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { User } from '../../../models/entitys/user';
import * as moment from 'moment';
import { userInfo } from '../../../models/entitys/userInfo';
import { Router, RouterLink } from '@angular/router';
import { userSetStatRequest } from '../../../models/request/usersetstatrequest';
import { ToastrService } from 'ngx-toastr';
import { UserAddressInfo } from '../../../models/entitys/user-address-info';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: PaginationListResponse<User> | undefined;
  userAddress: UserAddressInfo;
  hasAddress: boolean;
  selectedIndex: number;

  page: number = 1;

  statusUsers?: boolean = undefined;

  constructor(
    private usersService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getUsers();

    moment().locale('es');
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {}
    );
  }

  getAddres(user: User) {
    if (user.addressID) {
      let modal = this.modalService.open(AlertModalComponent, {
        centered: true,
      });

      modal.componentInstance.numModal = 1;
      modal.componentInstance.title = 'Dirección de usuario';
      modal.componentInstance.userAddress = user;

      modal.result;
    } else {
      let modal = this.modalService.open(AlertModalComponent, {
        centered: true,
      });

      modal.componentInstance.numModal = 1;
      modal.componentInstance.title = 'Dirección de usuario';

      modal.result;
    }
  }

  edit(user: userInfo) {
    this.router.navigate(['home/users/update-user'], {
      queryParams: { user: JSON.stringify(user) },
      skipLocationChange: true, //skip location para ocultar el json de la URL
    });
  }

  SetStatusUser(user: User, stat: boolean) {
    const RequestDelete = new userSetStatRequest();
    RequestDelete.userID = user.userID;
    RequestDelete.status = stat;
    this.usersService.deleteuser(RequestDelete).subscribe(
      (response) => {
        user.status = stat;
        if (user.status)
          this.showSuccess(
            '¡Restauración realizada!',
            'Usuario restaurado correctamente',
            
          );
        else this.showSuccess('¡Adios!','Usuario eliminado correctamente');
      },
      (error) => console.log(error)
    );
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  DelSelected(user: User) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de usuario';
    modal.componentInstance.message =
      '¿Desea eliminar a ' + user.firstName + ' ' + user.lastName + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusUser(user, false);
        }
      })
      .catch((err) => {});
  }

  RestoreUser(user: User) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restaurarión de usuario';
    modal.componentInstance.message =
      '¿Desea restaurar a ' + user.firstName + ' ' + user.lastName + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusUser(user, true);
        }
      })
      .catch((err) => {});
  }

  showSuccess(title: string, message: string) {
    this.toastr.success(message, title);
  }

  pageChange(page: any) {
    this.usersService
      .getUsersByPage((page - 1) * this.users.pageSize)
      .subscribe((response) => {
        this.users = response;
      });
  }

  SetStat(value : number)
  {
    console.log('hola');
    if (value==1)
      this.statusUsers=null;
    if(value==2)
      this.statusUsers=true;
    if(value==3)
      this.statusUsers=false;
  }
}
