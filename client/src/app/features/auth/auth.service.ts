import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegisterUserRequest, User } from "./auth.domain";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl = "http://localhost:8080/api";
  private readonly http = inject(HttpClient);

  registerNewUser(user: RegisterUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, user);
  }
}
