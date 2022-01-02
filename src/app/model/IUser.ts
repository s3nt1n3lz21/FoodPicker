export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: string
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date(this._tokenExpirationDate) < new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenExpiration() {
        if (!this._tokenExpirationDate || new Date(this._tokenExpirationDate) < new Date()) {
            return null;
        }
        return this._tokenExpirationDate;
    }
}