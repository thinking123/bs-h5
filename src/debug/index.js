// import {getOS} from "../utils/common";
// const [isAndroid , isiOS] = getOS()
import {isWeiXin} from "../utils/common";

const development = process.env.NODE_ENV == 'development'
console.log(process.env.NODE_ENV)
if (development && isWeiXin()) {
    console.log('import v console')
    import('./vconsole').then(vc=>vc)
}

console.log('import v console')
// import('./vconsole').then(vc=>vc)
