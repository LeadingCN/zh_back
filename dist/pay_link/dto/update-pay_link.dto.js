"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayLinkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_pay_link_dto_1 = require("./create-pay_link.dto");
class UpdatePayLinkDto extends (0, swagger_1.PartialType)(create_pay_link_dto_1.CreatePayLinkDto) {
}
exports.UpdatePayLinkDto = UpdatePayLinkDto;
//# sourceMappingURL=update-pay_link.dto.js.map