
export const isValidProxy = (proxy) => {
    const proxyRegex = /^http:\/\/(?:[^:@\s]+:[^:@\s]+@)?([0-9]{1,3}\.){3}[0-9]{1,3}:\d+$/;
    return proxyRegex.test(proxy);
};

export const getProxyArgs = (proxy) => {
    if (!proxy) return [];
    return [`--proxy-server=${proxy}`];
};