function JobDescription({value, onChange}){
    return(
        <div>
            <label>Job Description:</label>
            <textarea 
            rows="6"
            value={value}
            onChange={(e)=>onChange(e.target.value)}
            />
        </div>
    );
}

export default JobDescription;