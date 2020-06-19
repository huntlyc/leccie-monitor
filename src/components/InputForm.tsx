import React, { FunctionComponent, useState } from 'react';

type ReadingFormProps = {
    onSuccess: (reading: string) => void,
    onClear: () => void,
};

const ReadingForm: FunctionComponent<ReadingFormProps> = ({onSuccess,onClear}) => {
    const [invalidInput, updateErrorStatusTo] = useState<boolean>(false);
    const onReadingSubmission = (e: React.FormEvent) => {
        e.preventDefault();

        const readingInput: HTMLInputElement | null = (document.getElementById('reading') as HTMLInputElement);

        if (readingInput){

            const resetForm = () => {
                readingInput.value = '';
                readingInput.focus();

                updateErrorStatusTo(false);
            };

            if (!isNaN(parseFloat(readingInput.value))) {
                const readingValue = parseFloat(readingInput.value).toFixed(2);
                onSuccess(readingValue);
                resetForm();
            } else if(readingInput.value !== '' && readingInput.value.toLowerCase() === 'clear') {
                onClear();
                resetForm();
            } else {
                updateErrorStatusTo(true);
            }
        }
    };

    return (
        <form onSubmit={onReadingSubmission}>
            <div className="inputrow">
                <label htmlFor="reading" className="sr-only">Latest Reading</label>
                <input className={invalidInput ? 'error' : '' } id="reading" type="text" inputMode="decimal" autoComplete="off" placeholder="Reading (e.g. 34.22)" />
                <button><span className="sr-only">Submit Reading</span>+</button>
            </div>
            {invalidInput && <p className="error-message">Please enter number or "Clear"</p>}
        </form>
    );
}


export default ReadingForm;
