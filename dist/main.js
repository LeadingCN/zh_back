"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const validation_pipe_1 = require("./shared/pipe/validation.pipe");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const xml_middleware_1 = require("./shared/middleware/xml.middleware");
const auth_guard_1 = require("./shared/guard/auth.guard");
const response_interceptor_1 = require("./shared/interceptor/response.interceptor");
const auth_service_1 = require("./auth/auth.service");
const cors_1 = require("./cors");
const config = require('../config.json');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use(new xml_middleware_1.XMLMiddleware().use);
    const auth = app.get(auth_service_1.AuthService);
    app.useGlobalGuards(new auth_guard_1.JwtAuthGuard(new core_1.Reflector(), auth));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.enableCors(cors_1.default);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(config.port);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map