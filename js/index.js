const apiUrl ="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

fetch(apiUrl)
.then(response=>{
    if(!response.ok){
        throw new Error('Request failed');
    }
    
    return response.json()
})
.then(data=>{
    console.log(data)
})
.catch(error=>{
    console.error('An error occurred:', error);
})