export const environment = {
  production: true,
  urlApi: 'http://api.fase2spa.com.mx/api/',
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
