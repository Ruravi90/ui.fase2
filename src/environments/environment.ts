// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  urlApi: 'http://localhost:8000/api/',
  //urlApi: 'https://196d-2806-310-122-8c33-ad5b-4ec0-41d4-43ec.ngrok-free.app/api/',
  //urlApi: 'http://api.fase2spa.com.mx/api/',
  urlLocal: window.location.origin + '/',
  getRoles: (p: any) => {
    if (typeof p === null) { return false; }
    let user = localStorage.getItem('currentUser');
    let currentUser = JSON.parse(user!).claims;

    if (currentUser == null) {
      return false;
    }
    let result = false;
    if (Array.isArray(p)) {
      p.forEach(v => {
        if (currentUser.profile == v) {
          result = true;
        }
      });
    } else if (typeof(p) === "string") {
      if (currentUser.profile == p) {
        result = true;
      }
    }
    return result;
  }
};
