import React = require("react");
import WordObject from "../scripts/ui/wordObject";
import { CSSProperties } from "react";

interface IWordState {
    word: string;
}

interface IWordProps {
    wordObject: WordObject;
}

export class WordComponent extends React.Component<IWordProps, IWordState> {
    constructor(props) {
        super(props);

        this.state = { word: "sentence" };
    }

    public render() {
        let wordObject = this.props.wordObject;
        let style = this.getStyle();

        return <div className="word-area" style={style}>
            {wordObject.word.split('').map((x, i) => {
                let typed = i < wordObject.index;

                return <span key={i} className={typed ? "typed-letter" : ""}>
                    {x}
                </span>
            })}
        </div>
    }

    getStyle(): CSSProperties {
        return {
            left: this.props.wordObject.x + "px",
            top: this.props.wordObject.y + "px"
        }
    }
}