import * as React from 'react';
import "../css/characterCreate.css";
import Ui from "../scripts/ui/_userInterface";
import Classes from "../../shared/entities/list/classList";
import CharacterCreateModel from "../../shared/network/fromClient/characterCreateModel";
import Attributes from "../../shared/entities/list/attributeList";
import PlayerAttribute from "../../shared/entities/model/playerAttribute";
import Network from "../scripts/core/_networkManager";
import ServerErrors from "../../shared/network/serverErrorEnum";
import { StringHelper } from "../../shared/helpers/helpers";

interface ICharacterCreateState {
    hidden?: boolean;
    model: CharacterCreateModel;
    pointsToSpend: number;
    showServerError?: boolean;
    serverErrorMessage?: string;
    showNameTooShortError?: boolean;
}

export class CharacterCreate extends React.Component<{}, ICharacterCreateState> {
    constructor() {
        super();

        this.state = {
            hidden: true,
            pointsToSpend: 12,
            model: {
                username: "",
                class: 1,
                attributes: [
                    { type: 1, value: 1 },
                    { type: 2, value: 1 },
                    { type: 3, value: 1 },
                    { type: 4, value: 1 },
                    { type: 5, value: 1 },
                    { type: 6, value: 1 },
                ]
            }
        };

        Ui.CharacterCreate = this;
        Ui.registerErrorHandler(ServerErrors.Register, (m) => this.showServerError(m));
    }

    public render() {
        let serverError = <div className="error">
            {this.state.serverErrorMessage}
        </div>

        let tooShortError = <div className="error">
            Username must be at least 3 characters
        </div>

        return <div id="character-create" className={this.state.hidden ? "hidden" : ""}>
            <div id="banner-left" className="character-create-banner">
                <div id="banner-left-header">Choose your class</div>
                <div id="character-create-classes">
                    {Classes.list().map((_class, x) =>
                        <div className="character-create-class-option" key={x}>
                            {_class.name}
                            <div id={"class-box-" + _class.id}
                                className={"character-create-class-box" + (this.state.model.class == _class.id ? " selected" : "")}
                                onClick={() => this.selectClass(_class.id)}>
                                <div id={"class-box-inner-" + _class.id}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div id="banner-right" className="character-create-banner">
                <div id="banner-right-header">Choose your attributes</div>
                <div id="character-create-points-left">{this.state.pointsToSpend} points left</div>

                <div id="character-create-attributes">
                    {this.state.model.attributes.map((attr, x) => {
                        let attrData = Attributes.getById(attr.type);

                        return <div className="character-create-attribute attribute" key={x}>
                            {attrData.name}
                            <div className="attribute-value">{attr.value}</div>
                        </div>
                    })}
                </div>

                <div id="character-create-attributes-minuses">
                    {this.state.model.attributes.map((attr, x) =>
                        <div key={x}
                            className="character-create-attribute-minus attribute-minus"
                            onClick={() => this.subtractAttribute(attr)} />
                    )}
                </div>

                <div id="character-create-attributes-pluses">
                    {this.state.model.attributes.map((attr, x) =>
                        <div key={x}
                            className="character-create-attribute-plus attribute-plus"
                            onClick={() => this.addAttribute(attr)} />
                    )}
                </div>
            </div>

            <div id="character-create-name">
                <form id="character-create-form" onSubmit={(e) => this.submit(e)}>
                    <div id="character-create-label">Enter Character Name</div>
                    <input
                        id="character-create-input"
                        className="character-name-input"
                        value={this.state.model.username}
                        onChange={(e) => this.changeName(e)} />
                    <div id="character-create-buttons">
                        <input id="character-create-button" className="join-button" type="submit" value="Create" />
                        <input id="character-create-back" className="join-button" value="Back" onClick={() => this.back()} />
                    </div>
                </form>
                {this.state.showServerError ? serverError : ""}
                {this.state.showNameTooShortError ? tooShortError : ""}
            </div>

        </div>;
    }

    private submit(e) {
        e.preventDefault();

        this.setState({showNameTooShortError: false, showServerError: false});

        if (this.state.model.username.length < 3) {
            this.setState({showNameTooShortError: true});
            return;
        }

        Network.createCharacter(this.state.model);
    }

    private showServerError(message: string) {
        this.setState({showServerError: true, serverErrorMessage: message});
    }

    private addAttribute(attr: PlayerAttribute) {
        if (this.state.pointsToSpend < 1) {
            return;
        }

        attr.value++;
        this.setState({ model: this.state.model, pointsToSpend: this.state.pointsToSpend - 1 });
    }

    private subtractAttribute(attr: PlayerAttribute) {
        if (attr.value <= 1) {
            return;
        }

        attr.value--;
        this.setState({ model: this.state.model, pointsToSpend: this.state.pointsToSpend + 1 });
    }

    private selectClass(type: number) {
        this.state.model.class = type;
        this.setState({ model: this.state.model });
    }

    private changeName(event) {
        this.state.model.username = StringHelper.capitalize(event.target.value);
        this.setState({ model: this.state.model });
    }

    private back() {
        this.setState({ hidden: true });
        Ui.Login.show();
    }

    show() {
        this.setState({ hidden: false });
    }
}
