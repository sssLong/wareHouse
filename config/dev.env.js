'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // API_ROOT: '"http://127.0.0.1:8082"'
    API_ROOT: '"https://testwmsgw.brandslink.com:8443"'
    //     API_ROOT: '"http://172.19.43.25:8196"'
})
