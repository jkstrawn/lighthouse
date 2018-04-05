import game from './gameEngine';
import ServerEvents from "../../../shared/network/serverEventEnum";
import CharacterCreateModel from "../../../shared/network/fromClient/characterCreateModel";
import SendAngleModel from "../../../shared/network/fromClient/sendAngleModel";
import SendChatModel from "../../../shared/network/fromClient/sendChatModel";
import PlayerStateModel from "../../../shared/network/fromClient/playerStateData";
import MoveItemModel from "../../../shared/network/fromClient/moveItemModel";
import UseItemModel from "../../../shared/network/fromClient/useItemModel";
import BuyItemModel from "../../../shared/network/fromClient/buyItemModel";
import SellItemModel from "../../../shared/network/fromClient/sellItemModel";
import LootItemModel from "../../../shared/network/fromClient/lootItemModel";
import CharacterJoinModel from "../../../shared/network/fromClient/characterJoinModel";
import AddItemModel from "../../../shared/network/fromServer/addItemModel";
import RemoveItemModel from "../../../shared/network/fromServer/removeItemModel";
import LevelUpModel from "../../../shared/network/fromServer/levelUpModel";
import DeleteEntityModel from "../../../shared/network/fromServer/deleteEntityModel";
import ClientEvents from "../../../shared/network/clientEventEnum";
import CastSpellModel from "../../../shared/network/fromClient/castSpellModel";
import SpendAttributeModel from "../../../shared/network/fromClient/spendAttributeModel";
import UpdateChatModel from "../../../shared/network/fromServer/updateChatModel";
import WorldUpdateModel from "../../../shared/network/fromServer/worldUpdateModel";
import EntityDataModel from "../../../shared/network/fromServer/entityDataModel";
import ServerErrorModel from "../../../shared/network/fromServer/serverErrorModel";
import * as io from "socket.io-client";
import Ui from "../ui/_userInterface";

function setSocketFunctions(socket) {

	socket.on(ServerEvents.Connect, function () {
		Network.onConnect();
	});

	socket.on(ServerEvents.Error, function (data: ServerErrorModel) {
		Ui.assignErorr(data.type, data.message);
	});

	socket.on(ServerEvents.CharacterData, function (data: EntityDataModel) {
		game.initiateThisPlayer(data);
	});

	socket.on(ServerEvents.UpdateChat, function (data: UpdateChatModel) {
		Ui.Chat.updateLog(data.name, data.message);
	});

	socket.on(ServerEvents.Update, function (data: WorldUpdateModel) {
		Network.onUpdate(data.packetNum, data.states);
	});

	socket.on(ServerEvents.FullState, function (data: WorldUpdateModel) {
		Network.onFullState(data.packetNum, data.states);
	});

	socket.on(ServerEvents.AddEntity, function (data: EntityDataModel) {
		game.createEntity(data);
	});

	socket.on(ServerEvents.DeleteEntity, function (data: DeleteEntityModel) {
		game.deleteEntity(data.id, data.wasKilled);
	});

	socket.on(ServerEvents.PlayerDied, function () {
		game.onPlayerDied();
	});

	socket.on(ServerEvents.PrivateData, function (data: EntityDataModel) {
		console.log(data);
		game.handlePrivateData(data);
	});
}

export default class Network {
	static socket = null;
	static stateBuffer = [];
	static timeOfLastUpdate: number = new Date().valueOf();

	static numOfWholePackets = 0;
	static lastPacketNumber = 0;

	static connect() {
		this.socket = io.connect();

		setSocketFunctions(this.socket);
	}

	static update(dt: number) {
		let newTime = new Date().valueOf();
		let tickTime = newTime - this.timeOfLastUpdate;
	}

	static joinWithCharacter(data: CharacterJoinModel) {
		this.socket.emit(ClientEvents.CharacterJoin, data);
	}

	static sendChat(data: SendChatModel) {
		this.socket.emit(ClientEvents.SendChat, data);
	}

	static sendPlayerState(data: PlayerStateModel) {
		this.socket.emit(ClientEvents.State, data);
	}


	/************************************* From Server ****************************************/

	static onConnect() {
		console.log("connected to the server");
	}

	static onFullState(packetNum: number, entities: Array<EntityDataModel>) {
		this.lastPacketNumber = packetNum;
		game.handleFullState(entities);
	}

	static onUpdate(packetNum: number, states: Array<EntityDataModel>) {
		if (packetNum != this.lastPacketNumber + 1 && this.lastPacketNumber > 0) {
			console.log("lost a packet");
		}

		this.lastPacketNumber = packetNum;

		game.handleUpdatePacket(states);
	}
}