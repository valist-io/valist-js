"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCID = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const axios_2 = __importDefault(require("axios"));
const progress_1 = __importDefault(require("progress"));
const platforms = {
    "win32": "windows",
};
const archs = {
    "ia32": "386",
    "x64": "amd64",
};
const release = {
    tag: '0.6.1',
    releaseCID: '/ipfs/QmWNyPgGc4JhAF1uw4jhtMj9XwSBGaATeFCSAmocbBEuPU',
    metaCID: 'QmRBwMae3Skqzc1GmAKBdcnFFPnHeD585MwYtVZzfh9Tkh',
};
function getHostInfo() {
    let platform = String(os_1.default.platform());
    let arch = os_1.default.arch();
    if (platform in platforms) {
        platform = platforms[platform];
    }
    if (arch in archs) {
        arch = archs[arch];
    }
    return { platform, arch };
}
const parseCID = (url) => url.replace('/ipfs/', '');
exports.parseCID = parseCID;
function fetchJSONfromIPFS(ipfsHash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const json = yield axios_2.default.get(`https://gateway.valist.io/ipfs/${(0, exports.parseCID)(ipfsHash)}`);
            return json.data;
        }
        catch (e) {
            const msg = 'Could not fetch JSON from IPFS';
            console.error(msg, e);
            throw e;
        }
    });
}
function fetchArtifact(cid) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://gateway.valist.io/${cid}`;
        const filePath = path_1.default.resolve(path_1.default.dirname(__dirname), 'bin', 'valist');
        const writer = fs_1.default.createWriteStream(filePath);
        const { data, headers } = yield (0, axios_1.default)({
            url,
            method: 'GET',
            responseType: 'stream',
        });
        const totalLength = headers['content-length'];
        const progressBar = new progress_1.default('-> Downloading [:bar] :percent :etas', {
            width: 40,
            complete: '☯',
            incomplete: ' ',
            renderThrottle: 1,
            total: parseInt(totalLength),
        });
        data.on('data', (chunk) => progressBar.tick(chunk.length));
        data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching release", release.tag, "with provider", release.releaseCID);
    const meta = yield fetchJSONfromIPFS(release.releaseCID);
    const info = getHostInfo();
    process.stdout.write(`Detected host platform ${info}`);
    console.warn("test");
    console.error("test");
    const hostBin = meta.artifacts[`${info.platform}/${info.arch}`];
    console.log("Matching artifact found", hostBin);
    console.log("Downloading Valist Go binary:");
    yield fetchArtifact(hostBin.provider);
}))();
//# sourceMappingURL=index.js.map