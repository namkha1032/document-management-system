import axios from "axios";
import delay from "../functions/delay";

export async function getAllOntologies(){
    let response = await axios.get("http://127.0.0.1:8000/api/ontology")
    return response.data.data
}

export async function getOntology(ontologyUrl){
    let response = await axios.get(`http://127.0.0.1:8000/api/ontology/${ontologyUrl}`)
    return response.data.data
}