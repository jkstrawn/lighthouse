import * as React from 'react';
import WordObject from "../scripts/typing/wordObject";
import { CSSProperties } from "react";

interface IWordProps {
    wordObject: WordObject;
}

export class WordComponent extends React.Component<IWordProps, {}> {
    constructor(props) {
        super(props);
    }

    public render() {
        let wordObject = this.props.wordObject;
        let style = this.getStyle();

        return <div className="word-area" style={style}>
            <div className="first-word">
                {wordObject.word.split('').map((x, i) => {
                    let typed = i < wordObject.index;

                    return <span key={i} className={typed ? "typed-letter" : ""}>
                        {x}
                    </span>
                })}
            </div>
            <div className="next-word">
                {wordObject.nextWord}
            </div>
        </div>
    }

    getStyle(): CSSProperties {
        let word = this.props.wordObject;
        let style: CSSProperties = {};

        if (word.x > 0) {
            style.left = word.x + "px";
        } else if (word.x < 0) {
            style.right = -word.x + "px";
        } else {
            style.left = "calc(50% - 100px)";
        }

        if (word.y > 0) {
            style.top = word.y + "px";
        } else {
            style.bottom = -word.y + "px";
        }
        
        return style;
    }
}