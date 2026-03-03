import { waappaController } from './waappa.controller.js';

export async function handleWaappa(req, res, url) {
    if (url.pathname.startsWith('/waappa')) {
        const handled = await waappaController.handleRequest(req, res, url);
        if (handled !== false) return true;
    }
    return false;
}
