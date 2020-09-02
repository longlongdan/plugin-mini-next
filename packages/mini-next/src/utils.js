import fs from 'fs';
import path from 'path';
const configPath = path.resolve(process.cwd(), './config/mini-next.config.js');
const defaultConfig = {
    prefixCDN: '/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 页面路由前缀 默认/pagename  添加后前缀后访问方式为 /prefixUrl/pagename
    ssr: true, // 是否采用服务端渲染
    ssrCache: true, // 是否全局使用服务端渲染缓存 第一次ssr,再次采用缓存，适用与存静态资源或者所有人访问的页面都是一样的工程
    statiPages: [], // 纯静态页面 执行一次服务端渲染，之后采用缓存html
    ssrIngore: null // 指定某一个或者多个page项目不采用服务端渲染  正则
};
export function isResSent(res) {
    return res.finished || res.headersSent;
}

function normalizeConfig(App, config) {
    if (typeof config === 'function') {
        config = config(App, { defaultConfig });

        if (typeof config.then === 'function') {
            throw new Error('> Promise returned in mini-next config');
        }
    }
    return config;
}

export function getConfig(App) {
    if (fs.existsSync(configPath)) {
        let configModule = require(configPath);
        let useConfig = normalizeConfig(App, configModule);
        return Object.assign({}, defaultConfig, useConfig);
    } else {
        return defaultConfig;
    }
}
