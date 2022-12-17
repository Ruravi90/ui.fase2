export const environment = {
  production: true,
  urlApi: 'http://api.fase2spa.com.mx/api/',
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
