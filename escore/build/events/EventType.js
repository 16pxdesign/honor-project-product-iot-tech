"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["USER_CREATED"] = "USER CREATED";
    EventType["USER_DELETED"] = "USER DELETED";
    EventType["PRODUCT_SCANNED"] = "PRODUCT SCANNED";
    EventType["READER_REQUESTED"] = "READER REQUESTED";
    EventType["READER_STARTED"] = " READER STARTED";
    EventType["READER_STOPED"] = " READER STOPED";
    EventType["READER_REQUESTED_START"] = "START READER REQUESTED";
    EventType["READER_REQUESTED_STOP"] = "STOP READER REQUESTED";
    EventType["READER_PRESENCE_REQUESTED"] = "READER PRESENCE REQUESTED";
    EventType["READER_PRESENCE_RESPONDED"] = "READER PRESENCE RESPONDED";
    EventType["ORDER_PLACED"] = "ORDER PLACED";
    EventType["ORDER_APPROVED"] = "ORDER APPROVED";
    EventType["ORDER_REJECTED"] = "ORDER REJECTED";
})(EventType = exports.EventType || (exports.EventType = {}));
