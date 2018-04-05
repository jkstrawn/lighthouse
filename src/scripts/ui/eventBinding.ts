// import game from "../core/gameEngine";
// import input from "./input";
// import ui from "./userInterface";
// import * as $ from 'jquery';
// import audio from '../audio/audioPlayer';
// import * as THREE from "three";

// window["$"] = $;

// export default class EventBinding {

//     static holdDelay: boolean;
//     static shiftPressed: boolean;
//     static context: THREE.Vector2;

//     static setupInput() {
//         const $body = $("body");
//         const $canvasContainer = $("#canvasContainer");
//         const $contextMenu = $(".context-menu");

//         $body.bind("contextmenu", function (e) {
//             // let x = e.pageX - canvas.offsetLeft;
//             // let y = e.pageY - canvas.offsetTop;

//             // console.log("right click");

//             // game.clickTest(x, y);

//             e.stopPropagation();
//             return false;
//         });

//         $body.keydown(function (e) {
//             if (e.shiftKey) {
//                 console.log("shift key");
//                 EventBinding.shiftPressed = true;
//             }

//             if (e.target.id != "data") {
//                 input.keyDown(e.keyCode);
//             }
//         });

//         $body.keyup(function (e) {
//             if (e.target.id != "data") {
//                 input.keyUp(e.keyCode);
//             }

//             if (!e.shiftKey) {
//                 EventBinding.shiftPressed = false;
//                 console.log("no shift key");
//             }
//         });

//         $canvasContainer.click(function (e) {
//             //if (!gettingFocus) {
//             input.leftClick(e);
//             //}

//             //gettingFocus = false;

//             e.stopPropagation();
//             e.preventDefault();
//         });

//         $("#interface").click(function(e) {
//             input.cancelSpell();
//         });

//         $canvasContainer.mousedown(function (e) {
//             if ($canvasContainer.is(":focus") == false) {
//                 //gettingFocus = true;
//             }

//             $contextMenu.removeClass("active");

//             if (e.button == 2) {
//                 if (EventBinding.shiftPressed) {
//                     EventBinding.context = new THREE.Vector2(e.clientX, e.clientY);
                    
//                     $contextMenu.addClass("active").css({ left: e.clientX + "px", top: e.clientY + "px" });
                    
//                     return;
//                 }
                
//                 input.rightMouseDown(e);
//             }
//         });

//         $contextMenu.on("click", "li", function (e) {
//             const coordinates = ui.getWorldCoordinates(EventBinding.context);
            
//             game.sendChat(`GM|${$(this).data("command")}|${coordinates.x}|${coordinates.z}`);

//             $contextMenu.removeClass("active");
//         });

//         $canvasContainer.mouseup(function (e) {
//             if (e.button == 2) {
//                 input.rightMouseUp(e);
//             }
//         });

//         $canvasContainer.mousemove(function (e) {
//             input.mouseMove(e);
//         });

//         $('#datasend').click(function () {
//             let message = $('#data').val();
//             $('#data').val('');

//             game.sendChat(message);
//         });

//         // when the client hits ENTER on their keyboard
//         $('#data').keypress(function (e) {
//             if (e.which == 13) {
//                 $('#datasend').focus().click();
//                 this.focus();
//             }
//         });

//         $body.mousemove(function (e) {
//             ui.mouseMove(e);
//         });

//         // $body.mouseup(function (e) {
//         //     let target = e.target.parentElement;
//         //     if (!EventBinding.holdDelay && $(target).hasClass("inventory-slot")) {
//         //         let id = target.getAttribute("slot");
//         //         let type = target.getAttribute("type");

//         //         ui.moveItemToSlot($(target), id, type);
//         //     }
//         // });

//         // $(".loot-slot").click(function(e) {
//         //     let id = this.getAttribute("slot");

//         //     ui.lootItem(Number(id));
//         // });

//         // $(".loot-slot").contextmenu(function(e) {
//         //     let id = this.getAttribute("slot");

//         //     ui.lootItem(Number(id));
//         // });

//         // $(".inventory-slot").mousedown(function (e) {
//         //     if (e.button == 2) {
//         //         return;
//         //     }

//         //     if (!ui.isDragging) {
//         //         EventBinding.holdDelay = true;
//         //         setTimeout(function () {
//         //             EventBinding.holdDelay = false;
//         //         }, 200);                
//         //     }

//         //     let id = this.getAttribute("slot");
//         //     let type = this.getAttribute("type");

//         //     ui.startDraggingFromSlot($(this), id, type, e.clientX, e.clientY);

//         //     e.preventDefault();
//         // });

//         // $(".inventory-slot").contextmenu(function (e) {
//         //     let id = this.getAttribute("slot");
//         //     let type = this.getAttribute("type");

//         //     ui.rightClickItem($(this), Number(id), type);
//         // });

//         // $("#character-close").click(function (e) {
//         //     $("#character").hide();
//         //     audio.playSoundBuffer("paperClose");
//         // });

//         // $("#inventory-close").click(function (e) {
//         //     $("#inventory").hide();
//         // });

//         // $("#menu-character").click(function (e) {
//         //     $("#character").show();
//         //     audio.playSoundBuffer("paper");
//         // });

//         // $("#menu-inventory").click(function (e) {
//         //     $("#inventory").show();
//         // });

//         // $("#interface").on("mouseenter mouseleave", ".item-slot", function (e) {
//         //     let id = e.target.parentElement.getAttribute("slot");
//         //     ui.hoverOverInventorySlot(e, Number(id));
//         // });

//         $("#interface").on("mousemove", ".item-slot", function (e) {
//             let tooltip = $("#item-tooltip");
//             tooltip.css("top", e.clientY + "px");
//             tooltip.css("left", e.clientX + "px");
//         });

//         $("#interface").on("mousedown", ".npc-vendor-item", function (e) {
//             let itemId = $(this).children(".npc-vendor-item-icon").attr("item-id");

//             ui.selectMerchantItem($(this), Number(itemId));
//         });

//         $("#vendor-close").click(function (e) {
//             ui.closeMerchantInterface();
//         });

//         $("#npc-vendor-buy-button").click(function (e) {
//             console.log("buy it");
//             ui.buyItem();
//         });

//         $(".character-tab").click(function(e) {
//             let currentTab = $(".character-tab.selected");
//             let currentTabWindow = $("#character-window-" + currentTab[0].getAttribute("type"));

//             let newTab = $(this);
//             let newTabWindow = $("#character-window-" + this.getAttribute("type"));

//             ui.switchCharacterWindowTab(currentTab, newTab, currentTabWindow, newTabWindow);
//         });

//         $(".character-stats-attribute-plus").click(function(e) {
//             let attributeType = this.getAttribute("type");

//             ui.setAttributePoint(attributeType);
//         });

//         $(".character-create-attribute-plus").click(function(e) {
//             let attributeType = this.getAttribute("type");
//             let valueDiv = $(".character-create-attribute[type=" + attributeType + "] .attribute-value");

//             ui.characterCreateAddAttribute(attributeType, valueDiv);
//         });

//         $(".character-create-attribute-minus").click(function(e) {
//             let attributeType = this.getAttribute("type");
//             let valueDiv = $(".character-create-attribute[type=" + attributeType + "] .attribute-value");

//             ui.characterCreateRemoveAttribute(attributeType, valueDiv);
//         });

//         $(".character-create-class-box").click(function(e) {
//             $(".character-create-class-box").removeClass("selected");
            
//             let type = this.getAttribute("type");

//             ui.selectClass(Number(type));

//             $(this).addClass("selected");
//         });
//     }
// }
