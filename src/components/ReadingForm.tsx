import React, { FunctionComponent, useState, useRef } from 'react';


type ReadingFormProps = {
    onSuccess: (reading: string) => void,
};


const ReadingForm: FunctionComponent<ReadingFormProps> = ({onSuccess}) => {
    const [invalidInput, updateErrorStatusTo] = useState<boolean>(false);
    const [readingVal, setReadingValTo] = useState('');
    const readingInput = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setReadingValTo('');
        if(readingInput && readingInput.current){
            readingInput.current.focus();
        }

        updateErrorStatusTo(false);
    };
    const onReadingSubmission = (e: React.FormEvent) => {
        e.preventDefault();

        if (readingVal){
            if (!isNaN(parseFloat(readingVal))) {
                const readingValue = parseFloat(readingVal).toFixed(2);

                onSuccess(readingValue);
                resetForm();
            } else {
                updateErrorStatusTo(true);
            }
        }
    };


    const readingChangeHandler = (e: React.FormEvent) => {
        setReadingValTo((e.target as HTMLInputElement).value);
    }

    return (
        <form onSubmit={onReadingSubmission}>
            <div className="input-row">
                <label htmlFor="reading" className="sr-only">Latest Reading</label>
                <input ref={readingInput} onChange={readingChangeHandler} className={invalidInput ? 'error' : '' } id="reading" type="text" inputMode="decimal" autoComplete="off" placeholder="Add Reading (e.g. 34.22)"  value={readingVal}/>
                <button><span className="sr-only">Submit Reading</span>+</button>
            </div>
            {invalidInput && <p className="error-message">Please enter a numeric value</p>}
        </form>
    );
}


export default ReadingForm;
