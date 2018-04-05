import * as React from 'react';
import Network from "../scripts/core/_networkManager";
import "../css/login.css";
import Ui from "../scripts/ui/_userInterface";
import ServerErrors from "../../shared/network/serverErrorEnum";
import { StringHelper } from "../../shared/helpers/helpers";

interface ILoginState {
    hidden?: boolean;
    username: string;
    showServerError?: boolean;
    serverErrorMessage?: string;
    showUsernameTooShortError?: boolean;
}

export class Login extends React.Component<{}, ILoginState> {
    constructor() {
        super();

        Ui.Login = this;
        Ui.registerErrorHandler(ServerErrors.Login, (message) => this.showError(message));

        this.state = { username: "" };
    }

    public render() {
        const serverError =
            <div className="error">
                {this.state.serverErrorMessage}
            </div>

        const usernameTooShortError =
            <div className="error">
                Username must be at least 3 characters
            </div>

        return <div id="login" className={this.state.hidden ? "hidden" : ""}>
            <div id="login-header">Log In</div>
            <input id="new-character-button" value="Create Character" onClick={() => this.showCharacterCreateScreen()} />

            <div id="login-or">- OR -</div>

            <div id="existing-character">
                <form id="existing-character-form" onSubmit={(e) => this.login(e)}>
                    <div id="existing-character-label">Enter existing character name</div>
                    <input id="existing-character-input"
                        className="character-name-input"
                        value={this.state.username}
                        onChange={(e) => this.changeName(e)} />
                    <input id="existing-character-button" className="join-button" type="submit" value="Login" />
                </form>
            </div>

            {this.state.showUsernameTooShortError ? usernameTooShortError : ""}
            {this.state.showServerError ? serverError : ""}
        </div>;
    }

    show() {
        this.setState({ hidden: false });
    }

    private showError(message: string) {
        this.setState({ showServerError: true, serverErrorMessage: message });
    }

    private showCharacterCreateScreen() {
        this.setState({ hidden: true });
        Ui.CharacterCreate.show();
    }

    private login(e) {
        e.preventDefault();

        if (this.state.username.length < 3) {
            this.setState({ showUsernameTooShortError: true });
            return;
        }


        this.setState({ showServerError: false, showUsernameTooShortError: false });

        Network.joinWithCharacter({ name: this.state.username });
    }

    private changeName(event) {
        this.setState({ username: StringHelper.capitalize(event.target.value) });
    }
}
