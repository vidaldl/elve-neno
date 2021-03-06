/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
require('./fontawesome');

window.Vue = require('vue');

import VueIziToast from 'vue-izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Authorization from './authorization/authorize';
import router from './router';

Vue.use(VueIziToast);
Vue.use(Authorization);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))


Vue.component('question-page', require('./pages/QuestionPage.vue').default);
Vue.component('spinner', require('./components/Spinner.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',

    data: {
        loading: false,
        interceptor: null
    },

    created() {
        this.enableInterceptor();
    },

    methods: {
        enableInterceptor() {
            // Add a request interceptor
            axios.interceptors.request.use((config) => {
                this.loading = true;
                return config;
            }, (error) => {
                this.loading = false;
                return Promise.reject(error);
            });

            // Add a response interceptor
            axios.interceptors.response.use((response) => {
                // Any status code that lie within the range of 2xx cause this function to trigger
                this.loading = false;
                return response;
            },  (error) => {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                this.loading = false;
                return Promise.reject(error);
            });
        },
        disableInterceptor () {
            axios.interceptors.request.eject(this.interceptor);
        }
    },
    router
});
