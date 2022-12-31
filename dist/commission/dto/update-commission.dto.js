"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_commission_dto_1 = require("./create-commission.dto");
class UpdateCommissionDto extends (0, swagger_1.PartialType)(create_commission_dto_1.CreateCommissionDto) {
}
exports.UpdateCommissionDto = UpdateCommissionDto;
//# sourceMappingURL=update-commission.dto.js.map