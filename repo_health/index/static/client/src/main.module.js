/*
* main.module.js - (C) Copyright - 2017
* This software is copyrighted to contributors listed in CONTRIBUTIONS.md.
*
* SPDX-License-Identifier: MIT
*
* Author(s) of this file:
* @bparish628
* J. Harding
*
* This is where the angular app gets bootstrapped.
* It will set up all the global configuration.
*/

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import resources from './resources';
import components from 'components/components.module.js';
import mainComponent from './main.component';
import StatsService from 'components/utils/stats.service';
import 'angular-chart.js';

//Styles
import 'global.css';

export const main = angular.module('repo-health', [
    uiRouter,
    ngMaterial,
    'chart.js',
    components,
    resources,
  ])
  .component('main', mainComponent)
  .service('StatsService', StatsService)
  .config(($locationProvider, $urlRouterProvider, $mdThemingProvider, $stateProvider) => {
    'ngInject';
    
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/search');
    $stateProvider.state('repo-health', {
      url: '/repo-health/:owner__login/:name',
      resolve: {
        statsUrls: (RepoDetailsService, $stateParams, $state) => {
          return RepoDetailsService.getStatsUrls($stateParams)
            .then(resp => { return resp; }, () => { return { error: true } });
        }
      },
      views: {
        'repo-details': {
          resolve: {
            detailsUrl: (statsUrls) => { return statsUrls['repo_details_url']; }
          },
          template: '<repo-details details-url="$resolve.detailsUrl"></repo-details>',
        },
        'pull-req-stats': {
          resolve: {
            prStatsUrl: (statsUrls) => { return statsUrls['pr_stats_url']; }
          },
          template: '<pull-req-stats pr-stats-url="$resolve.prStatsUrl"></pull-req-stats>'
        },
        'issue-stats': {
          template: '<issue-stats issue-stats-url="$resolve.issueStatsUrl"></issue-stats>',
          resolve: {
            issueStatsUrl: (statsUrls) => { return statsUrls['issue_stats_url']; }
          }
        }
      }
    });

    // Set-up themes
    $mdThemingProvider.theme('error').backgroundPalette('red').dark();

    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('orange')
      .backgroundPalette('blue-grey');
  })
  .name;
