"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSocketDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_socket_dto_1 = require("./create-socket.dto");
class UpdateSocketDto extends (0, mapped_types_1.PartialType)(create_socket_dto_1.CreateSocketDto) {
}
exports.UpdateSocketDto = UpdateSocketDto;
//# sourceMappingURL=update-socket.dto.js.map