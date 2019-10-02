export default __dirname;
import { container } from "./Infrastructure/ioc/ioc_container";
import { bootstrap } from './Adapter/HttpServer'
import { referenceDataIoCModule } from "./inversify.config";


async function runApp() {
	const app = await bootstrap(
		container,
		process.env.APP_PORT || 3001,
		process.env.DB_USERNAME || "user_default",
		process.env.DB_PASSWORD || "n1LYK0JoOQzskjpc",
		process.env.DB_NAME || "project_klaxoon",
		referenceDataIoCModule
	);
	return app;
}

(async () => {
	await runApp();
})();

export { runApp };
