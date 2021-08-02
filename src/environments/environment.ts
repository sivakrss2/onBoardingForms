// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   // baseApi : "http://202.129.196.133/boarding-system/api/"
//   baseApi : "http://202.129.196.133/boarding-system"
// };

export const environment = {
  production: false,
  // baseApi: 'http://202.129.196.133/boarding-system'
  // baseApi: 'http://202.129.196.133/onboarding-api'
  
  baseApi: 'http://localhost/onboarding-api'
  // baseApi: 'http://172.16.0.77:8085/onboard-api'
  
  // baseApi: 'http://106.51.50.95:5428/onboard-api'
  // baseApi: 'http://cgvakstage.com:8085/onboard-api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
