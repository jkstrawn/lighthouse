import PlayerAttribute from "../../entities/model/playerAttribute";

export default interface CharacterCreateModel {
    username: string;
    class: number;
    attributes: Array<PlayerAttribute>;
}