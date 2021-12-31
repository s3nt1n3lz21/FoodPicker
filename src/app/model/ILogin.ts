import { FormGroup } from "@angular/forms";

export interface LoginDetails {
    email: string;
    password: string;
}

export function emptyLoginDetails() {
    return {
        email: '',
        password: ''
    }
}

export interface ILoginForm extends FormGroup {
    value: LoginDetails;
}