"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.$wuxBackdrop=exports.$wuxLoading=exports.version=exports.getCtx=void 0;var getCtx=function(e,t){var r=(1<arguments.length&&void 0!==t?t:getCurrentPages()[getCurrentPages().length-1]).selectComponent(e);if(!r)throw new Error("无法找到对应的组件，请按文档说明使用组件");return r};exports.getCtx=getCtx;var version="3.8.5";exports.version=version;var $wuxLoading=function(e,t){return getCtx(0<arguments.length&&void 0!==e?e:"#wux-loading",1<arguments.length?t:void 0)};exports.$wuxLoading=$wuxLoading;var $wuxBackdrop=function(e,t){return getCtx(0<arguments.length&&void 0!==e?e:"#wux-backdrop",1<arguments.length?t:void 0)};exports.$wuxBackdrop=$wuxBackdrop;