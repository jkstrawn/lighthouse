import * as React from 'react';
import "../css/chat.css";
import Network from "../scripts/core/_networkManager";
import Ui from "../scripts/ui/_userInterface";

interface ChatMessage {
    username: string;
    message: string;
}

interface IChatState {
    message: string;
    history: Array<ChatMessage>;
}

export class Chat extends React.Component<{}, IChatState> {

    constructor() {
        super();

        this.state = {
            message: "",
            history: []
        }

        Ui.Chat = this;
    }

    public render() {
        return <div id="chat">
            <div id="channel">General</div>
            <div id="conversation" className="ui-element">
                <div id="conversation-messages">
                    <div>Welcome to Wayfare</div>
                    {this.state.history.map((chat, x) =>
                        <div key={x}>
                            {chat.username + ": " + chat.message}
                        </div>
                    )}
                </div>
                <div id="conversation-messages-border"></div>
                <form onSubmit={(e) => this.sendChat(e)}>
                    <div id="sendMessage">
                        <input id="data" value={this.state.message} onChange={(e) => this.updateMessage(e)} />
                        <input type="submit" value="" id="datasend"/>
                    </div>
                </form>
            </div>
        </div>;
    }

    updateLog(username: string, message: string) {
        this.state.history.push({username, message});

        this.setState({history: this.state.history});
    }

    private updateMessage(e) {
        this.setState({message: e.target.value});
    }

    private sendChat(e) {
        e.preventDefault();

        Network.sendChat({message: this.state.message});

        this.setState({message: ""});
    }
}
