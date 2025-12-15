function ResumeUpload({ onFileSelect }){
    return(
        <div>
            <label>Upload Resume</label>
            <input 
            type="file"
            onChange={(e) =>onFileSelect(e.target.files[0])}
            />
        </div>
    );
}

export default ResumeUpload;