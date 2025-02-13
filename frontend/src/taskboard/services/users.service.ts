import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TaskDto } from '../client/model/taskDto';
import { UserDto } from '../client/model/userDto';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for backend calls related to users.
 */
export class UsersService {
  baseUrl = '/api/users';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get all users.
   */
  public getUsers(): Promise<Array<UserDto>> {
    const url = this.baseUrl;
    return firstValueFrom(this.httpClient.get<Array<UserDto>>(url));
  }

}
