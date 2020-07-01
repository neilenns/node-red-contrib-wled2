import dnssd from "dnssd";

import IWledDevice from "../src/types/IWledDevice";

module.exports = discover;

async function discover(timeout: number): Promise<IWledDevice[]> {

    return new Promise((resolve, reject) => {
        const wledDevices: IWledDevice[] = [];

        const browser = new dnssd.Browser(dnssd.tcp("http"));

        browser.on("serviceUp", (service) => {
            const wledDevice = isWled(service);
            if (wledDevice) {
                wledDevices.push(wledDevice);
            }
        }).start();
    })
}

function isWled(service: any): IWledDevice | undefined {
    return {
        address: "192.168.30.14",
        name: "test",
        version: "1.0"
    };
}