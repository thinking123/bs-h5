export const sites =  [
    {value: '海陵区', key: '0'},
    {value: '高港区', key: '1'},
    {value: '医药高新区', key: '2'},
    {value: '姜堰区', key: '3'},
    {value: '泰兴市', key: '4'},
    {value: '靖江市', key: '5'},
    {value: '兴化市', key: '6'},
    {value: '市直', key: '7'},
]

export const titles = [
    {title:'' , tip:''}
]
export function getSiteByKey(key) {
    if(key && key >= 0 && key <= 7){
        const site = sites.find(f=>f.key == key)
        return site.value
    }else{
        return null
    }

}

export function isObjEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function getOS() {

    const u = navigator.userAgent, app = navigator.appVersion;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return [isAndroid , isiOS]
}
export function isIphone() {
    const u = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

export function isIphone6() {
    const iHeight = window.screen.height;
    const iWidth = window.screen.width;
    const isiOS = isIphone();
    if (isiOS && iWidth === 375 && iHeight === 667) {
        return true;
    }else{
        return false;
    }
}
export function iPhoneVersion() {
    var iHeight = window.screen.height;
    var iWidth = window.screen.width;
    if (iWidth === 320 && iHeight === 480) {
        return "4";
    }
    else if (iWidth === 375 && iHeight === 667) {
        return "6";
    }
    else if (iWidth === 414 && iHeight === 736) {
        return "6p";
    }
    else if(screen.height == 667 && screen.width == 375){
        return "7";
    }
    else if (iWidth === 320 && iHeight === 568) {
        return "5";
    }
    else if (iHeight == 812 && iWidth == 375) {
        return "x";
    }

    else if (iHeight <= 480) {
        return "2-3";
    }
    return 'none';
}

export function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}
export function getViewport() {

    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
            viewPortHeight = window.innerHeight
    }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
            viewPortHeight = document.documentElement.clientHeight
    }

    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
            viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewPortWidth, viewPortHeight];
}

export function getFontsize(el) {
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    var fontSize = parseFloat(style);
// now you have a proper float for the font size (yes, it can be a float, not just an integer)
//     el.style.fontSize = (fontSize + 1) + 'px';
    console.log(fontSize)
    return fontSize
}

export function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export function debounce(func, wait, immediate) {
    var timeout, result;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
    };
}
