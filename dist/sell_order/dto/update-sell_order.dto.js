"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSellOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sell_order_dto_1 = require("./create-sell_order.dto");
class UpdateSellOrderDto extends (0, swagger_1.PartialType)(create_sell_order_dto_1.CreateSellOrderDto) {
}
exports.UpdateSellOrderDto = UpdateSellOrderDto;
//# sourceMappingURL=update-sell_order.dto.js.map