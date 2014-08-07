/*jslint
    browser: true,
    devel:true ,
    node:true,
    nomen: true,
    es5:true
*/

/**
 * @auth Gaurav Meena
 * @date 01/16/2014
 * This is the main router and controller handler file for angular MVC
 */

/*global angular*/

'use strict';
var DEV = true;

angular.module('odeskApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'chieffancypants.loadingBar'
]).config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
}).factory('AuthInterceptor', function ($window, $cookies, $q) {
  return {
    request: function(config) {
      //remove prefix url
      if (config.url.indexOf("http://a3.codenvy-dev.com/api") == 0) {
         config.url = config.url.substring("http://a3.codenvy-dev.com".length);
      }
      
      //Uncomment to use accross condevy-stg (and comment before)
      /*
      if (config.url.indexOf("https://codenvy-stg.com/api") == 0) {
        config.url = config.url.substring("https://codenvy-stg.com/api".length);
      }
      */


      //Do not add token on auth login
      if (config.url.indexOf("/api/auth/login") == -1 && $cookies.token) {
        config.params = config.params || {};
        angular.extend(config.params, {token: $cookies.token});

      }
      return config || $q.when(config);
    },
    response: function(response) {
      if (response.status === 401) {
        // TODO: Redirect user to login page.
      }
      return response || $q.when(response);
    }
  };
}).config(function ($routeProvider, $locationProvider, $httpProvider) {
    var DEFAULT;
    var BASE_URL;

    if (DEV) {
        DEFAULT = '/login';
        BASE_URL = '/';
    } else {
        DEFAULT = '/dashboard';
        BASE_URL = '/dashboard/';
    }

   if (DEV) {
      $httpProvider.interceptors.push('AuthInterceptor');
    }
    $routeProvider
	    .when('/dashboard', {
            templateUrl: BASE_URL + 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
	    .when('/factories', {
            templateUrl: BASE_URL + 'views/factories.html',
            controller: 'FactoriesCtrl'
        })
	    .when('/stats', {
            templateUrl: BASE_URL + 'views/stats.html',
            controller: 'StatsCtrl'
        })
        .when('/admin', {
            templateUrl: BASE_URL + 'views/admin.html',
            controller: 'AdminCtrl'
        })
	    .when('/organizations', {
            templateUrl: BASE_URL + 'views/organizations.html',
            controller: 'OrganizationsCtrl'
        })
	    .when('/organizations/:name', {
            templateUrl: BASE_URL + 'views/orgdetail.html',
            controller: 'OrgdetailCtrl'
        })
        .when('/account', {
            templateUrl: BASE_URL + 'views/account/profile.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/configuration', {
            templateUrl: BASE_URL + 'views/account/configuration.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/preferences', {
            templateUrl: BASE_URL + 'views/account/preferences.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/profile', {
            templateUrl: BASE_URL + 'views/account/profile.html',
            controller: 'AccountConfigCtrl'
        })
        .when('/account/billing', {
            templateUrl: BASE_URL + 'views/account/billing.html',
            controller: 'DashboardCtrl'
        })
        .when('/login', {
            templateUrl: BASE_URL + 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/subscriptions', {
            templateUrl: BASE_URL + 'views/subscriptions.html',
            controller: 'SubscriptionsCtrl'
        })
        .when('/subscriptions/:id', {
            templateUrl: BASE_URL + 'views/subscriptiondetails.html',
            controller: 'SubscriptionDetailsCtrl'
        })
        .otherwise({
            redirectTo: DEFAULT
        });

	//while uncommenting line below fix # in navbar.js
    //$locationProvider.html5Mode(true);
});
