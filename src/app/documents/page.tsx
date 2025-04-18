import { useEffect } from "react";

const DocumentPage = () => {
    useEffect(() => {
        window.location.href = "/"; // Redirect to the home page
    }, []);
    
    return null;
}
 
export default DocumentPage;