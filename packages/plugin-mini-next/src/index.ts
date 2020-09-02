import { Uma, TPlugin } from "@umajs/core";
require('@babel/register')({
    presets: ['@babel/env','@babel/react']
});
require( "core-js/stable");
require("regenerator-runtime/runtime");
const MiniNext = require('mini-next');

export type Options = {};

export default (uma: Uma) => {
    console.log(123)
    new MiniNext(uma.app);
};