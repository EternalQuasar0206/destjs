import { Application, Router } from "../deps.ts";
import { handleRoute } from "../route.ts";
import { endpointsStore } from "../stores/endpoints.ts";
import { Callback, HandledRoute } from "../types.ts";

type ControllerClass = new () => Record<string, Callback>;

export function configureRouter(app: Application) {
  const start = Date.now();
  const router = new Router();

  for (const endpoint of endpointsStore.list.values()) {
    let path =
      endpointsStore.controllers[endpoint.controller].path + endpoint.path;
    const controllerClass = endpointsStore.controllers[endpoint.controller]
      .target as ControllerClass;
    const controller = new controllerClass();

    if (path[path.length - 1] === "/") {
      path = path.substring(0, path.length - 1);
    }

    const params: [string, HandledRoute] = [
      path,
      handleRoute(controller[endpoint.propertyKey]),
    ];

    switch (endpoint.method) {
      case "DELETE":
        router.delete(params[0], params[1]);
        break;

      case "GET":
        router.get(params[0], params[1]);
        break;

      case "PATCH":
        router.patch(params[0], params[1]);
        break;

      case "POST":
        router.post(params[0], params[1]);
        break;

      case "PUT":
        router.put(params[0], params[1]);
        break;

      default:
        break;
    }
  }

  app.use(router.routes());
  app.use(router.allowedMethods());
  console.log("> Routes configured!", `${Date.now() - start}ms`);
}