import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated: boolean = false;

    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    setIsAuthenticated(val: boolean) {
        this.isAuthenticated = val;
    }
}