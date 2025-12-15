function AnalyzeButton({onAnalyze,disabled,loading}){
    return(
        <button onClick={onAnalyze} disabled={disabled || loading}>
         {loading ? "Analyzing..." : "Analyze Resume"} 
        </button>
    );
}
export default AnalyzeButton;