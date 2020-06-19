import React, { FunctionComponent, useState } from 'react';

type ReadingFormProps = {
    onSuccess: (reading: string) => void,
    onClear: () => void,
};

const ReadingForm: FunctionComponent<ReadingFormProps> = ({onSuccess,onClear}) => {
    const [isError, updateError] = useState<boolean>(false);
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //Grab a hold of our input
        const readingInput: HTMLInputElement | null = (document.getElementById('reading') as HTMLInputElement);

        //Save only if 'good' numerical value
        if (readingInput){

            const resetForm = () => {
                //reset the form
                readingInput.value = '';
                readingInput.focus();
                updateError(false);
            };

            if (!isNaN(parseFloat(readingInput.value))) {
                const reading = parseFloat(readingInput.value).toFixed(2);
                onSuccess(reading);
                resetForm();
            } else if(readingInput.value !== '' && readingInput.value.toLowerCase() === 'clear') {
                onClear();
                resetForm();
            } else {
                updateError(true);
            }
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="inputrow">
                <label htmlFor="reading" className="sr-only">Latest Reading</label>
                <input className={isError ? 'error' : '' } id="reading" type="text" inputMode="decimal" autoComplete="off" placeholder="Reading (e.g. 34.22)" />
                <button><span className="sr-only">Submit Reading</span>+</button>
            </div>
            {isError && <p className="error-message">Please enter number or "Clear"</p>}
        </form>
    );
}


export default ReadingForm;
