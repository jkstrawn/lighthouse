import EntityDataModel from "./entityDataModel";

export default interface WorldUpdateModel {
    packetNum: number;
    states: Array<EntityDataModel>;
}