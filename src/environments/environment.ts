// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  urlApi: 'http://localhost:8000/api/',
  //urlApi: 'http://api.fase2spa.com.mx/api/',
  urlLocal: window.location.origin + '/',
  getRoles: (p: any) => {
    if (typeof p === null) { return false; }
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    if (typeof currentUser === null) { return false; }
    let result = false;
    if (Array.isArray(p)) {
      p.forEach(v => {
        const i = currentUser.roles.findIndex((r:any) => r.slug === v);
        if (i !== -1) {
          result = true;
        }
      });
    } else if (typeof p === 'string') {
      const i = currentUser.roles.findIndex((r:any) => r.slug === p);
      if (i !== -1) {
        result = true;
      }
    }
    return result;
  }
};
