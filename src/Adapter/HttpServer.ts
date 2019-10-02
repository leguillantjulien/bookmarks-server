import 'reflect-metadata';
import { Container, ContainerModule } from "inversify";
import * as express from 'express'
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import TYPES from "../constant/types";
import { reqMiddleware, exceptionLoggerMiddleware } from "./middleware/middleware";
import { DbClient, getDatabaseClient } from '../Infrastructure/repository/config/MongooseConnector';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

var cors = require('cors')
// start the server
export async function bootstrap(
	container: Container,
	appPort: number,
	dbUser: string,
	dbPassword: string,
	dbName: string,
	...modules: ContainerModule[]
) {
	const db = await getDatabaseClient(dbUser, dbPassword, dbName);
	container.bind<DbClient>(TYPES.DbClient).toConstantValue(db);
	container.load(...modules);

	let server = new InversifyExpressServer(container);
	server.setConfig((app) => {

		// Disable default cache
		app.set("etag", true);

		app.use(function (req, res, next) {
			res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
			res.header('Access-Control-Allow-Credentials', 'true');
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			res.header('Access-Control-Expose-Headers', 'Content-Length');
			res.header('Access-Control-Allow-Headers', "Content-Type,access-control-allow-methods,x-auth-token,x-user-token,access-control-allow-origin, access-control-allow-headers");
			res.header('Access-Control-Request-Headers', "X-Requested-With, accept, content-type");
			app.use(cors())
			if (req.method === 'OPTIONS') {
				return res.sendStatus(200);
			} else {
				return next();
			}
		});

		// Configure requests body parsing
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		// Adds some security defaults
		app.use(helmet());
		let logger = makeLoggerMiddleware();
		container.applyMiddleware(logger);
		// Log all requets that hit the server
		app.use(reqMiddleware);

	});

	server.setErrorConfig((app) => {
		// Catch and log all exceptions
		app.use(exceptionLoggerMiddleware);
	});

	const app = server.build();
	console.log(`Application listening on port ${appPort}...`);
	app.listen(appPort);

	container.bind<express.Application>(TYPES.App).toConstantValue(app);

	return app;
}
