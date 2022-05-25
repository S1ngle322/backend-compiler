import React, { useCallback, useState } from 'react';
import { CodeEditorEditable } from 'react-code-editor-editable'
import 'highlight.js/styles/dracula.css';

import './Editor.css';

export function EditorComponent() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('Results');

    const onClick = useCallback(async () => {
        setIsLoading(true);

        const res = await fetch('http://localhost:3000/api/v1/compute', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: ` ${code}`
            })
        });

        const text = await res.text();

        setIsLoading(false);
        setResult(text);
    }, [code]);

    return (
        <div className="container">
            <h1 className="title">FypeScript</h1>
            <div className="editor">
                <CodeEditorEditable
                    value={code}
                    setValue={setCode}
                    width='600px'
                    height='40vh'
                    language='typescript'
                    inlineNumbers
                />
            </div>
            <button className="button" disabled={isLoading} onClick={onClick}>
                {isLoading ? 'Running...' : 'Run'}
            </button>
            <div className="output">
                {isLoading ? '' : result}
            </div>
        </div>
    );
}
