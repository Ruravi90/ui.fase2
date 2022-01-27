import { isArray, isString } from 'util';
export const environment = {
  production: true,
  urlApi: 'http://api.fase2spa.com.mx/api/',
  urlLocal: window.location.origin + '/',
  getRoles: (p: any) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser == null) {
      return false;
    }
    let result = false;
    if (isArray(p)) {
      p.forEach(v => {
        const i = currentUser.roles.findIndex(r => r.slug === v);
        if (i !== -1) {
          result = true;
        }
      });
    } else if (isString(p)) {
      const i = currentUser.roles.findIndex(r => r.slug === p);
      if (i !== -1) {
        result = true;
      }
    }
    return result;
  }
};
