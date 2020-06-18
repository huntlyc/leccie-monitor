import React from 'react';

const ReadingForm = function (props: any) {
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //Grab a hold of our input
        const readingInput: HTMLInputElement | null = (document.getElementById('reading') as HTMLInputElement);

        //Save only if 'good' numerical value
        if (readingInput){
            if (!isNaN(parseFloat(readingInput.value))) {

                const reading = parseFloat(readingInput.value).toFixed(2);

                props.onSuccess(reading);

                //reset the form
                readingInput.value = '';
                readingInput.focus();
                readingInput.classList.remove('error');

            } else if(readingInput.value !== '' && readingInput.value.toLowerCase() === 'clear') {
                props.onClear();
            } else {
                readingInput.classList.add('error');
            }
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="reading" className="sr-only">Latest Reading</label>
            <input type="text" id="reading" placeholder="Reading (e.g. 34.22)" />
            <button><span className="sr-only">Submit Reading</span>+</button>
        </form>
    );
}


export default ReadingForm;