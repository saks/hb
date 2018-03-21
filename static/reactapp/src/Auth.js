class Auth {
    constructor(openSignInDialog) {
        Auth.instance = this;
        this.openSignInDialog = openSignInDialog;
    }

    start() {
        if (!this.isSignedIn) {
            this.openSignInDialog();
        }
    }

    get isSignedIn() {
        return Auth.token && Auth.profile && Auth.profile.tags;
    }

    static async fetchProfile() {
        const tokenPayload = this.parsedToken;

        const profileResponse = await this.fetch(`/api/user/${tokenPayload.user_id}/`);

        if (!profileResponse.ok) {
            return false;
        }

        this.profile = await profileResponse.json();
        return true;
    }

    static get parsedToken() {
        const base64Url = this.token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    static set token(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static get token() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static set profile(profile) {
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    }

    static get profile() {
        const json = localStorage.getItem(this.PROFILE_KEY);
        return JSON.parse(json);
    }

    static get TOKEN_KEY() {
        return 'AUTH_TOKEN';
    }

    static get PROFILE_KEY() {
        return 'PROFILE';
    }

    static async refresh() {
        const response = await fetch('/auth/jwt/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: this.token }),
        });

        if (!response.ok && 400 === response.status) {
            this.token = null;
            this.profile = null;
            this.instance.form.toggle(true);
        } else {
            debugger;
        }
    }

    static async fetch(url, options = {}) {
        // APP.showSpinner();

        const token = localStorage.getItem(Auth.TOKEN_KEY);

        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = `JWT ${token}`;
        options.headers['User-Agent'] = 'Home Budget PWA';
        options.headers['Content-Type'] = 'application/json';

        const result = await fetch(url, options);

        if (!result.ok && result.status === 401) {
            await this.refresh();
            if (this.instance.isSignedIn) {
                return this.fetch(url, options);
            } else {
                this.instance.form.toggle(true);
            }
        }

        // APP.hideSpinner();

        return result;
    }
}

export default Auth;
